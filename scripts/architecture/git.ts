import path from 'node:path';

import type { DiffEntry } from './types';

export async function git(root: string, args: string[]): Promise<string> {
    const process = Bun.spawn(['git', ...args], {
        cwd: root,
        stdout: 'pipe',
        stderr: 'pipe',
    });
    const [stdout, stderr, exitCode] = await Promise.all([
        new Response(process.stdout).text(),
        new Response(process.stderr).text(),
        process.exited,
    ]);
    if (exitCode !== 0) {
        throw new Error(`git ${args.join(' ')} failed: ${stderr.trim()}`);
    }
    return stdout;
}

export async function repositoryRoot(cwd: string): Promise<string> {
    return (await git(cwd, ['rev-parse', '--show-toplevel'])).trim();
}

export async function assertCommit(root: string, commit: string): Promise<void> {
    await git(root, ['cat-file', '-e', `${commit}^{commit}`]);
}

export async function baselineFiles(root: string, commit: string): Promise<Set<string>> {
    const output = await git(root, ['ls-tree', '-r', '--name-only', commit]);
    return new Set(output.split('\n').filter(Boolean));
}

export async function currentFiles(root: string): Promise<string[]> {
    const output = await git(root, ['ls-files', '--cached', '--others', '--exclude-standard']);
    const files = output.split('\n').filter(Boolean);
    const present: string[] = [];
    for (const file of files) {
        if (await Bun.file(path.join(root, file)).exists()) present.push(file);
    }
    return present;
}

export async function diffEntries(root: string, commit: string): Promise<DiffEntry[]> {
    const output = await git(root, ['diff', '--name-status', commit, '--']);
    return output
        .split('\n')
        .filter(Boolean)
        .map((line) => {
            const [status = '', ...paths] = line.split('\t');
            return { status, paths };
        });
}

export async function addedText(root: string, commit: string, file: string): Promise<string> {
    const output = await git(root, ['diff', '--unified=0', commit, '--', file]);
    return output
        .split('\n')
        .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
        .map((line) => line.slice(1))
        .join('\n');
}

export async function baselineText(root: string, commit: string, file: string): Promise<string> {
    return git(root, ['show', `${commit}:${file}`]);
}
