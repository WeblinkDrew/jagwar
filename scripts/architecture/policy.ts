import path from 'node:path';

import type { ArchitecturePolicy, CoreChangeApprovalFile, WorkspacePackage } from './types';
import { baselineText } from './git';

function dependencyNames(manifest: Record<string, unknown>): Set<string> {
    const names = new Set<string>();
    for (const field of [
        'dependencies',
        'devDependencies',
        'peerDependencies',
        'optionalDependencies',
    ]) {
        const dependencies = manifest[field];
        if (!dependencies || typeof dependencies !== 'object') continue;
        for (const name of Object.keys(dependencies)) names.add(name);
    }
    return names;
}

export async function loadPolicy(root: string): Promise<ArchitecturePolicy> {
    const policy = (await Bun.file(
        path.join(root, 'architecture/policy.json'),
    ).json()) as ArchitecturePolicy;
    if (policy.version !== 1 || !policy.baselineCommit || !policy.approvalsFile) {
        throw new Error('Unsupported or incomplete architecture policy.');
    }
    return policy;
}

export async function loadApprovals(
    root: string,
    policy: ArchitecturePolicy,
): Promise<CoreChangeApprovalFile> {
    const approvals = (await Bun.file(
        path.join(root, policy.approvalsFile),
    ).json()) as CoreChangeApprovalFile;
    if (approvals.baselineCommit !== policy.baselineCommit) {
        throw new Error(
            'Architecture policy and Core Change Request registry use different baselines.',
        );
    }
    return approvals;
}

function isWorkspaceManifest(file: string): boolean {
    if (file === 'docs/package.json') return true;
    return /^(?:apps|packages|tooling)\/(?:[^/]+|web\/[^/]+)\/package\.json$/.test(file);
}

function packageFromManifest(
    file: string,
    manifest: Record<string, unknown>,
): WorkspacePackage | null {
    if (typeof manifest.name !== 'string') return null;
    return {
        name: manifest.name,
        directory: path.posix.dirname(file),
        dependencies: dependencyNames(manifest),
    };
}

export async function currentPackages(root: string, files: string[]): Promise<WorkspacePackage[]> {
    const packages: WorkspacePackage[] = [];
    for (const file of files.filter(isWorkspaceManifest)) {
        const manifest = (await Bun.file(path.join(root, file)).json()) as Record<string, unknown>;
        const pkg = packageFromManifest(file, manifest);
        if (pkg) packages.push(pkg);
    }
    return packages;
}

export async function baselinePackages(
    root: string,
    baseline: string,
    files: Set<string>,
): Promise<WorkspacePackage[]> {
    const packages: WorkspacePackage[] = [];
    for (const file of [...files].filter(isWorkspaceManifest).sort()) {
        const manifest = JSON.parse(await baselineText(root, baseline, file)) as Record<
            string,
            unknown
        >;
        const pkg = packageFromManifest(file, manifest);
        if (pkg) packages.push(pkg);
    }
    return packages;
}

export function packageGraph(packages: WorkspacePackage[]): Map<string, Set<string>> {
    const workspaceNames = new Set(packages.map((pkg) => pkg.name));
    return new Map(
        packages.map((pkg) => [
            pkg.name,
            new Set([...pkg.dependencies].filter((dependency) => workspaceNames.has(dependency))),
        ]),
    );
}
