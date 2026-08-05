import { z } from 'zod';

export const POLICY_KINDS = Object.freeze([
    'qualification',
    'discovery',
    'outreach',
    'activation',
    'commercial',
    'retention',
] as const);

export type PolicyKind = (typeof POLICY_KINDS)[number];
export type JsonPrimitive = boolean | null | number | string;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type PolicyContractErrorCode =
    | 'AMBIGUOUS_POLICY_RELEASE'
    | 'CYCLIC_JSON_VALUE'
    | 'DUPLICATE_VALIDATOR'
    | 'INVALID_JSON_VALUE'
    | 'INVALID_POLICY_KIND'
    | 'INVALID_POLICY_PAYLOAD'
    | 'INVALID_POLICY_SNAPSHOT'
    | 'INVALID_RELEASE'
    | 'POLICY_SNAPSHOT_MISMATCH'
    | 'REQUIRED_POLICY_RELEASE_MISSING'
    | 'VALIDATOR_NOT_FOUND';

export interface PolicyContractIssue {
    readonly code: string;
    readonly message: string;
    readonly path: string;
}

export class PolicyContractError extends Error {
    public readonly code: PolicyContractErrorCode;
    public readonly issues: readonly PolicyContractIssue[];

    public constructor(
        code: PolicyContractErrorCode,
        message: string,
        issues: readonly PolicyContractIssue[] = [],
    ) {
        super(message);
        this.name = 'PolicyContractError';
        this.code = code;
        this.issues = issues;
    }
}

export interface PolicyValidatorBinding {
    readonly kind: PolicyKind;
    readonly schema: z.ZodType;
    readonly schemaVersion: string;
    readonly validatorId: string;
}

export interface ValidatedPolicyPayload {
    readonly kind: PolicyKind;
    readonly payload: JsonValue;
    readonly schemaVersion: string;
    readonly validatorId: string;
}

export interface PolicyValidatorRegistry {
    validate(kind: PolicyKind, schemaVersion: string, payload: unknown): ValidatedPolicyPayload;
}

export type PolicyDiffChange = 'added' | 'changed' | 'removed';

export interface PolicySafeDiffEntry {
    readonly afterHash?: string;
    readonly beforeHash?: string;
    readonly change: PolicyDiffChange;
    readonly path: string;
}

export interface PolicyReleaseOrigin {
    readonly actorId: string;
    readonly scope: 'non-production' | 'production';
    readonly type: string;
}

export interface PolicyRelease {
    readonly canonicalPayload: string;
    readonly effectiveAt: string;
    readonly kind: PolicyKind;
    readonly logicalIdentity: string;
    readonly origin: PolicyReleaseOrigin;
    readonly payload: JsonValue;
    readonly payloadHash: string;
    readonly releaseId: string;
    readonly safeDiff: readonly PolicySafeDiffEntry[];
    readonly schemaVersion: string;
    readonly supersedesReleaseId?: string;
    readonly validation: {
        readonly payloadHash: string;
        readonly validatorId: string;
    };
}

export interface CreatePolicyReleaseInput {
    readonly effectiveAt: string;
    readonly kind: PolicyKind;
    readonly origin: PolicyReleaseOrigin;
    readonly payload: unknown;
    readonly releaseId: string;
    readonly safeDiff: readonly PolicySafeDiffEntry[];
    readonly schemaVersion: string;
    readonly supersedesReleaseId?: string;
}

export interface EvaluatedInputVersion {
    readonly id: string;
    readonly kind: string;
    readonly version: string;
}

export interface PolicySnapshotReference {
    readonly evaluatedInput: EvaluatedInputVersion;
    readonly kind: PolicyKind;
    readonly payloadHash: string;
    readonly policyReleaseId: string;
    readonly schemaVersion: string;
}

const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;
const IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{2,127}$/;
const REGISTRY_IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const POLICY_KIND_SET = new Set<string>(POLICY_KINDS);
const TOKEN_KEY_QUALIFIERS = ['access', 'api', 'auth', 'bearer', 'client', 'openai', 'refresh'];
const KEY_KEY_QUALIFIERS = ['api', 'encryption', 'openai', 'private', 'signing'];

const normalizePolicyKey = (key: string): string =>
    key
        .normalize('NFKC')
        .replace(/[^\p{Letter}\p{Number}]/gu, '')
        .toLowerCase();

const isDangerousPolicyKey = (key: string): boolean => {
    const normalized = normalizePolicyKey(key);
    return (
        normalized.includes('secret') ||
        normalized.includes('password') ||
        normalized.includes('passwd') ||
        normalized.includes('credential') ||
        normalized.includes('authorization') ||
        normalized.includes('bearer') ||
        normalized.includes('jwt') ||
        normalized.includes('sql') ||
        normalized === 'code' ||
        normalized.includes('executablecode') ||
        normalized.includes('sourcecode') ||
        normalized.includes('script') ||
        normalized === 'token' ||
        normalized === 'tokens' ||
        (normalized.includes('token') &&
            TOKEN_KEY_QUALIFIERS.some((qualifier) => normalized.includes(qualifier))) ||
        (normalized.includes('key') &&
            KEY_KEY_QUALIFIERS.some((qualifier) => normalized.includes(qualifier))) ||
        (normalized.includes('raw') &&
            (normalized.includes('payload') ||
                normalized.includes('provider') ||
                normalized.includes('response'))) ||
        normalized.includes('providerpayload')
    );
};

export const assertPolicyKind: (value: unknown, path: string) => asserts value is PolicyKind = (
    value,
    path,
) => {
    if (typeof value !== 'string' || !POLICY_KIND_SET.has(value)) {
        throw new PolicyContractError('INVALID_POLICY_KIND', `Unsupported policy kind at ${path}`, [
            {
                code: 'invalid_policy_kind',
                message: `Expected one of: ${POLICY_KINDS.join(', ')}`,
                path,
            },
        ]);
    }
};

const registryKey = (kind: PolicyKind, schemaVersion: string): string =>
    `${kind}\u0000${schemaVersion}`;

const issuePath = (path: readonly PropertyKey[]): string => {
    if (path.length === 0) {
        return '$';
    }
    return `$.${path.map(String).join('.')}`;
};

const assertIdentifier: (value: unknown, path: string) => asserts value is string = (
    value,
    path,
) => {
    if (typeof value !== 'string' || !IDENTIFIER_PATTERN.test(value)) {
        throw new PolicyContractError('INVALID_RELEASE', `Invalid identifier at ${path}`, [
            { code: 'invalid_identifier', message: 'Expected a stable opaque identifier', path },
        ]);
    }
};

const assertRegistryIdentifier: (value: unknown, path: string) => asserts value is string = (
    value,
    path,
) => {
    if (typeof value !== 'string' || !REGISTRY_IDENTIFIER_PATTERN.test(value)) {
        throw new PolicyContractError(
            'INVALID_POLICY_PAYLOAD',
            `Invalid validator registry identifier at ${path}`,
            [
                {
                    code: 'invalid_registry_identifier',
                    message: 'Expected a stable validator registry identifier',
                    path,
                },
            ],
        );
    }
};

const assertUtcTimestamp: (value: unknown, path: string) => asserts value is string = (
    value,
    path,
) => {
    if (typeof value !== 'string') {
        throw new PolicyContractError('INVALID_RELEASE', `Invalid UTC timestamp at ${path}`, [
            { code: 'invalid_datetime', message: 'Expected a canonical UTC ISO timestamp', path },
        ]);
    }
    const parsed = Date.parse(value);
    if (
        !value.endsWith('Z') ||
        !Number.isFinite(parsed) ||
        new Date(parsed).toISOString() !== value
    ) {
        throw new PolicyContractError('INVALID_RELEASE', `Invalid UTC timestamp at ${path}`, [
            { code: 'invalid_datetime', message: 'Expected a canonical UTC ISO timestamp', path },
        ]);
    }
};

const assertValidUnicode = (value: string, path: string): void => {
    for (let index = 0; index < value.length; index += 1) {
        const codeUnit = value.charCodeAt(index);
        if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
            const next = value.charCodeAt(index + 1);
            if (!(next >= 0xdc00 && next <= 0xdfff)) {
                throw new PolicyContractError('INVALID_JSON_VALUE', 'Lone high surrogate', [
                    {
                        code: 'invalid_unicode',
                        message: 'Lone high surrogate is not valid JSON text',
                        path,
                    },
                ]);
            }
            index += 1;
        } else if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
            throw new PolicyContractError('INVALID_JSON_VALUE', 'Lone low surrogate', [
                {
                    code: 'invalid_unicode',
                    message: 'Lone low surrogate is not valid JSON text',
                    path,
                },
            ]);
        }
    }
};

const canonicalizeValue = (value: unknown, path: string, ancestors: Set<object>): string => {
    if (value === null || typeof value === 'boolean') {
        return JSON.stringify(value);
    }

    if (typeof value === 'string') {
        assertValidUnicode(value, path);
        return JSON.stringify(value);
    }

    if (typeof value === 'number') {
        if (!Number.isFinite(value) || Object.is(value, -0)) {
            throw new PolicyContractError('INVALID_JSON_VALUE', `Invalid JSON number at ${path}`, [
                {
                    code: 'invalid_number',
                    message: 'Expected a finite number other than negative zero',
                    path,
                },
            ]);
        }
        return JSON.stringify(value);
    }

    if (typeof value !== 'object') {
        throw new PolicyContractError('INVALID_JSON_VALUE', `Unsupported JSON value at ${path}`, [
            { code: 'invalid_type', message: `Unsupported JSON type: ${typeof value}`, path },
        ]);
    }

    if (ancestors.has(value)) {
        throw new PolicyContractError('CYCLIC_JSON_VALUE', `Cyclic JSON value at ${path}`, [
            { code: 'cyclic_value', message: 'Policy JSON must be acyclic', path },
        ]);
    }

    ancestors.add(value);
    try {
        if (Array.isArray(value)) {
            const descriptors = Object.getOwnPropertyDescriptors(value);
            for (const key of Reflect.ownKeys(value)) {
                if (typeof key === 'symbol') {
                    throw new PolicyContractError('INVALID_JSON_VALUE', 'Symbol array key', [
                        {
                            code: 'symbol_key',
                            message: 'Symbol-keyed values are not JSON',
                            path,
                        },
                    ]);
                }
                if (key === 'length') {
                    continue;
                }
                const index = Number(key);
                if (
                    !/^(?:0|[1-9][0-9]*)$/.test(key) ||
                    !Number.isSafeInteger(index) ||
                    index >= value.length
                ) {
                    throw new PolicyContractError(
                        'INVALID_JSON_VALUE',
                        'Unexpected array property',
                        [
                            {
                                code: 'unexpected_array_property',
                                message: 'Arrays may contain indexed JSON values only',
                                path: `${path}.${key}`,
                            },
                        ],
                    );
                }
                const descriptor = descriptors[key];
                if (!descriptor?.enumerable) {
                    throw new PolicyContractError('INVALID_JSON_VALUE', 'Hidden array property', [
                        {
                            code: 'non_enumerable_property',
                            message: 'Non-enumerable JSON data is forbidden',
                            path: `${path}[${key}]`,
                        },
                    ]);
                }
                if (!Object.hasOwn(descriptor, 'value')) {
                    throw new PolicyContractError('INVALID_JSON_VALUE', 'Array accessor property', [
                        {
                            code: 'accessor_property',
                            message: 'Accessors are executable and forbidden in policy JSON',
                            path: `${path}[${key}]`,
                        },
                    ]);
                }
            }
            const parts: string[] = [];
            for (let index = 0; index < value.length; index += 1) {
                const descriptor = descriptors[String(index)];
                if (descriptor === undefined) {
                    throw new PolicyContractError('INVALID_JSON_VALUE', `Sparse array at ${path}`, [
                        {
                            code: 'sparse_array',
                            message: 'Sparse arrays are not canonical JSON',
                            path: `${path}[${index}]`,
                        },
                    ]);
                }
                parts.push(canonicalizeValue(descriptor.value, `${path}[${index}]`, ancestors));
            }
            return `[${parts.join(',')}]`;
        }

        const prototype = Object.getPrototypeOf(value) as object | null;
        if (prototype !== Object.prototype && prototype !== null) {
            throw new PolicyContractError('INVALID_JSON_VALUE', `Non-plain object at ${path}`, [
                { code: 'non_plain_object', message: 'Only plain JSON objects are allowed', path },
            ]);
        }

        const descriptors = Object.getOwnPropertyDescriptors(value);
        const keys: string[] = [];
        for (const key of Reflect.ownKeys(value)) {
            if (typeof key === 'symbol') {
                throw new PolicyContractError('INVALID_JSON_VALUE', 'Symbol object key', [
                    {
                        code: 'symbol_key',
                        message: 'Symbol-keyed values are not JSON',
                        path,
                    },
                ]);
            }
            const descriptor = descriptors[key];
            if (!descriptor?.enumerable) {
                throw new PolicyContractError('INVALID_JSON_VALUE', 'Hidden object property', [
                    {
                        code: 'non_enumerable_property',
                        message: 'Non-enumerable JSON data is forbidden',
                        path: `${path}.${key}`,
                    },
                ]);
            }
            if (!Object.hasOwn(descriptor, 'value')) {
                throw new PolicyContractError('INVALID_JSON_VALUE', 'Object accessor property', [
                    {
                        code: 'accessor_property',
                        message: 'Accessors are executable and forbidden in policy JSON',
                        path: `${path}.${key}`,
                    },
                ]);
            }
            keys.push(key);
        }
        keys.sort();
        const parts = keys.map((key) => {
            assertValidUnicode(key, `${path}.${key}`);
            if (isDangerousPolicyKey(key)) {
                throw new PolicyContractError(
                    'INVALID_POLICY_PAYLOAD',
                    `Dangerous policy key at ${path}.${key}`,
                    [
                        {
                            code: 'dangerous_key',
                            message: 'Secrets, code, SQL, and raw provider payloads are forbidden',
                            path: `${path}.${key}`,
                        },
                    ],
                );
            }
            return `${JSON.stringify(key)}:${canonicalizeValue(descriptors[key]!.value, `${path}.${key}`, ancestors)}`;
        });
        return `{${parts.join(',')}}`;
    } finally {
        ancestors.delete(value);
    }
};

export const canonicalizeJson = (value: unknown): string =>
    canonicalizeValue(value, '$', new Set<object>());

const cloneCanonicalJson = (canonicalJson: string): JsonValue =>
    JSON.parse(canonicalJson) as JsonValue;

const deepFreeze = <T>(value: T): T => {
    if (typeof value !== 'object' || value === null || Object.isFrozen(value)) {
        return value;
    }
    for (const nested of Object.values(value)) {
        deepFreeze(nested);
    }
    return Object.freeze(value);
};

const readStrictRecord = (
    value: unknown,
    path: string,
    allowedKeys: ReadonlySet<string>,
    errorCode: PolicyContractErrorCode,
): Readonly<Record<string, unknown>> => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new PolicyContractError(errorCode, `Expected object at ${path}`, [
            { code: 'invalid_object', message: 'Expected a plain data object', path },
        ]);
    }
    const prototype = Object.getPrototypeOf(value) as object | null;
    if (prototype !== Object.prototype && prototype !== null) {
        throw new PolicyContractError(errorCode, `Expected plain object at ${path}`, [
            { code: 'non_plain_object', message: 'Expected a plain data object', path },
        ]);
    }

    const descriptors = Object.getOwnPropertyDescriptors(value);
    const result: Record<string, unknown> = {};
    for (const key of Reflect.ownKeys(value)) {
        if (typeof key === 'symbol') {
            throw new PolicyContractError(errorCode, `Symbol key at ${path}`, [
                { code: 'symbol_key', message: 'Symbol keys are forbidden', path },
            ]);
        }
        const propertyPath = `${path}.${key}`;
        const descriptor = descriptors[key];
        if (!descriptor?.enumerable) {
            throw new PolicyContractError(errorCode, `Hidden property at ${propertyPath}`, [
                {
                    code: 'non_enumerable_property',
                    message: 'Non-enumerable metadata is forbidden',
                    path: propertyPath,
                },
            ]);
        }
        if (!Object.hasOwn(descriptor, 'value')) {
            throw new PolicyContractError(errorCode, `Accessor at ${propertyPath}`, [
                {
                    code: 'accessor_property',
                    message: 'Executable metadata accessors are forbidden',
                    path: propertyPath,
                },
            ]);
        }
        if (!allowedKeys.has(key)) {
            throw new PolicyContractError(errorCode, `Unknown property at ${propertyPath}`, [
                {
                    code: 'unknown_property',
                    message: 'Unexpected metadata property',
                    path: propertyPath,
                },
            ]);
        }
        result[key] = descriptor.value;
    }
    return result;
};

const readStrictArray = (
    value: unknown,
    path: string,
    errorCode: PolicyContractErrorCode,
): readonly unknown[] => {
    if (!Array.isArray(value)) {
        throw new PolicyContractError(errorCode, `Expected array at ${path}`, [
            { code: 'invalid_array', message: 'Expected an array', path },
        ]);
    }
    const descriptors = Object.getOwnPropertyDescriptors(value);
    const result: unknown[] = [];
    for (const key of Reflect.ownKeys(value)) {
        if (typeof key === 'symbol') {
            throw new PolicyContractError(errorCode, `Symbol key at ${path}`, [
                { code: 'symbol_key', message: 'Symbol keys are forbidden', path },
            ]);
        }
        if (key === 'length') {
            continue;
        }
        const index = Number(key);
        const propertyPath = `${path}[${key}]`;
        if (
            !/^(?:0|[1-9][0-9]*)$/.test(key) ||
            !Number.isSafeInteger(index) ||
            index >= value.length
        ) {
            throw new PolicyContractError(errorCode, `Unexpected array property at ${path}`, [
                {
                    code: 'unexpected_array_property',
                    message: 'Arrays may contain indexed values only',
                    path: `${path}.${key}`,
                },
            ]);
        }
        const descriptor = descriptors[key];
        if (
            descriptor === undefined ||
            !descriptor.enumerable ||
            !Object.hasOwn(descriptor, 'value')
        ) {
            throw new PolicyContractError(errorCode, `Invalid array entry at ${propertyPath}`, [
                {
                    code: 'invalid_array_entry',
                    message: 'Array entries must be enumerable data properties',
                    path: propertyPath,
                },
            ]);
        }
        result[index] = descriptor.value;
    }
    let isSparse = result.length !== value.length;
    for (let index = 0; index < value.length; index += 1) {
        if (!(index in result)) {
            isSparse = true;
            break;
        }
    }
    if (isSparse) {
        throw new PolicyContractError(errorCode, `Sparse array at ${path}`, [
            { code: 'sparse_array', message: 'Sparse arrays are forbidden', path },
        ]);
    }
    return result;
};

const bytesToHex = (bytes: ArrayBuffer): string =>
    Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');

export const hashCanonicalJson = async (
    value: unknown,
): Promise<{ readonly canonicalJson: string; readonly payloadHash: string }> => {
    const canonicalJson = canonicalizeJson(value);
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonicalJson));
    return Object.freeze({ canonicalJson, payloadHash: bytesToHex(digest) });
};

const assertStrictPolicySchema = (schema: z.ZodType, path: string): void => {
    const seen = new Set<object>();

    const visit = (value: unknown, currentPath: string): void => {
        if (typeof value !== 'object' || value === null || seen.has(value)) {
            return;
        }
        seen.add(value);

        const internals = value as { readonly _zod?: { readonly def?: unknown } };
        const definition = internals._zod?.def;
        if (typeof definition === 'object' && definition !== null) {
            const record = definition as Readonly<Record<string, unknown>>;
            if (record.type === 'lazy') {
                throw new PolicyContractError(
                    'INVALID_POLICY_PAYLOAD',
                    'Opaque policy validators cannot prove strict object boundaries',
                    [
                        {
                            code: 'opaque_validator',
                            message: 'Lazy policy schemas are not supported',
                            path: currentPath,
                        },
                    ],
                );
            }
            if (record.type === 'object') {
                const catchall = record.catchall as
                    | { readonly _zod?: { readonly def?: { readonly type?: unknown } } }
                    | undefined;
                if (catchall?._zod?.def?.type !== 'never') {
                    throw new PolicyContractError(
                        'INVALID_POLICY_PAYLOAD',
                        'Policy validators must reject unknown object properties',
                        [
                            {
                                code: 'non_strict_validator',
                                message: 'Use strict object validation at every object boundary',
                                path: currentPath,
                            },
                        ],
                    );
                }
            }
            for (const [key, nested] of Object.entries(record)) {
                visit(nested, `${currentPath}.${key}`);
            }
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((nested, index) => visit(nested, `${currentPath}[${index}]`));
            return;
        }
        for (const [key, nested] of Object.entries(value)) {
            visit(nested, `${currentPath}.${key}`);
        }
    };

    visit(schema, path);
};

export const createPolicyValidatorRegistry = (
    bindings: readonly PolicyValidatorBinding[],
): PolicyValidatorRegistry => {
    const validators = new Map<string, PolicyValidatorBinding>();
    const rawBindings = readStrictArray(bindings, '$.bindings', 'INVALID_POLICY_PAYLOAD');
    rawBindings.forEach((rawBinding, index) => {
        const binding = readStrictRecord(
            rawBinding,
            `$.bindings[${index}]`,
            new Set(['kind', 'schema', 'schemaVersion', 'validatorId']),
            'INVALID_POLICY_PAYLOAD',
        );
        assertPolicyKind(binding.kind, `$.bindings[${index}].kind`);
        assertRegistryIdentifier(binding.schemaVersion, `$.bindings[${index}].schemaVersion`);
        assertRegistryIdentifier(binding.validatorId, `$.bindings[${index}].validatorId`);
        const schema = binding.schema as z.ZodType;
        if (!(schema instanceof z.ZodType)) {
            throw new PolicyContractError('INVALID_POLICY_PAYLOAD', 'Invalid policy validator', [
                {
                    code: 'invalid_validator',
                    message: 'Expected a Zod validator',
                    path: `$.bindings[${index}].schema`,
                },
            ]);
        }
        const key = registryKey(binding.kind, binding.schemaVersion);
        if (validators.has(key)) {
            throw new PolicyContractError(
                'DUPLICATE_VALIDATOR',
                `Duplicate validator for ${binding.kind}@${binding.schemaVersion}`,
                [
                    {
                        code: 'duplicate_validator',
                        message:
                            'Each policy kind and schema version may bind exactly one validator',
                        path: `$.bindings[${index}]`,
                    },
                ],
            );
        }
        assertStrictPolicySchema(schema, `$.bindings[${index}].schema`);
        validators.set(
            key,
            Object.freeze({
                kind: binding.kind,
                schema,
                schemaVersion: binding.schemaVersion,
                validatorId: binding.validatorId,
            }),
        );
    });

    return Object.freeze({
        validate(
            kind: PolicyKind,
            schemaVersion: string,
            payload: unknown,
        ): ValidatedPolicyPayload {
            assertPolicyKind(kind, '$.kind');
            assertRegistryIdentifier(schemaVersion, '$.schemaVersion');
            const binding = validators.get(registryKey(kind, schemaVersion));
            if (!binding) {
                throw new PolicyContractError(
                    'VALIDATOR_NOT_FOUND',
                    `No validator registered for ${kind}@${schemaVersion}`,
                    [
                        {
                            code: 'validator_not_found',
                            message: 'Register the exact policy kind and schema version before use',
                            path: '$.schemaVersion',
                        },
                    ],
                );
            }

            const inputCanonicalJson = canonicalizeJson(payload);
            let result: z.ZodSafeParseResult<unknown>;
            try {
                result = binding.schema.safeParse(payload);
            } catch {
                throw new PolicyContractError(
                    'INVALID_POLICY_PAYLOAD',
                    `Policy validator ${binding.validatorId} could not run synchronously`,
                    [
                        {
                            code: 'validator_exception',
                            message:
                                'Policy validators must be synchronous and report stable validation issues',
                            path: '$',
                        },
                    ],
                );
            }
            const resultRecord = readStrictRecord(
                result,
                '$.validatorResult',
                new Set(['data', 'error', 'success']),
                'INVALID_POLICY_PAYLOAD',
            );
            if (
                (resultRecord.success === true &&
                    (!Object.hasOwn(resultRecord, 'data') ||
                        Object.hasOwn(resultRecord, 'error'))) ||
                (resultRecord.success === false &&
                    (!Object.hasOwn(resultRecord, 'error') ||
                        Object.hasOwn(resultRecord, 'data') ||
                        !(resultRecord.error instanceof z.ZodError))) ||
                (resultRecord.success !== true && resultRecord.success !== false)
            ) {
                throw new PolicyContractError(
                    'INVALID_POLICY_PAYLOAD',
                    `Policy validator ${binding.validatorId} returned an invalid result`,
                    [
                        {
                            code: 'invalid_validator_result',
                            message: 'Expected a complete Zod safe-parse result',
                            path: '$.validatorResult',
                        },
                    ],
                );
            }
            if (!result.success) {
                throw new PolicyContractError(
                    'INVALID_POLICY_PAYLOAD',
                    `Policy payload failed ${binding.validatorId}`,
                    result.error.issues.map((issue) => ({
                        code: issue.code,
                        message: issue.message,
                        path: issuePath(issue.path),
                    })),
                );
            }

            const canonicalJson = canonicalizeJson(result.data);
            if (canonicalJson !== inputCanonicalJson) {
                throw new PolicyContractError(
                    'INVALID_POLICY_PAYLOAD',
                    `Policy payload was changed by ${binding.validatorId}`,
                    [
                        {
                            code: 'non_canonical_payload',
                            message:
                                'Validators must reject rather than strip, coerce, or transform policy data',
                            path: '$',
                        },
                    ],
                );
            }
            return Object.freeze({
                kind,
                payload: deepFreeze(cloneCanonicalJson(canonicalJson)),
                schemaVersion,
                validatorId: binding.validatorId,
            });
        },
    });
};

interface ValidatedSafeDiff {
    readonly entry: PolicySafeDiffEntry;
    readonly pointerSegments: readonly string[];
}

const parseSafeDiffPath = (path: unknown, metadataPath: string): readonly string[] => {
    if (
        typeof path !== 'string' ||
        !path.startsWith('/') ||
        path.length > 256 ||
        path.normalize('NFC') !== path ||
        Array.from(path).some((character) => {
            const codePoint = character.codePointAt(0)!;
            return codePoint <= 0x1f || codePoint === 0x7f;
        })
    ) {
        throw new PolicyContractError('INVALID_RELEASE', 'Invalid safe-diff path', [
            {
                code: 'invalid_path',
                message: 'Expected a bounded canonical JSON pointer path',
                path: metadataPath,
            },
        ]);
    }
    try {
        assertValidUnicode(path, metadataPath);
    } catch {
        throw new PolicyContractError('INVALID_RELEASE', 'Invalid safe-diff path Unicode', [
            {
                code: 'invalid_path',
                message: 'Safe-diff paths must contain valid Unicode',
                path: metadataPath,
            },
        ]);
    }
    if (path === '/') {
        return Object.freeze([]);
    }

    const encodedSegments = path.slice(1).split('/');
    const decodedSegments = encodedSegments.map((segment) => {
        if (segment.length === 0 || /~(?![01])/.test(segment)) {
            throw new PolicyContractError('INVALID_RELEASE', 'Invalid JSON pointer segment', [
                {
                    code: 'invalid_path',
                    message:
                        'JSON pointer segments must be non-empty and use only ~0 or ~1 escapes',
                    path: metadataPath,
                },
            ]);
        }
        const decoded = segment.replace(/~1/g, '/').replace(/~0/g, '~');
        if (isDangerousPolicyKey(decoded)) {
            throw new PolicyContractError('INVALID_RELEASE', 'Dangerous safe-diff path', [
                {
                    code: 'dangerous_diff_path',
                    message: 'Safe-diff paths may not identify secrets, code, SQL, or raw data',
                    path: metadataPath,
                },
            ]);
        }
        return decoded;
    });
    return Object.freeze(decodedSegments);
};

const validateSafeDiff = (entries: unknown): readonly ValidatedSafeDiff[] => {
    const rawEntries = readStrictArray(entries, '$.safeDiff', 'INVALID_RELEASE');
    const paths = new Set<string>();
    const validated = rawEntries.map((entry, index) => {
        const record = readStrictRecord(
            entry,
            `$.safeDiff[${index}]`,
            new Set(['afterHash', 'beforeHash', 'change', 'path']),
            'INVALID_RELEASE',
        );
        const { afterHash, beforeHash, change, path } = record;
        const pointerSegments = parseSafeDiffPath(path, `$.safeDiff[${index}].path`);
        const safePath = path as string;
        if (paths.has(safePath)) {
            throw new PolicyContractError('INVALID_RELEASE', 'Duplicate safe-diff path', [
                {
                    code: 'duplicate_diff_path',
                    message: 'Each safe-diff path may appear exactly once',
                    path: `$.safeDiff[${index}].path`,
                },
            ]);
        }
        paths.add(safePath);
        if (change !== 'added' && change !== 'changed' && change !== 'removed') {
            throw new PolicyContractError('INVALID_RELEASE', 'Invalid safe-diff change', [
                {
                    code: 'invalid_diff_change',
                    message: 'Expected added, changed, or removed',
                    path: `$.safeDiff[${index}].change`,
                },
            ]);
        }
        for (const [key, hash] of [
            ['beforeHash', beforeHash],
            ['afterHash', afterHash],
        ] as const) {
            if (
                hash !== undefined &&
                (typeof hash !== 'string' || !SHA256_HEX_PATTERN.test(hash))
            ) {
                throw new PolicyContractError('INVALID_RELEASE', `Invalid safe-diff ${key}`, [
                    {
                        code: 'invalid_hash',
                        message: 'Expected a lowercase SHA-256 hash',
                        path: `$.safeDiff[${index}].${key}`,
                    },
                ]);
            }
        }
        if (
            (change === 'added' && (afterHash === undefined || beforeHash !== undefined)) ||
            (change === 'removed' && (beforeHash === undefined || afterHash !== undefined)) ||
            (change === 'changed' && (beforeHash === undefined || afterHash === undefined))
        ) {
            throw new PolicyContractError(
                'INVALID_RELEASE',
                'Safe-diff hashes do not match change',
                [
                    {
                        code: 'invalid_diff_hashes',
                        message:
                            'Added/removed/changed entries require matching after/before hashes',
                        path: `$.safeDiff[${index}]`,
                    },
                ],
            );
        }
        if (change === 'changed' && beforeHash === afterHash) {
            throw new PolicyContractError('INVALID_RELEASE', 'Safe-diff change is not material', [
                {
                    code: 'unchanged_diff_hash',
                    message: 'Changed entries require different before and after hashes',
                    path: `$.safeDiff[${index}]`,
                },
            ]);
        }
        if (safePath === '/' && change === 'removed') {
            throw new PolicyContractError(
                'INVALID_RELEASE',
                'A release payload cannot be removed',
                [
                    {
                        code: 'root_payload_removed',
                        message: 'Payload-bearing releases cannot record root removal',
                        path: `$.safeDiff[${index}]`,
                    },
                ],
            );
        }
        return Object.freeze({
            entry: Object.freeze({
                change,
                path: safePath,
                ...(typeof beforeHash === 'string' ? { beforeHash } : {}),
                ...(typeof afterHash === 'string' ? { afterHash } : {}),
            }),
            pointerSegments,
        });
    });
    return Object.freeze(validated);
};

const resolveJsonPointer = (
    payload: JsonValue,
    pointerSegments: readonly string[],
): { readonly exists: false } | { readonly exists: true; readonly value: JsonValue } => {
    let current: JsonValue = payload;
    for (const segment of pointerSegments) {
        if (Array.isArray(current)) {
            if (!/^(?:0|[1-9][0-9]*)$/.test(segment)) {
                return { exists: false };
            }
            const index = Number(segment);
            if (!Number.isSafeInteger(index) || index >= current.length) {
                return { exists: false };
            }
            current = current[index]!;
        } else if (typeof current === 'object' && current !== null) {
            if (!Object.hasOwn(current, segment)) {
                return { exists: false };
            }
            current = current[segment]!;
        } else {
            return { exists: false };
        }
    }
    return { exists: true, value: current };
};

const validateSafeDiffEvidence = async (
    safeDiff: readonly ValidatedSafeDiff[],
    payload: JsonValue,
): Promise<readonly PolicySafeDiffEntry[]> => {
    for (const [index, validated] of safeDiff.entries()) {
        const resolved = resolveJsonPointer(payload, validated.pointerSegments);
        if (validated.entry.change === 'removed') {
            if (resolved.exists) {
                throw new PolicyContractError('INVALID_RELEASE', 'Removed path remains present', [
                    {
                        code: 'removed_path_present',
                        message: 'Removed safe-diff paths must be absent from the released payload',
                        path: `$.safeDiff[${index}].path`,
                    },
                ]);
            }
            continue;
        }
        if (!resolved.exists) {
            throw new PolicyContractError('INVALID_RELEASE', 'Safe-diff path is absent', [
                {
                    code: 'diff_path_not_found',
                    message: 'Added and changed paths must resolve in the released payload',
                    path: `$.safeDiff[${index}].path`,
                },
            ]);
        }
        const { payloadHash } = await hashCanonicalJson(resolved.value);
        if (validated.entry.afterHash !== payloadHash) {
            throw new PolicyContractError('INVALID_RELEASE', 'Safe-diff hash does not match path', [
                {
                    code: 'payload_hash_mismatch',
                    message: 'After hash must match the canonical value at the safe-diff path',
                    path: `$.safeDiff[${index}].afterHash`,
                },
            ]);
        }
    }
    return Object.freeze(safeDiff.map(({ entry }) => entry));
};

const validateReleaseOrigin = (value: unknown): PolicyReleaseOrigin => {
    const record = readStrictRecord(
        value,
        '$.origin',
        new Set(['actorId', 'scope', 'type']),
        'INVALID_RELEASE',
    );
    assertIdentifier(record.actorId, '$.origin.actorId');
    assertIdentifier(record.type, '$.origin.type');
    if (record.scope !== 'non-production' && record.scope !== 'production') {
        throw new PolicyContractError('INVALID_RELEASE', 'Invalid release origin scope', [
            {
                code: 'invalid_origin_scope',
                message: 'Expected non-production or production',
                path: '$.origin.scope',
            },
        ]);
    }
    return Object.freeze({
        actorId: record.actorId,
        scope: record.scope,
        type: record.type,
    });
};

const validateCreateReleaseInput = (value: unknown): CreatePolicyReleaseInput => {
    const record = readStrictRecord(
        value,
        '$',
        new Set([
            'effectiveAt',
            'kind',
            'origin',
            'payload',
            'releaseId',
            'safeDiff',
            'schemaVersion',
            'supersedesReleaseId',
        ]),
        'INVALID_RELEASE',
    );
    assertPolicyKind(record.kind, '$.kind');
    assertIdentifier(record.releaseId, '$.releaseId');
    assertRegistryIdentifier(record.schemaVersion, '$.schemaVersion');
    assertUtcTimestamp(record.effectiveAt, '$.effectiveAt');
    if (record.supersedesReleaseId !== undefined) {
        assertIdentifier(record.supersedesReleaseId, '$.supersedesReleaseId');
        if (record.supersedesReleaseId === record.releaseId) {
            throw new PolicyContractError('INVALID_RELEASE', 'A release cannot supersede itself');
        }
    }
    return {
        effectiveAt: record.effectiveAt,
        kind: record.kind,
        origin: validateReleaseOrigin(record.origin),
        payload: record.payload,
        releaseId: record.releaseId,
        safeDiff: record.safeDiff as readonly PolicySafeDiffEntry[],
        schemaVersion: record.schemaVersion,
        ...(record.supersedesReleaseId === undefined
            ? {}
            : { supersedesReleaseId: record.supersedesReleaseId }),
    };
};

export const createPolicyRelease = async (
    registry: PolicyValidatorRegistry,
    input: CreatePolicyReleaseInput,
): Promise<PolicyRelease> => {
    const normalized = validateCreateReleaseInput(input);
    const inputCanonicalJson = canonicalizeJson(normalized.payload);
    let rawValidated: ValidatedPolicyPayload;
    try {
        rawValidated = registry.validate(
            normalized.kind,
            normalized.schemaVersion,
            normalized.payload,
        );
    } catch (error: unknown) {
        if (error instanceof PolicyContractError) {
            throw error;
        }
        throw new PolicyContractError('INVALID_POLICY_PAYLOAD', 'Policy validator failed', [
            {
                code: 'validator_exception',
                message: 'Policy validators must report stable structured failures',
                path: '$',
            },
        ]);
    }
    const validated = readStrictRecord(
        rawValidated,
        '$.validationResult',
        new Set(['kind', 'payload', 'schemaVersion', 'validatorId']),
        'INVALID_POLICY_PAYLOAD',
    );
    assertPolicyKind(validated.kind, '$.validationResult.kind');
    assertRegistryIdentifier(validated.schemaVersion, '$.validationResult.schemaVersion');
    assertRegistryIdentifier(validated.validatorId, '$.validationResult.validatorId');
    if (
        validated.kind !== normalized.kind ||
        validated.schemaVersion !== normalized.schemaVersion
    ) {
        throw new PolicyContractError(
            'INVALID_POLICY_PAYLOAD',
            'Validator result metadata mismatch',
            [
                {
                    code: 'validator_result_mismatch',
                    message: 'Validator result must match the requested kind and schema version',
                    path: '$.validationResult',
                },
            ],
        );
    }
    const validatedCanonicalJson = canonicalizeJson(validated.payload);
    if (validatedCanonicalJson !== inputCanonicalJson) {
        throw new PolicyContractError(
            'INVALID_POLICY_PAYLOAD',
            'Validator substituted a different policy payload',
            [
                {
                    code: 'validator_payload_mismatch',
                    message: 'Validator output must be canonically identical to its input',
                    path: '$.validationResult.payload',
                },
            ],
        );
    }
    const immutablePayload = deepFreeze(cloneCanonicalJson(validatedCanonicalJson));
    const { canonicalJson, payloadHash } = await hashCanonicalJson(immutablePayload);
    const safeDiff = await validateSafeDiffEvidence(
        validateSafeDiff(normalized.safeDiff),
        immutablePayload,
    );
    const validation = Object.freeze({ payloadHash, validatorId: validated.validatorId });
    const release: PolicyRelease = {
        canonicalPayload: canonicalJson,
        effectiveAt: normalized.effectiveAt,
        kind: normalized.kind,
        logicalIdentity: `${normalized.kind}:${normalized.schemaVersion}:${payloadHash}`,
        origin: normalized.origin,
        payload: immutablePayload,
        payloadHash,
        releaseId: normalized.releaseId,
        safeDiff,
        schemaVersion: normalized.schemaVersion,
        validation,
        ...(normalized.supersedesReleaseId === undefined
            ? {}
            : { supersedesReleaseId: normalized.supersedesReleaseId }),
    };
    return deepFreeze(release);
};

const validateEvaluatedInput = (value: unknown): EvaluatedInputVersion => {
    const record = readStrictRecord(
        value,
        '$.evaluatedInput',
        new Set(['id', 'kind', 'version']),
        'INVALID_POLICY_SNAPSHOT',
    );
    assertSnapshotIdentifier(record.kind, '$.evaluatedInput.kind');
    assertSnapshotIdentifier(record.id, '$.evaluatedInput.id');
    assertSnapshotIdentifier(record.version, '$.evaluatedInput.version');
    return Object.freeze({ id: record.id, kind: record.kind, version: record.version });
};

const assertSnapshotIdentifier: (value: unknown, path: string) => asserts value is string = (
    value,
    path,
) => {
    if (typeof value !== 'string' || !IDENTIFIER_PATTERN.test(value)) {
        throw new PolicyContractError('INVALID_POLICY_SNAPSHOT', `Invalid identifier at ${path}`, [
            {
                code: 'invalid_snapshot_identifier',
                message: 'Expected a stable snapshot identifier',
                path,
            },
        ]);
    }
};

const assertSnapshotRegistryIdentifier: (
    value: unknown,
    path: string,
) => asserts value is string = (value, path) => {
    if (typeof value !== 'string' || !REGISTRY_IDENTIFIER_PATTERN.test(value)) {
        throw new PolicyContractError('INVALID_POLICY_SNAPSHOT', `Invalid version at ${path}`, [
            {
                code: 'invalid_snapshot_version',
                message: 'Expected a stable validator registry version',
                path,
            },
        ]);
    }
};

const validatePolicySnapshot = (value: unknown): PolicySnapshotReference => {
    const record = readStrictRecord(
        value,
        '$',
        new Set(['evaluatedInput', 'kind', 'payloadHash', 'policyReleaseId', 'schemaVersion']),
        'INVALID_POLICY_SNAPSHOT',
    );
    assertPolicyKind(record.kind, '$.kind');
    assertSnapshotIdentifier(record.policyReleaseId, '$.policyReleaseId');
    assertSnapshotRegistryIdentifier(record.schemaVersion, '$.schemaVersion');
    if (typeof record.payloadHash !== 'string' || !SHA256_HEX_PATTERN.test(record.payloadHash)) {
        throw new PolicyContractError('INVALID_POLICY_SNAPSHOT', 'Invalid snapshot payload hash', [
            {
                code: 'invalid_snapshot_hash',
                message: 'Expected a lowercase SHA-256 hash',
                path: '$.payloadHash',
            },
        ]);
    }
    return deepFreeze({
        evaluatedInput: validateEvaluatedInput(record.evaluatedInput),
        kind: record.kind,
        payloadHash: record.payloadHash,
        policyReleaseId: record.policyReleaseId,
        schemaVersion: record.schemaVersion,
    });
};

export const createPolicySnapshotReference = (
    release: PolicyRelease,
    evaluatedInput: EvaluatedInputVersion,
): PolicySnapshotReference =>
    validatePolicySnapshot({
        evaluatedInput,
        kind: release.kind,
        payloadHash: release.payloadHash,
        policyReleaseId: release.releaseId,
        schemaVersion: release.schemaVersion,
    });

export const assertPolicySnapshotMatches = (
    release: PolicyRelease,
    snapshot: PolicySnapshotReference,
    expectedEvaluatedInput: EvaluatedInputVersion,
): PolicySnapshotReference => {
    const validated = validatePolicySnapshot(snapshot);
    if (
        validated.policyReleaseId !== release.releaseId ||
        validated.kind !== release.kind ||
        validated.schemaVersion !== release.schemaVersion ||
        validated.payloadHash !== release.payloadHash
    ) {
        throw new PolicyContractError(
            'POLICY_SNAPSHOT_MISMATCH',
            `Policy snapshot does not match release ${release.releaseId}`,
            [
                {
                    code: 'policy_release_mismatch',
                    message: 'Snapshot policy metadata must exactly match the release',
                    path: '$',
                },
            ],
        );
    }
    const expected = validateEvaluatedInput(expectedEvaluatedInput);
    if (
        validated.evaluatedInput.kind !== expected.kind ||
        validated.evaluatedInput.id !== expected.id ||
        validated.evaluatedInput.version !== expected.version
    ) {
        throw new PolicyContractError(
            'POLICY_SNAPSHOT_MISMATCH',
            'Policy snapshot evaluated-input evidence does not match',
            [
                {
                    code: 'evaluated_input_mismatch',
                    message: 'Snapshot must identify the exact evaluated input and version',
                    path: '$.evaluatedInput',
                },
            ],
        );
    }
    return validated;
};

export const requirePolicyRelease = (
    releases: readonly PolicyRelease[],
    releaseId: string,
): PolicyRelease => {
    assertIdentifier(releaseId, '$.releaseId');
    const matches = releases.filter((candidate) => candidate.releaseId === releaseId);
    if (matches.length === 0) {
        throw new PolicyContractError(
            'REQUIRED_POLICY_RELEASE_MISSING',
            `Required policy release ${releaseId} is unavailable; operator action is required`,
            [
                {
                    code: 'release_not_found',
                    message: 'The exact required policy release is unavailable',
                    path: '$.releaseId',
                },
            ],
        );
    }
    if (matches.length > 1) {
        throw new PolicyContractError(
            'AMBIGUOUS_POLICY_RELEASE',
            `Policy release ${releaseId} is ambiguous`,
            [
                {
                    code: 'ambiguous_release_id',
                    message: 'A release identifier must resolve to exactly one release',
                    path: '$.releaseId',
                },
            ],
        );
    }
    return matches[0]!;
};
