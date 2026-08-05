import { describe, expect, test } from "bun:test";
import {
    MAX_FUTURE_SKEW_SECONDS,
    MAX_PAST_AGE_SECONDS,
    NONCE_RETENTION_SECONDS,
    signRequest,
    verifySignedRequest,
} from "./signature";

const secret = "fixture-secret-that-is-never-used-outside-this-test";
const now = 2_000_000_000;
const body = JSON.stringify({ traceId: "fixture", workMs: 0 });
const nonce = "fixture_nonce_0001";

function signed(overrides: Partial<{ body: string; nonce: string; timestamp: number; signature: string }> = {}) {
    const requestBody = overrides.body ?? body;
    const requestNonce = overrides.nonce ?? nonce;
    const timestamp = overrides.timestamp ?? now;
    return {
        body: requestBody,
        nonce: requestNonce,
        timestamp: String(timestamp),
        signature: overrides.signature ?? signRequest(secret, timestamp, requestNonce, requestBody),
    };
}

describe("durable-substrate signed request", () => {
    test("accepts a valid request and atomically claims its nonce", async () => {
        let claims = 0;
        const result = await verifySignedRequest(secret, signed(), now, async () => {
            claims += 1;
            return true;
        });
        expect(result.ok).toBe(true);
        expect(claims).toBe(1);
    });

    test.each([
        ["missing", { ...signed(), signature: null }, "missing_headers"],
        ["malformed", { ...signed(), signature: "not-hex" }, "malformed_signature"],
        ["stale", signed({ timestamp: now - MAX_PAST_AGE_SECONDS - 1 }), "stale_timestamp"],
        ["future", signed({ timestamp: now + MAX_FUTURE_SKEW_SECONDS + 1 }), "future_timestamp"],
        ["tampered", { ...signed(), body: `${body} ` }, "invalid_signature"],
        ["invalid", signed({ signature: "00".repeat(32) }), "invalid_signature"],
    ] as const)("rejects %s input before claiming a nonce", async (_name, input, reason) => {
        let claims = 0;
        const result = await verifySignedRequest(secret, input, now, async () => {
            claims += 1;
            return true;
        });
        expect(result).toEqual({ ok: false, reason });
        expect(claims).toBe(0);
    });

    test("rejects a replay before work", async () => {
        const result = await verifySignedRequest(secret, signed(), now, async () => false);
        expect(result).toEqual({ ok: false, reason: "replayed_nonce" });
    });

    test("retains nonces beyond the full timestamp window and drift margin", () => {
        expect(NONCE_RETENTION_SECONDS).toBeGreaterThan(
            MAX_PAST_AGE_SECONDS + MAX_FUTURE_SKEW_SECONDS + 5,
        );
    });
});
