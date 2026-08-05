import { describe, expect, test } from 'bun:test';

import * as businessPolicy from '../src';
import {
    getQualificationFixtureRelease,
    PolicyContractError,
    requireFixturePolicyRelease,
} from '../src';

describe('deterministic non-production policy fixtures', () => {
    test('returns stable checked identity, canonical payload, provenance, and safe diff', async () => {
        const first = await getQualificationFixtureRelease();
        const second = await getQualificationFixtureRelease();

        expect(first).toEqual(second);
        expect(first).toBe(second);
        expect(first.releaseId).toBe('policy_fixture_qualification_discovery_v1');
        expect(first.effectiveAt).toBe('2026-07-29T00:00:00.000Z');
        expect(first.payloadHash).toBe(
            'f6151993a05395940468f2cafc84c8d722f2ee2a7d06015fd9a695907d8839a1',
        );
        expect(first.validation.payloadHash).toBe(first.payloadHash);
        expect(first.safeDiff).toEqual([
            {
                path: '/',
                change: 'added',
                afterHash: first.payloadHash,
            },
        ]);
    });

    test('is explicitly non-production and contains only synthetic fixture references', async () => {
        const release = await getQualificationFixtureRelease();
        const serialized = JSON.stringify(release);

        expect(release.origin).toEqual({
            type: 'deterministic-fixture',
            actorId: 'system:jagwar-fixture',
            scope: 'non-production',
        });
        expect(serialized).toContain('fixture:');
        expect(serialized).not.toMatch(
            /api[-_]?key|password|provider[-_]?payload|raw[-_]?payload|secret|token/i,
        );
        expect(serialized).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/i);
        expect(
            (
                release.payload as { fixtureCases: Array<{ candidateRef: string }> }
            ).fixtureCases.every(({ candidateRef }) => candidateRef.startsWith('fixture:')),
        ).toBe(true);
    });

    test('is deeply frozen and cannot be promoted or mutated through retained references', async () => {
        const release = await getQualificationFixtureRelease();
        expect(Object.isFrozen(release)).toBe(true);
        expect(Object.isFrozen(release.payload)).toBe(true);
        expect(Object.isFrozen(release.safeDiff)).toBe(true);
        expect(() => {
            (release.origin as { scope: string }).scope = 'production';
        }).toThrow();
        expect(() => {
            (release.payload as { classificationOrder: string[] }).classificationOrder.reverse();
        }).toThrow();
    });

    test('fails closed when a required fixture kind is unavailable', async () => {
        try {
            await requireFixturePolicyRelease('discovery');
            throw new Error('Expected missing fixture rejection');
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(PolicyContractError);
            if (!(error instanceof PolicyContractError)) {
                throw error;
            }
            expect(error.code).toBe('REQUIRED_POLICY_RELEASE_MISSING');
            expect(error.message).toContain('discovery');
            expect(error.issues[0]?.code).toBe('fixture_not_found');
            expect(error.issues[0]?.path).toBe('$.kind');
        }
    });

    test('rejects policy kinds outside the runtime vocabulary before fixture lookup', async () => {
        try {
            await requireFixturePolicyRelease('rogue' as never);
            throw new Error('Expected invalid policy-kind rejection');
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(PolicyContractError);
            if (!(error instanceof PolicyContractError)) {
                throw error;
            }
            expect(error.code).toBe('INVALID_POLICY_KIND');
            expect(error.issues[0]?.code).toBe('invalid_policy_kind');
        }
    });

    test('exports no operator activation, authorization, promotion, or supersession API', () => {
        expect(Object.keys(businessPolicy)).not.toContain('activatePolicy');
        expect(Object.keys(businessPolicy)).not.toContain('authorizeOperator');
        expect(Object.keys(businessPolicy)).not.toContain('promoteFixture');
        expect(Object.keys(businessPolicy)).not.toContain('supersedePolicy');
    });
});
