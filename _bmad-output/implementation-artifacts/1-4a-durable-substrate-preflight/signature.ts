import { createHmac, timingSafeEqual } from "node:crypto";

export const MAX_PAST_AGE_SECONDS = 60;
export const MAX_FUTURE_SKEW_SECONDS = 5;
export const NONCE_RETENTION_SECONDS = 600;

export interface SignedRequestInput {
    body: string;
    nonce: string | null;
    signature: string | null;
    timestamp: string | null;
}

export type VerificationResult =
    | { ok: true; nonce: string; timestamp: number }
    | {
          ok: false;
          reason:
              | "missing_headers"
              | "invalid_nonce"
              | "malformed_timestamp"
              | "stale_timestamp"
              | "future_timestamp"
              | "malformed_signature"
              | "invalid_signature"
              | "replayed_nonce";
      };

export function signRequest(secret: string, timestamp: number, nonce: string, body: string): string {
    return createHmac("sha256", secret)
        .update(`${timestamp}.${nonce}.${body}`, "utf8")
        .digest("hex");
}

export async function verifySignedRequest(
    secret: string,
    input: SignedRequestInput,
    nowSeconds: number,
    claimNonce: (nonce: string, timestamp: number) => Promise<boolean>,
): Promise<VerificationResult> {
    const { body, nonce, signature, timestamp } = input;
    if (!nonce || !signature || !timestamp) {
        return { ok: false, reason: "missing_headers" };
    }
    if (!/^[A-Za-z0-9_-]{16,128}$/.test(nonce)) {
        return { ok: false, reason: "invalid_nonce" };
    }

    const parsedTimestamp = Number(timestamp);
    if (!Number.isSafeInteger(parsedTimestamp)) {
        return { ok: false, reason: "malformed_timestamp" };
    }
    if (nowSeconds - parsedTimestamp > MAX_PAST_AGE_SECONDS) {
        return { ok: false, reason: "stale_timestamp" };
    }
    if (parsedTimestamp - nowSeconds > MAX_FUTURE_SKEW_SECONDS) {
        return { ok: false, reason: "future_timestamp" };
    }
    if (!/^[0-9a-f]{64}$/i.test(signature)) {
        return { ok: false, reason: "malformed_signature" };
    }

    const expected = Buffer.from(signRequest(secret, parsedTimestamp, nonce, body), "hex");
    const received = Buffer.from(signature, "hex");
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
        return { ok: false, reason: "invalid_signature" };
    }
    if (!(await claimNonce(nonce, parsedTimestamp))) {
        return { ok: false, reason: "replayed_nonce" };
    }
    return { ok: true, nonce, timestamp: parsedTimestamp };
}

if (NONCE_RETENTION_SECONDS <= MAX_PAST_AGE_SECONDS + MAX_FUTURE_SKEW_SECONDS + 5) {
    throw new Error("Nonce retention must exceed the full accepted timestamp window and clock-drift margin");
}
