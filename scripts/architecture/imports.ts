import path from 'node:path';

import type { WorkspacePackage } from './types';

const STATIC_IMPORT = /\b(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\sfrom\s*)?['"]([^'"]+)['"]/g;
const DYNAMIC_IMPORT = /\b(?:import|require)\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

export function extractImports(source: string): string[] {
    const imports = new Set<string>();
    for (const pattern of [STATIC_IMPORT, DYNAMIC_IMPORT]) {
        pattern.lastIndex = 0;
        for (const match of source.matchAll(pattern)) {
            if (match[1]) imports.add(match[1]);
        }
    }
    return [...imports].sort();
}

export function workspaceImportName(specifier: string): string | null {
    const match = /^(@[^/]+\/[^/]+)/.exec(specifier);
    return match?.[1] ?? null;
}

export function ownerPackage(file: string, packages: WorkspacePackage[]): WorkspacePackage | null {
    const normalized = file.split(path.sep).join('/');
    return (
        packages
            .filter(
                (pkg) => normalized === pkg.directory || normalized.startsWith(`${pkg.directory}/`),
            )
            .sort((a, b) => b.directory.length - a.directory.length)[0] ?? null
    );
}

export function hasPath(graph: Map<string, Set<string>>, start: string, goal: string): boolean {
    const pending = [start];
    const visited = new Set<string>();
    while (pending.length > 0) {
        const current = pending.pop();
        if (!current || visited.has(current)) continue;
        if (current === goal) return true;
        visited.add(current);
        pending.push(...(graph.get(current) ?? []));
    }
    return false;
}

export function newCycleEdges(
    baselineGraph: Map<string, Set<string>>,
    currentGraph: Map<string, Set<string>>,
): Array<[string, string]> {
    const cycles: Array<[string, string]> = [];
    for (const [source, targets] of currentGraph) {
        for (const target of targets) {
            if (baselineGraph.get(source)?.has(target)) continue;
            if (hasPath(currentGraph, target, source)) cycles.push([source, target]);
        }
    }
    return cycles.sort(([aSource, aTarget], [bSource, bTarget]) =>
        `${aSource}:${aTarget}`.localeCompare(`${bSource}:${bTarget}`),
    );
}
