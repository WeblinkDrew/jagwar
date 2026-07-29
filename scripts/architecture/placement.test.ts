import { describe, expect, test } from 'bun:test';

import type { ArchitectureSliceManifest, PlacementPolicy } from './types';
import { placementFindings } from './placement';

const policy: PlacementPolicy = {
    baselineCommit: 'placement-baseline',
    manifestsDirectory: 'architecture/slices',
    governedPrefixes: ['apps/', 'packages/', 'scripts/'],
    forbiddenPathPatterns: [
        {
            id: 'no-junk',
            pattern: '(^|/)misc(?:/|$)',
            message: 'Use a capability directory.',
        },
        {
            id: 'no-story-folders',
            pattern: '(^|/)story[-_]?[0-9]+[a-z]?(?:/|$)',
            message: 'Do not organize runtime code by story.',
        },
    ],
    allowedNewWorkspacePackageDirectories: ['packages/business-policy'],
};

function manifest(paths: ArchitectureSliceManifest['paths']): ArchitectureSliceManifest {
    return {
        version: 1,
        slice: '1.3a',
        capability: 'business-policy',
        owningRuntime: 'package',
        paths,
    };
}

function rules(findings: ReturnType<typeof placementFindings>): string[] {
    return findings.map((finding) => finding.rule);
}

describe('architecture placement contract', () => {
    test('requires every governed changed path to be declared', () => {
        const findings = placementFindings({
            policy,
            manifests: [],
            changedPaths: ['packages/business-policy/src/release.ts'],
            pinnedBaselineFiles: new Set(),
        });

        expect(rules(findings)).toContain('changed-path-must-be-declared');
    });

    test('accepts a correctly classified focused capability path', () => {
        const file = 'packages/business-policy/src/release.ts';
        const findings = placementFindings({
            policy,
            manifests: [manifest([{ path: file, classification: 'new', role: 'policy contract' }])],
            changedPaths: [file],
            pinnedBaselineFiles: new Set(),
        });

        expect(findings).toEqual([]);
    });

    test('rejects generic and story-number runtime folders', () => {
        const generic = 'apps/web/client/src/misc/helper.ts';
        const story = 'apps/web/client/src/story-13/service.ts';
        const findings = placementFindings({
            policy,
            manifests: [
                manifest([
                    { path: generic, classification: 'new', role: 'helper' },
                    { path: story, classification: 'new', role: 'service' },
                ]),
            ],
            changedPaths: [generic, story],
            pinnedBaselineFiles: new Set(),
        });

        expect(rules(findings)).toContain('no-junk');
        expect(rules(findings)).toContain('no-story-folders');
    });

    test('rejects an unplanned workspace package', () => {
        const file = 'packages/everything/package.json';
        const findings = placementFindings({
            policy,
            manifests: [manifest([{ path: file, classification: 'new', role: 'manifest' }])],
            changedPaths: [file],
            pinnedBaselineFiles: new Set(),
        });

        expect(rules(findings)).toContain('new-workspace-package-must-be-planned');
    });

    test('requires protected paths to identify a Core Change Request', () => {
        const file = 'apps/web/client/src/server/api/root.ts';
        const findings = placementFindings({
            policy,
            manifests: [
                manifest([
                    {
                        path: file,
                        classification: 'protected-original',
                        role: 'router registration',
                    },
                ]),
            ],
            changedPaths: [file],
            pinnedBaselineFiles: new Set([file]),
        });

        expect(rules(findings)).toContain('protected-declaration-requires-ccr');
    });

    test('rejects a declaration that disagrees with repository history', () => {
        const file = 'apps/web/client/src/server/api/root.ts';
        const findings = placementFindings({
            policy,
            manifests: [manifest([{ path: file, classification: 'new', role: 'checker' }])],
            changedPaths: [file],
            pinnedBaselineFiles: new Set([file]),
        });

        expect(rules(findings)).toContain('slice-path-classification-must-match-repository');
    });

    test('rejects an unsupported manifest classification', () => {
        const file = 'packages/business-policy/src/release.ts';
        const invalidManifest = manifest([
            {
                path: file,
                classification: 'maybe' as unknown as 'new',
                role: 'policy contract',
            },
        ]);
        const findings = placementFindings({
            policy,
            manifests: [invalidManifest],
            changedPaths: [file],
            pinnedBaselineFiles: new Set(),
        });

        expect(rules(findings)).toContain('slice-path-classification-must-be-valid');
    });
});
