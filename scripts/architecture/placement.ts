import path from 'node:path';

import type { ArchitectureSliceManifest, Finding, PlacementPolicy } from './types';

interface PlacementCheckInput {
    policy: PlacementPolicy;
    manifests: ArchitectureSliceManifest[];
    changedPaths: string[];
    pinnedBaselineFiles: Set<string>;
}

function isGoverned(file: string, policy: PlacementPolicy): boolean {
    return policy.governedPrefixes.some(
        (prefix) => file === prefix.replace(/\/$/, '') || file.startsWith(prefix),
    );
}

function isSafeRelativePath(file: string): boolean {
    return (
        file !== '' &&
        !path.posix.isAbsolute(file) &&
        !file.split('/').some((segment) => segment === '..' || segment === '.')
    );
}

function manifestFindings(manifest: ArchitectureSliceManifest): Finding[] {
    const manifestPath = `architecture/slices/${manifest.slice || 'unknown'}.json`;
    const findings: Finding[] = [];

    if (
        manifest.version !== 1 ||
        !manifest.slice ||
        !manifest.capability ||
        !manifest.owningRuntime
    ) {
        findings.push({
            severity: 'error',
            rule: 'slice-manifest-must-identify-owner',
            path: manifestPath,
            message: 'A slice manifest needs version 1, slice, capability, and owningRuntime.',
        });
    }

    if (!Array.isArray(manifest.paths) || manifest.paths.length === 0) {
        findings.push({
            severity: 'error',
            rule: 'slice-manifest-must-declare-paths',
            path: manifestPath,
            message: 'A slice manifest must declare at least one exact repository path.',
        });
        return findings;
    }

    for (const declaration of manifest.paths) {
        if (!isSafeRelativePath(declaration.path) || !declaration.role) {
            findings.push({
                severity: 'error',
                rule: 'slice-manifest-path-must-be-exact',
                path: manifestPath,
                message: `Invalid or unexplained path declaration: ${declaration.path || '<empty>'}`,
            });
        }
        if (!['new', 'protected-original'].includes(declaration.classification)) {
            findings.push({
                severity: 'error',
                rule: 'slice-path-classification-must-be-valid',
                path: declaration.path || manifestPath,
                message: `Unsupported path classification: ${String(declaration.classification)}`,
            });
        }
        if (declaration.classification === 'protected-original' && !declaration.coreChangeRequest) {
            findings.push({
                severity: 'error',
                rule: 'protected-declaration-requires-ccr',
                path: declaration.path,
                message:
                    'A protected-original declaration must name its exact Core Change Request.',
            });
        }
    }

    return findings;
}

export function placementFindings(input: PlacementCheckInput): Finding[] {
    const findings = input.manifests.flatMap(manifestFindings);
    const declarations = new Map(
        input.manifests.flatMap((manifest) =>
            manifest.paths.map((declaration) => [declaration.path, declaration] as const),
        ),
    );

    for (const file of [...new Set(input.changedPaths)].filter(Boolean).sort()) {
        if (!isGoverned(file, input.policy)) continue;

        const declaration = declarations.get(file);
        if (!declaration) {
            findings.push({
                severity: 'error',
                rule: 'changed-path-must-be-declared',
                path: file,
                message:
                    'Declare this path in an architecture/slices manifest before implementation.',
            });
        } else {
            const expected = input.pinnedBaselineFiles.has(file) ? 'protected-original' : 'new';
            if (declaration.classification !== expected) {
                findings.push({
                    severity: 'error',
                    rule: 'slice-path-classification-must-match-repository',
                    path: file,
                    message: `Manifest classifies this path as ${declaration.classification}; repository history requires ${expected}.`,
                });
            }
        }

        for (const rule of input.policy.forbiddenPathPatterns) {
            if (!new RegExp(rule.pattern).test(file)) continue;
            findings.push({
                severity: 'error',
                rule: rule.id,
                path: file,
                message: rule.message,
            });
        }

        const packageManifest = /^(packages\/[^/]+)\/package\.json$/.exec(file);
        if (
            packageManifest &&
            !input.pinnedBaselineFiles.has(file) &&
            !input.policy.allowedNewWorkspacePackageDirectories.includes(packageManifest[1] ?? '')
        ) {
            findings.push({
                severity: 'error',
                rule: 'new-workspace-package-must-be-planned',
                path: file,
                message:
                    'Add only a focused package already allocated by the architecture plan, or review the policy first.',
            });
        }
    }

    return findings;
}
