#!/usr/bin/env bun
import { runArchitectureCheck } from './checker';
import { repositoryRoot } from './git';

const args = new Set(Bun.argv.slice(2));
const reportOnly = args.has('--report');
const unsupported = [...args].filter((arg) => !['--all', '--changed', '--report'].includes(arg));
if (unsupported.length > 0) {
    console.error(`Unsupported architecture-check argument(s): ${unsupported.join(', ')}`);
    process.exit(2);
}

try {
    const root = await repositoryRoot(process.cwd());
    const findings = await runArchitectureCheck(root);
    const errors = findings.filter((finding) => finding.severity === 'error');
    const warnings = findings.filter((finding) => finding.severity === 'warning');

    for (const finding of findings) {
        const label = finding.severity.toUpperCase();
        console.log(`${label} [${finding.rule}] ${finding.path}`);
        console.log(`  ${finding.message}`);
    }

    console.log(`Architecture contract: ${errors.length} error(s), ${warnings.length} warning(s).`);
    if (errors.length > 0 && !reportOnly) process.exit(1);
} catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(2);
}
