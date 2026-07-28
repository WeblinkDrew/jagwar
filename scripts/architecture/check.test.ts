import { describe, expect, test } from 'bun:test';

import { extractImports, newCycleEdges, workspaceImportName } from './imports';

describe('architecture import analysis', () => {
    test('extracts static, exported, dynamic, and required imports', () => {
        const importKeyword = 'im' + 'port';
        const exportKeyword = 'ex' + 'port';
        const requireKeyword = 're' + 'quire';
        const source = `
            ${importKeyword} type { Project } from '@onlook/models';
            ${importKeyword} '@onlook/ui/globals.css';
            ${exportKeyword} { thing } from '@onlook/utility';
            const lazy = ${importKeyword}('@onlook/web-client/src/private');
            const legacy = ${requireKeyword}('@onlook/db/src/client');
        `;
        expect(extractImports(source)).toEqual([
            '@onlook/db/src/client',
            '@onlook/models',
            '@onlook/ui/globals.css',
            '@onlook/utility',
            '@onlook/web-client/src/private',
        ]);
    });

    test('normalizes a workspace subpath to its package name', () => {
        expect(workspaceImportName('@onlook/ui/button')).toBe('@onlook/ui');
        expect(workspaceImportName('./button')).toBeNull();
    });

    test('reports only cycle-closing edges absent from the baseline', () => {
        const baseline = new Map([
            ['a', new Set(['b'])],
            ['b', new Set<string>()],
        ]);
        const current = new Map([
            ['a', new Set(['b'])],
            ['b', new Set(['a'])],
        ]);
        expect(newCycleEdges(baseline, current)).toEqual([['b', 'a']]);
    });
});
