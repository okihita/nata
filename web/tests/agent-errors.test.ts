/**
 * Error-classification tests.
 *
 * Every agent-call failure used to show the same message ("we cannot reach the
 * bookkeeping service"). A live run hit HTTP 429 from Vertex AI and the screen
 * told the owner Nata could not be reached — inviting them to check whether it
 * was running, when in fact it was busy.
 *
 * The correct action differs per cause, so the distinction is worth pinning.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { describeAgentError } from "../src/lib/agent-errors.ts";
import { copy } from "../src/lib/copy.ts";

test("a rate limit is reported as busy, not unreachable", () => {
  const fromError = describeAgentError(
    new Error("429 RESOURCE_EXHAUSTED. {'error': {'code': 429, 'status': 'RESOURCE_EXHAUSTED'}}"),
  );
  assert.equal(fromError, copy.banner.busy);
  assert.notEqual(fromError, copy.banner.offline);
});

test("the variants Vertex AI emits are all recognised", () => {
  for (const message of [
    "429 Too Many Requests",
    "RESOURCE_EXHAUSTED",
    "Resource exhausted. Please try again later.",
    "Quota exceeded for quota metric",
    "rate limit reached",
  ]) {
    assert.equal(
      describeAgentError(new Error(message)),
      copy.banner.busy,
      `not classified as busy: ${message}`,
    );
  }
});

test("a timeout is its own message", () => {
  assert.equal(describeAgentError(new Error("Request timeout after 60s")), copy.banner.timeout);
  assert.equal(describeAgentError(new Error("operation timed out")), copy.banner.timeout);
});

test("an unreachable backend stays offline", () => {
  assert.equal(
    describeAgentError(new Error("fetch failed: ECONNREFUSED 127.0.0.1:48700")),
    copy.banner.offline,
  );
  assert.equal(describeAgentError(new Error("HTTP 502 Bad Gateway")), copy.banner.offline);
});

test("a bare string is classified too", () => {
  // `event.errorMessage` arrives as a plain string from the SSE stream.
  assert.equal(describeAgentError("429 RESOURCE_EXHAUSTED"), copy.banner.busy);
  assert.equal(describeAgentError("something else entirely"), copy.banner.offline);
});

test("an unknown or empty failure falls back to offline", () => {
  for (const input of [undefined, null, "", {}, 0]) {
    assert.equal(describeAgentError(input), copy.banner.offline);
  }
});

test("the messages are distinct, so the owner is never told the wrong thing", () => {
  const values = new Set([copy.banner.offline, copy.banner.busy, copy.banner.timeout]);
  assert.equal(values.size, 3);
});
