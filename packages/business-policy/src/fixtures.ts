import { z } from 'zod';

import type { PolicyKind, PolicyRelease } from './release';
import {
    assertPolicyKind,
    createPolicyRelease,
    createPolicyValidatorRegistry,
    PolicyContractError,
} from './release';

const CLASSIFICATIONS = ['missing-site', 'weak-site', 'has-site'] as const;

const qualificationFixtureSchema = z.strictObject({
    classificationOrder: z.tuple([
        z.literal('missing-site'),
        z.literal('weak-site'),
        z.literal('has-site'),
    ]),
    fixtureCases: z
        .array(
            z.strictObject({
                candidateRef: z.string().regex(/^fixture:[a-z-]+$/),
                classification: z.enum(CLASSIFICATIONS),
            }),
        )
        .length(3),
    fixturePurpose: z.literal('discovery-contract-proof'),
});

const fixtureRegistry = createPolicyValidatorRegistry([
    {
        kind: 'qualification',
        schemaVersion: 'fixture-1',
        validatorId: 'qualification-discovery-fixture-1',
        schema: qualificationFixtureSchema,
    },
]);

let qualificationFixtureRelease: Promise<PolicyRelease> | undefined;

export const getQualificationFixtureRelease = (): Promise<PolicyRelease> => {
    qualificationFixtureRelease ??= createPolicyRelease(fixtureRegistry, {
        releaseId: 'policy_fixture_qualification_discovery_v1',
        kind: 'qualification',
        schemaVersion: 'fixture-1',
        payload: {
            classificationOrder: CLASSIFICATIONS,
            fixtureCases: [
                { candidateRef: 'fixture:no-site', classification: 'missing-site' },
                { candidateRef: 'fixture:weak-site', classification: 'weak-site' },
                { candidateRef: 'fixture:has-site', classification: 'has-site' },
            ],
            fixturePurpose: 'discovery-contract-proof',
        },
        effectiveAt: '2026-07-29T00:00:00.000Z',
        origin: {
            type: 'deterministic-fixture',
            actorId: 'system:jagwar-fixture',
            scope: 'non-production',
        },
        safeDiff: [
            {
                path: '/',
                change: 'added',
                afterHash: 'f6151993a05395940468f2cafc84c8d722f2ee2a7d06015fd9a695907d8839a1',
            },
        ],
    });
    return qualificationFixtureRelease;
};

const fixtureReleaseGetters: ReadonlyMap<PolicyKind, () => Promise<PolicyRelease>> = new Map([
    ['qualification', getQualificationFixtureRelease],
]);

export const requireFixturePolicyRelease = async (kind: PolicyKind): Promise<PolicyRelease> => {
    assertPolicyKind(kind, '$.kind');
    const getRelease = fixtureReleaseGetters.get(kind);
    if (getRelease === undefined) {
        throw new PolicyContractError(
            'REQUIRED_POLICY_RELEASE_MISSING',
            `No non-production fixture release exists for policy kind ${kind}`,
            [
                {
                    code: 'fixture_not_found',
                    message: `Add an explicit non-production ${kind} fixture before use`,
                    path: '$.kind',
                },
            ],
        );
    }
    return getRelease();
};
