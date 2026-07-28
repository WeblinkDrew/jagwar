import path from 'node:path';

import type { ArchitecturePolicy, Finding, WorkspacePackage } from './types';
import { addedText, assertCommit, baselineFiles, currentFiles, diffEntries } from './git';
import { extractImports, newCycleEdges, ownerPackage, workspaceImportName } from './imports';
import {
    baselinePackages,
    currentPackages,
    loadApprovals,
    loadPolicy,
    packageGraph,
} from './policy';

function isUnderSourceRoot(file: string, policy: ArchitecturePolicy): boolean {
    return policy.sourceRoots.some((root) => file === root || file.startsWith(`${root}/`));
}

function isIgnored(file: string, policy: ArchitecturePolicy): boolean {
    return file.split('/').some((part) => policy.ignoredDirectories.includes(part));
}

function isSource(file: string, policy: ArchitecturePolicy): boolean {
    return (
        isUnderSourceRoot(file, policy) &&
        !isIgnored(file, policy) &&
        policy.sourceExtensions.includes(path.extname(file))
    );
}

async function contentHash(root: string, file: string): Promise<string> {
    const target = Bun.file(path.join(root, file));
    if (!(await target.exists())) return 'deleted';
    const hasher = new Bun.CryptoHasher('sha256');
    hasher.update(await target.arrayBuffer());
    return hasher.digest('hex');
}

function matchesImportRule(file: string, specifier: string, policy: ArchitecturePolicy): Finding[] {
    return policy.importRules.flatMap((rule) => {
        if (!rule.sourcePrefixes.some((prefix) => file.startsWith(prefix))) return [];
        if (!rule.importPatterns.some((pattern) => new RegExp(pattern).test(specifier))) return [];
        return [
            {
                severity: 'error' as const,
                rule: rule.id,
                path: file,
                message: `${rule.message} Found: ${specifier}`,
            },
        ];
    });
}

function packageDependencyFindings(
    file: string,
    specifier: string,
    packages: WorkspacePackage[],
): Finding[] {
    const source = ownerPackage(file, packages);
    const targetName = workspaceImportName(specifier);
    if (!source || !targetName || source.name === targetName) return [];
    if (!packages.some((pkg) => pkg.name === targetName)) return [];
    if (source.dependencies.has(targetName)) return [];
    return [
        {
            severity: 'error',
            rule: 'workspace-dependency-must-be-declared',
            path: file,
            message: `${source.name} imports ${targetName}, but its package manifest does not declare that workspace dependency.`,
        },
    ];
}

export async function runArchitectureCheck(root: string): Promise<Finding[]> {
    const policy = await loadPolicy(root);
    const approvals = await loadApprovals(root, policy);
    await assertCommit(root, policy.baselineCommit);

    const [baseline, current, changes] = await Promise.all([
        baselineFiles(root, policy.baselineCommit),
        currentFiles(root),
        diffEntries(root, policy.baselineCommit),
    ]);
    const findings: Finding[] = [];

    const protectedChanges = new Set(
        changes.flatMap((entry) => entry.paths).filter((file) => baseline.has(file)),
    );
    for (const file of [...protectedChanges].sort()) {
        const hash = await contentHash(root, file);
        const approval = approvals.approvals.find(
            (candidate) =>
                candidate.path === file &&
                candidate.status === 'approved' &&
                candidate.approvedContentSha256 === hash,
        );
        if (!approval) {
            findings.push({
                severity: 'error',
                rule: 'protected-core-requires-approved-ccr',
                path: file,
                message: `Protected baseline content is not hash-bound to an approved Core Change Request (current state: ${hash}).`,
            });
        }
    }

    const currentWorkspacePackages = await currentPackages(root, current);
    const baselineWorkspacePackages = await baselinePackages(root, policy.baselineCommit, baseline);
    const importCandidates: Array<{ file: string; source: string; wholeFile: boolean }> = [];

    for (const file of current.filter((candidate) => isSource(candidate, policy)).sort()) {
        const wholeFile = !baseline.has(file);
        if (!wholeFile && !protectedChanges.has(file)) continue;
        const source = wholeFile
            ? await Bun.file(path.join(root, file)).text()
            : await addedText(root, policy.baselineCommit, file);
        importCandidates.push({ file, source, wholeFile });
    }

    for (const candidate of importCandidates) {
        const imports = extractImports(candidate.source);
        for (const specifier of imports) {
            findings.push(...matchesImportRule(candidate.file, specifier, policy));
            findings.push(
                ...packageDependencyFindings(candidate.file, specifier, currentWorkspacePackages),
            );
        }

        if (candidate.wholeFile && /^\s*['"]use client['"];?/m.test(candidate.source)) {
            for (const specifier of imports) {
                if (
                    policy.clientForbiddenImportPatterns.some((pattern) =>
                        new RegExp(pattern).test(specifier),
                    )
                ) {
                    findings.push({
                        severity: 'error',
                        rule: 'client-module-must-not-import-server-code',
                        path: candidate.file,
                        message: `Client module imports server-only dependency: ${specifier}`,
                    });
                }
            }
        }
    }

    for (const [source, target] of newCycleEdges(
        packageGraph(baselineWorkspacePackages),
        packageGraph(currentWorkspacePackages),
    )) {
        findings.push({
            severity: 'error',
            rule: 'no-new-workspace-cycles',
            path: currentWorkspacePackages.find((pkg) => pkg.name === source)?.directory ?? source,
            message: `New workspace edge ${source} -> ${target} participates in a dependency cycle.`,
        });
    }

    for (const file of current
        .filter((candidate) => !baseline.has(candidate) && isSource(candidate, policy))
        .sort()) {
        const text = await Bun.file(path.join(root, file)).text();
        const lines = text === '' ? 0 : text.split('\n').length;
        if (lines > policy.warningThresholds.authoredFileLines) {
            findings.push({
                severity: 'warning',
                rule: 'review-large-authored-file',
                path: file,
                message: `${lines} lines exceeds the advisory threshold; confirm the file remains one cohesive responsibility.`,
            });
        }
        if (file.split('/').length > policy.warningThresholds.pathDepth) {
            findings.push({
                severity: 'warning',
                rule: 'review-deep-source-path',
                path: file,
                message:
                    'Path exceeds the advisory depth threshold; confirm every directory adds semantic ownership.',
            });
        }
    }

    return findings.sort(
        (a, b) =>
            a.severity.localeCompare(b.severity) ||
            a.rule.localeCompare(b.rule) ||
            a.path.localeCompare(b.path) ||
            a.message.localeCompare(b.message),
    );
}
