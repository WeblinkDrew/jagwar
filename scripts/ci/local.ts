#!/usr/bin/env bun

type Mode = 'structure' | 'pre-push' | 'full';

interface Check {
    name: string;
    command: string[];
}

function selectedMode(args: string[]): Mode {
    const index = args.indexOf('--mode');
    const value = index >= 0 ? args[index + 1] : 'pre-push';
    if (value === 'structure' || value === 'pre-push' || value === 'full') return value;
    throw new Error('Use --mode structure, --mode pre-push, or --mode full.');
}

function checksFor(mode: Mode): Check[] {
    const checks: Check[] = [
        {
            name: 'Architecture contract',
            command: ['bun', 'scripts/architecture/check.ts', '--changed'],
        },
        {
            name: 'Architecture checker tests',
            command: [
                'bun',
                'test',
                'scripts/architecture/check.test.ts',
                'scripts/architecture/placement.test.ts',
            ],
        },
    ];

    if (mode === 'pre-push' || mode === 'full') {
        checks.push(
            {
                name: 'Web client typecheck',
                command: ['bun', 'run', 'typecheck'],
            },
            {
                name: 'Whitespace and conflict-marker check',
                command: ['git', 'diff', '--check'],
            },
        );
    }

    if (mode === 'full') {
        checks.push({
            name: 'Repository tests',
            command: ['bun', 'test', '--timeout', '30000'],
        });
    }

    return checks;
}

async function run(check: Check): Promise<void> {
    const started = performance.now();
    console.log(`\n▶ ${check.name}`);
    const child = Bun.spawn(check.command, {
        cwd: process.cwd(),
        stdin: 'inherit',
        stdout: 'inherit',
        stderr: 'inherit',
    });
    const exitCode = await child.exited;
    const seconds = ((performance.now() - started) / 1000).toFixed(2);
    if (exitCode !== 0) {
        throw new Error(`${check.name} failed after ${seconds}s.`);
    }
    console.log(`✓ ${check.name} (${seconds}s)`);
}

try {
    const mode = selectedMode(Bun.argv.slice(2));
    const started = performance.now();
    console.log(`Jagwar local verification: ${mode}`);
    for (const check of checksFor(mode)) await run(check);
    console.log(
        `\nAll ${mode} checks passed in ${((performance.now() - started) / 1000).toFixed(2)}s.`,
    );
} catch (error) {
    console.error(`\n${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
}
