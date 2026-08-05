import { describe, expect, test } from 'bun:test';
import { z } from 'zod';

import type {
    CreatePolicyReleaseInput,
    PolicyRelease,
    PolicySnapshotReference,
    PolicyValidatorRegistry,
} from '../src';
import {
    assertPolicySnapshotMatches,
    canonicalizeJson,
    createPolicyRelease,
    createPolicySnapshotReference,
    createPolicyValidatorRegistry,
    hashCanonicalJson,
    POLICY_KINDS,
    PolicyContractError,
    requirePolicyRelease,
} from '../src';

const qualificationSchema = z.strictObject({
    thresholds: z.strictObject({
        missingSiteScore: z.number().int().min(0).max(100),
        weakSiteScore: z.number().int().min(0).max(100),
    }),
    ordering: z.tuple([z.literal('missing-site'), z.literal('weak-site'), z.literal('has-site')]),
});

const createRegistry = () =>
    createPolicyValidatorRegistry([
        {
            kind: 'qualification',
            schemaVersion: 'fixture-1',
            validatorId: 'qualification-fixture-1',
            schema: qualificationSchema,
        },
    ]);

const capturePolicyError = async (action: () => unknown): Promise<PolicyContractError> => {
    try {
        await action();
    } catch (error: unknown) {
        expect(error).toBeInstanceOf(PolicyContractError);
        if (error instanceof PolicyContractError) {
            return error;
        }
        throw error;
    }
    throw new Error('Expected PolicyContractError');
};

const releaseInput = {
    releaseId: 'policy_fixture_qualification_v1',
    kind: 'qualification' as const,
    schemaVersion: 'fixture-1',
    payload: {
        thresholds: { missingSiteScore: 100, weakSiteScore: 50 },
        ordering: ['missing-site', 'weak-site', 'has-site'],
    },
    effectiveAt: '2026-07-29T00:00:00.000Z',
    origin: {
        type: 'deterministic-fixture' as const,
        actorId: 'system:jagwar-fixture',
        scope: 'non-production' as const,
    },
    safeDiff: [
        {
            path: '/',
            change: 'added' as const,
            afterHash: '6ebece41822e94d737b1ed7c5f4572103722b6c96494b68404bcd89cc5dc0e95',
        },
    ],
};

describe('business-policy release contract', () => {
    test('publishes the closed policy-kind vocabulary', () => {
        expect(POLICY_KINDS).toEqual([
            'qualification',
            'discovery',
            'outreach',
            'activation',
            'commercial',
            'retention',
        ]);
        expect(Object.isFrozen(POLICY_KINDS)).toBe(true);
        expect(() => (POLICY_KINDS as unknown as string[]).push('rogue')).toThrow();
    });

    test('rejects duplicate validators and missing exact kind/version bindings', () => {
        const binding = {
            kind: 'qualification' as const,
            schemaVersion: 'fixture-1',
            validatorId: 'qualification-fixture-1',
            schema: qualificationSchema,
        };

        expect(() => createPolicyValidatorRegistry([binding, binding])).toThrow(
            expect.objectContaining({ code: 'DUPLICATE_VALIDATOR' }),
        );

        const registry = createRegistry();
        expect(() => registry.validate('qualification', 'production-1', {})).toThrow(
            expect.objectContaining({ code: 'VALIDATOR_NOT_FOUND' }),
        );
    });

    test('enforces policy kinds at runtime and supplies structured registry issues', async () => {
        const rogueBinding = {
            kind: 'rogue-policy',
            schemaVersion: 'fixture-1',
            validatorId: 'rogue-fixture-1',
            schema: z.strictObject({ enabled: z.boolean() }),
        } as unknown as Parameters<typeof createPolicyValidatorRegistry>[0][number];
        const unknownKind = await capturePolicyError(() =>
            createPolicyValidatorRegistry([rogueBinding]),
        );
        expect(unknownKind.code).toBe('INVALID_POLICY_KIND');
        expect(unknownKind.issues[0]?.path).toBe('$.bindings[0].kind');

        const binding = {
            kind: 'qualification' as const,
            schemaVersion: 'fixture-1',
            validatorId: 'qualification-fixture-1',
            schema: qualificationSchema,
        };
        const duplicate = await capturePolicyError(() =>
            createPolicyValidatorRegistry([binding, binding]),
        );
        expect(duplicate.issues[0]?.code).toBe('duplicate_validator');
        expect(duplicate.issues[0]?.path).toBe('$.bindings[1]');

        const missing = await capturePolicyError(() =>
            createRegistry().validate('qualification', 'missing-version', {}),
        );
        expect(missing.issues[0]?.code).toBe('validator_not_found');
        expect(missing.issues[0]?.path).toBe('$.schemaVersion');
    });

    test('rejects validators that silently strip, coerce, or transform payloads', async () => {
        const stripped = await capturePolicyError(() =>
            createPolicyValidatorRegistry([
                {
                    kind: 'qualification',
                    schemaVersion: 'permissive-1',
                    validatorId: 'permissive-1',
                    schema: z.object({ nested: z.object({ score: z.number() }) }),
                },
            ]),
        );
        expect(stripped.code).toBe('INVALID_POLICY_PAYLOAD');
        expect(stripped.issues[0]?.code).toBe('non_strict_validator');

        const passthrough = await capturePolicyError(() =>
            createPolicyValidatorRegistry([
                {
                    kind: 'qualification',
                    schemaVersion: 'loose-1',
                    validatorId: 'loose-1',
                    schema: z.looseObject({ score: z.number() }),
                },
            ]),
        );
        expect(passthrough.issues[0]?.code).toBe('non_strict_validator');

        const coercingRegistry = createPolicyValidatorRegistry([
            {
                kind: 'qualification',
                schemaVersion: 'coerce-1',
                validatorId: 'coerce-1',
                schema: z.strictObject({ score: z.coerce.number() }),
            },
        ]);
        const coerced = await capturePolicyError(() =>
            coercingRegistry.validate('qualification', 'coerce-1', { score: '1' }),
        );
        expect(coerced.issues[0]?.code).toBe('non_canonical_payload');
    });

    test('rejects opaque lazy schemas that cannot prove strict object boundaries', async () => {
        const error = await capturePolicyError(async () => {
            const registry = createPolicyValidatorRegistry([
                {
                    kind: 'qualification',
                    schemaVersion: 'lazy-1',
                    validatorId: 'lazy-1',
                    schema: z.lazy(() => z.looseObject({ known: z.string() })),
                },
            ]);
            await createPolicyRelease(registry, {
                ...releaseInput,
                schemaVersion: 'lazy-1',
                payload: { known: 'ok', unexpected: 'accepted' },
            });
        });
        expect(error.code).toBe('INVALID_POLICY_PAYLOAD');
        expect(error.issues[0]?.code).toBe('opaque_validator');
    });

    test.each([
        {
            safeParse: (payload: unknown) => ({ data: payload, success: true }),
        },
        {
            safeParse: () => ({ error: { issues: null }, success: false }),
        },
    ])('rejects safeParse-shaped objects that are not Zod validators', async (schema) => {
        const error = await capturePolicyError(() =>
            createPolicyValidatorRegistry([
                {
                    kind: 'qualification',
                    schemaVersion: 'fake-1',
                    validatorId: 'fake-1',
                    schema: schema as unknown as z.ZodType,
                },
            ]),
        );
        expect(error.code).toBe('INVALID_POLICY_PAYLOAD');
        expect(error.issues[0]?.code).toBe('invalid_validator');
    });

    test('normalizes validator exceptions and supports short registry versions', async () => {
        const registry = createPolicyValidatorRegistry([
            {
                kind: 'qualification',
                schemaVersion: 'v1',
                validatorId: 'v1',
                schema: z.strictObject({
                    score: z.number().refine(async () => true),
                }),
            },
        ]);
        const error = await capturePolicyError(() =>
            registry.validate('qualification', 'v1', { score: 1 }),
        );
        expect(error.code).toBe('INVALID_POLICY_PAYLOAD');
        expect(error.issues[0]?.code).toBe('validator_exception');

        const missing = await capturePolicyError(() =>
            registry.validate('qualification', 'v2', { score: 1 }),
        );
        expect(missing.code).toBe('VALIDATOR_NOT_FOUND');
    });

    test('returns structured strict-validation issues without producing a release', async () => {
        try {
            await createPolicyRelease(createRegistry(), {
                ...releaseInput,
                payload: {
                    ...releaseInput.payload,
                    apiToken: 'must-not-survive',
                },
            });
            throw new Error('Expected invalid payload rejection');
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(PolicyContractError);
            if (!(error instanceof PolicyContractError)) {
                throw error;
            }
            expect(error.code).toBe('INVALID_POLICY_PAYLOAD');
            expect(error.issues.length).toBeGreaterThan(0);
            expect(error.issues.every((issue) => typeof issue.path === 'string')).toBe(true);
        }
    });

    test('canonicalizes recursively and hashes a stable UTF-8 golden value', async () => {
        const first = {
            z: [3, 2, 1],
            nested: { b: null, a: true },
            a: 1,
        };
        const reordered = {
            a: 1,
            nested: { a: true, b: null },
            z: [3, 2, 1],
        };

        expect(canonicalizeJson(first)).toBe('{"a":1,"nested":{"a":true,"b":null},"z":[3,2,1]}');
        expect(await hashCanonicalJson(first)).toEqual({
            canonicalJson: canonicalizeJson(reordered),
            payloadHash: 'dbc097d897d2c26d9c6277599d57879318bc78b5d3773059677a4efc2fe897c7',
        });
    });

    test('preserves array order and changes hashes for material changes', async () => {
        const first = await hashCanonicalJson({ values: [1, 2] });
        const reordered = await hashCanonicalJson({ values: [2, 1] });
        const changed = await hashCanonicalJson({ values: [1, 3] });

        expect(first.payloadHash).not.toBe(reordered.payloadHash);
        expect(first.payloadHash).not.toBe(changed.payloadHash);
    });

    test.each([
        ['undefined', { value: undefined }],
        ['non-finite number', { value: Number.POSITIVE_INFINITY }],
        ['negative zero', { value: -0 }],
        ['date', { value: new Date('2026-01-01T00:00:00Z') }],
        ['bigint', { value: BigInt(1) }],
        ['function', { value: () => true }],
        ['symbol', { value: Symbol('unsafe') }],
        ['lone surrogate', { value: '\ud800' }],
    ])('rejects %s before canonicalization', (_label, value) => {
        expect(() => canonicalizeJson(value)).toThrow(PolicyContractError);
    });

    test('rejects sparse arrays and cyclic data', () => {
        const sparse = Array<number>(2);
        sparse[1] = 1;
        expect(() => canonicalizeJson(sparse)).toThrow(
            expect.objectContaining({ code: 'INVALID_JSON_VALUE' }),
        );

        const cyclic: { self?: unknown } = {};
        cyclic.self = cyclic;
        expect(() => canonicalizeJson(cyclic)).toThrow(
            expect.objectContaining({ code: 'CYCLIC_JSON_VALUE' }),
        );
    });

    test('rejects hidden properties and accessors without executing caller code', async () => {
        const symbolValue = { visible: true } as Record<PropertyKey, unknown>;
        symbolValue[Symbol('hidden')] = 'secret';
        const symbolError = await capturePolicyError(() => canonicalizeJson(symbolValue));
        expect(symbolError.issues[0]?.code).toBe('symbol_key');

        const nonEnumerable = { visible: true };
        Object.defineProperty(nonEnumerable, 'hidden', { enumerable: false, value: 'secret' });
        const nonEnumerableError = await capturePolicyError(() => canonicalizeJson(nonEnumerable));
        expect(nonEnumerableError.issues[0]?.code).toBe('non_enumerable_property');

        let getterCalls = 0;
        const accessor = { visible: true } as { visible: boolean; dangerous?: string };
        Object.defineProperty(accessor, 'dangerous', {
            enumerable: true,
            get: () => {
                getterCalls += 1;
                return 'executed';
            },
        });
        const accessorError = await capturePolicyError(() => canonicalizeJson(accessor));
        expect(accessorError.issues[0]?.code).toBe('accessor_property');
        expect(getterCalls).toBe(0);

        const extendedArray = [1, 2] as number[] & { hidden?: string };
        extendedArray.hidden = 'secret';
        const arrayError = await capturePolicyError(() => canonicalizeJson(extendedArray));
        expect(arrayError.issues[0]?.code).toBe('unexpected_array_property');
    });

    test.each([
        'accessToken',
        'api_token',
        'clientSecret',
        'private-key',
        'sqlQuery',
        'script',
        'sourceCode',
        'providerPayload',
        'raw_payload',
        'databasePassword',
        'secretValue',
        'openaiApiKey',
        'sqlStatement',
        'executableCode',
        'rawProviderResponse',
        'api.token',
        'api/token',
        'api\u200btoken',
        'authorization',
        'authorizationHeader',
        'bearer',
        'passwd',
        'jwt',
    ])('rejects dangerous compound key %s before hashing', async (key) => {
        const value = { [key]: 'unsafe' };
        const canonicalError = await capturePolicyError(() => canonicalizeJson(value));
        expect(canonicalError.issues[0]?.code).toBe('dangerous_key');
        const hashError = await capturePolicyError(() => hashCanonicalJson(value));
        expect(hashError.issues[0]?.code).toBe('dangerous_key');
        const releaseError = await capturePolicyError(() =>
            createPolicyRelease(createRegistry(), {
                ...releaseInput,
                payload: { ...releaseInput.payload, [key]: 'unsafe' },
            }),
        );
        expect(releaseError.issues[0]?.code).toBe('dangerous_key');
    });

    test('creates a hash-consistent deeply immutable release from a defensive clone', async () => {
        const source = structuredClone(releaseInput);
        const release = await createPolicyRelease(createRegistry(), source);

        source.payload.thresholds.missingSiteScore = 0;
        source.safeDiff[0]!.path = '/changed';

        expect(release.payload).toEqual(releaseInput.payload);
        expect(release.safeDiff[0]?.path).toBe('/');
        expect(Object.isFrozen(release)).toBe(true);
        expect(Object.isFrozen(release.payload)).toBe(true);
        expect(Object.isFrozen(release.payloadHash)).toBe(true);
        expect(() => {
            (release.payload as { ordering: string[] }).ordering.push('changed');
        }).toThrow();
        expect(release.validation.validatorId).toBe('qualification-fixture-1');
    });

    test('safe diffs contain classifications and hashes, never raw values', async () => {
        const release = await createPolicyRelease(createRegistry(), releaseInput);
        expect(release.safeDiff).toEqual(releaseInput.safeDiff);
        expect(JSON.stringify(release.safeDiff)).not.toContain('token');
        expect(JSON.stringify(release.safeDiff)).not.toContain('payload');
    });

    test('rejects a root safe-diff hash that does not match the canonical payload', async () => {
        try {
            await createPolicyRelease(createRegistry(), {
                ...releaseInput,
                safeDiff: [{ path: '/', change: 'added', afterHash: 'b'.repeat(64) }],
            });
            throw new Error('Expected safe-diff mismatch rejection');
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(PolicyContractError);
            if (!(error instanceof PolicyContractError)) {
                throw error;
            }
            expect(error.code).toBe('INVALID_RELEASE');
            expect(error.issues[0]?.code).toBe('payload_hash_mismatch');
        }
    });

    test('strictly rejects invalid provenance and unsafe diff metadata', async () => {
        const invalidOrigin = await capturePolicyError(() =>
            createPolicyRelease(createRegistry(), {
                ...releaseInput,
                origin: {
                    ...releaseInput.origin,
                    scope: 'staging',
                    secret: 'leak',
                },
            } as unknown as CreatePolicyReleaseInput),
        );
        expect(invalidOrigin.issues[0]?.path).toStartWith('$.origin');

        const invalidDiff = await capturePolicyError(() =>
            createPolicyRelease(createRegistry(), {
                ...releaseInput,
                safeDiff: [
                    {
                        path: '/',
                        change: 'bogus',
                        afterHash: releaseInput.safeDiff[0]!.afterHash,
                        rawValue: 'leak',
                    },
                ],
            } as unknown as CreatePolicyReleaseInput),
        );
        expect(invalidDiff.issues[0]?.path).toStartWith('$.safeDiff');

        const duplicatePath = await capturePolicyError(() =>
            createPolicyRelease(createRegistry(), {
                ...releaseInput,
                safeDiff: [releaseInput.safeDiff[0]!, releaseInput.safeDiff[0]!],
            }),
        );
        expect(duplicatePath.issues[0]?.code).toBe('duplicate_diff_path');

        const changedRoot = await capturePolicyError(() =>
            createPolicyRelease(createRegistry(), {
                ...releaseInput,
                safeDiff: [
                    {
                        path: '/',
                        change: 'changed',
                        beforeHash: 'a'.repeat(64),
                        afterHash: 'b'.repeat(64),
                    },
                ],
            }),
        );
        expect(changedRoot.issues[0]?.code).toBe('payload_hash_mismatch');
    });

    test('binds every safe-diff path and after hash to the released payload', async () => {
        const nestedHash = await hashCanonicalJson(100);
        const nestedRelease = await createPolicyRelease(createRegistry(), {
            ...releaseInput,
            safeDiff: [
                {
                    path: '/thresholds/missingSiteScore',
                    change: 'changed',
                    beforeHash: 'a'.repeat(64),
                    afterHash: nestedHash.payloadHash,
                },
            ],
        });
        expect(nestedRelease.safeDiff[0]?.afterHash).toBe(nestedHash.payloadHash);

        for (const safeDiff of [
            [
                {
                    path: '/thresholds/missingSiteScore',
                    change: 'changed',
                    beforeHash: 'a'.repeat(64),
                    afterHash: 'b'.repeat(64),
                },
            ],
            [
                {
                    path: '/secretValue',
                    change: 'removed',
                    beforeHash: 'a'.repeat(64),
                },
            ],
            [
                {
                    path: '/',
                    change: 'removed',
                    beforeHash: 'a'.repeat(64),
                },
            ],
            [
                {
                    path: '/thresholds/missingSiteScore',
                    change: 'changed',
                    beforeHash: nestedHash.payloadHash,
                    afterHash: nestedHash.payloadHash,
                },
            ],
            [
                {
                    path: '/thresholds/~2invalid',
                    change: 'removed',
                    beforeHash: 'a'.repeat(64),
                },
            ],
        ] as const) {
            const error = await capturePolicyError(() =>
                createPolicyRelease(createRegistry(), {
                    ...releaseInput,
                    safeDiff,
                }),
            );
            expect(error.code).toBe('INVALID_RELEASE');
        }
    });

    test('validates custom registry results and never freezes caller-owned payloads', async () => {
        const sourcePayload = { safe: true };
        const mismatchedRegistry: PolicyValidatorRegistry = {
            validate: () => ({
                kind: 'discovery',
                schemaVersion: 'other-version',
                validatorId: 'mismatched-validator',
                payload: sourcePayload,
            }),
        };
        const mismatch = await capturePolicyError(() =>
            createPolicyRelease(mismatchedRegistry, {
                ...releaseInput,
                payload: sourcePayload,
            }),
        );
        expect(mismatch.issues[0]?.code).toBe('validator_result_mismatch');
        expect(Object.isFrozen(sourcePayload)).toBe(false);

        const substitutingRegistry: PolicyValidatorRegistry = {
            validate: () => ({
                kind: 'qualification',
                schemaVersion: 'fixture-1',
                validatorId: 'substituting-validator',
                payload: { safe: false },
            }),
        };
        const substitution = await capturePolicyError(() =>
            createPolicyRelease(substitutingRegistry, {
                ...releaseInput,
                payload: sourcePayload,
            }),
        );
        expect(substitution.issues[0]?.code).toBe('validator_payload_mismatch');

        const matchingRegistry: PolicyValidatorRegistry = {
            validate: () => ({
                kind: 'qualification',
                schemaVersion: 'fixture-1',
                validatorId: 'external-validator-1',
                payload: sourcePayload,
            }),
        };
        const sourceHash = await hashCanonicalJson(sourcePayload);
        const release = await createPolicyRelease(matchingRegistry, {
            ...releaseInput,
            payload: sourcePayload,
            safeDiff: [{ path: '/', change: 'added', afterHash: sourceHash.payloadHash }],
        });
        sourcePayload.safe = false;
        expect(Object.isFrozen(sourcePayload)).toBe(false);
        expect(release.payload).toEqual({ safe: true });
        expect(Object.isFrozen(release.payload)).toBe(true);
    });

    test('links the exact policy release to evaluated input identity and version', async () => {
        const release = await createPolicyRelease(createRegistry(), releaseInput);
        const snapshot = createPolicySnapshotReference(release, {
            kind: 'candidate-set',
            id: 'discovery_fixture_001',
            version: 'candidate-set-v1',
        });

        expect(assertPolicySnapshotMatches(release, snapshot, snapshot.evaluatedInput)).toEqual(
            snapshot,
        );
        expect(snapshot).toEqual({
            policyReleaseId: release.releaseId,
            kind: release.kind,
            schemaVersion: release.schemaVersion,
            payloadHash: release.payloadHash,
            evaluatedInput: {
                kind: 'candidate-set',
                id: 'discovery_fixture_001',
                version: 'candidate-set-v1',
            },
        });
    });

    test('fails closed for mismatched snapshots and missing required releases', async () => {
        const release = await createPolicyRelease(createRegistry(), releaseInput);
        const snapshot = createPolicySnapshotReference(release, {
            kind: 'candidate-set',
            id: 'discovery_fixture_001',
            version: 'candidate-set-v1',
        });

        expect(() =>
            assertPolicySnapshotMatches(
                release,
                {
                    ...snapshot,
                    payloadHash: 'b'.repeat(64),
                },
                snapshot.evaluatedInput,
            ),
        ).toThrow(expect.objectContaining({ code: 'POLICY_SNAPSHOT_MISMATCH' }));
        expect(() => requirePolicyRelease([], release.releaseId)).toThrow(
            expect.objectContaining({ code: 'REQUIRED_POLICY_RELEASE_MISSING' }),
        );
    });

    test('strictly validates and defensively freezes complete snapshot evidence', async () => {
        const release = await createPolicyRelease(createRegistry(), releaseInput);
        const expectedInput = {
            kind: 'candidate-set',
            id: 'discovery_fixture_001',
            version: 'candidate-set-v1',
        };
        const source = {
            policyReleaseId: release.releaseId,
            kind: release.kind,
            schemaVersion: release.schemaVersion,
            payloadHash: release.payloadHash,
            evaluatedInput: { ...expectedInput },
        } satisfies PolicySnapshotReference;
        const validated = assertPolicySnapshotMatches(release, source, expectedInput);
        source.evaluatedInput.id = 'mutated';
        expect(validated.evaluatedInput.id).toBe('discovery_fixture_001');
        expect(Object.isFrozen(validated)).toBe(true);
        expect(Object.isFrozen(validated.evaluatedInput)).toBe(true);

        const missingInput = await capturePolicyError(() =>
            assertPolicySnapshotMatches(
                release,
                {
                    ...source,
                    evaluatedInput: undefined,
                } as unknown as PolicySnapshotReference,
                expectedInput,
            ),
        );
        expect(missingInput.code).toBe('INVALID_POLICY_SNAPSHOT');
        expect(missingInput.issues[0]?.path).toStartWith('$.evaluatedInput');

        const extraInput = await capturePolicyError(() =>
            assertPolicySnapshotMatches(
                release,
                {
                    ...source,
                    evaluatedInput: { ...expectedInput, secret: 'leak' },
                } as unknown as PolicySnapshotReference,
                expectedInput,
            ),
        );
        expect(extraInput.code).toBe('INVALID_POLICY_SNAPSHOT');

        const expectedMismatch = await capturePolicyError(() =>
            assertPolicySnapshotMatches(release, source, {
                ...expectedInput,
                version: 'candidate-set-v2',
            }),
        );
        expect(expectedMismatch.issues[0]?.code).toBe('evaluated_input_mismatch');

        const nullInput = await capturePolicyError(() =>
            createPolicySnapshotReference(release, null as unknown as typeof expectedInput),
        );
        expect(nullInput.code).toBe('INVALID_POLICY_SNAPSHOT');
    });

    test('rejects ambiguous duplicate release identifiers', async () => {
        const release = await createPolicyRelease(createRegistry(), releaseInput);
        const duplicate = { ...release } as PolicyRelease;
        const error = await capturePolicyError(() =>
            requirePolicyRelease([release, duplicate], release.releaseId),
        );
        expect(error.code).toBe('AMBIGUOUS_POLICY_RELEASE');
        expect(error.issues[0]?.code).toBe('ambiguous_release_id');
    });
});
