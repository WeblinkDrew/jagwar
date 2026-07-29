#!/usr/bin/env bun

const expected = '.githooks';
const checkOnly = Bun.argv.includes('--check');

function gitConfig(args: string[]): string {
    const result = Bun.spawnSync(['git', 'config', ...args], {
        cwd: process.cwd(),
        stderr: 'pipe',
        stdout: 'pipe',
    });
    if (result.exitCode !== 0) {
        throw new Error(result.stderr.toString().trim() || `git config ${args.join(' ')} failed`);
    }
    return result.stdout.toString().trim();
}

try {
    if (!checkOnly) gitConfig(['core.hooksPath', expected]);
    const configured = gitConfig(['--get', 'core.hooksPath']);
    if (configured !== expected) {
        throw new Error(`Expected core.hooksPath=${expected}; found ${configured || '<unset>'}.`);
    }
    console.log(`Git hooks enabled from ${expected}.`);
} catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
}
