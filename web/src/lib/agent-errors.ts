/**
 * Error classification for agent calls.
 *
 * The screens used to report every failure with one message — "we cannot reach
 * the bookkeeping service" — which is wrong in a way that misleads the owner.
 * A live run hit HTTP 429 (Vertex AI quota exhausted) and the screen said Nata
 * could not be reached, inviting them to check whether it was running. It was
 * running; it was busy.
 *
 * Telling them apart matters because the correct action differs: a rate limit
 * means "try again in a moment", while an unreachable backend means "the
 * service is not up".
 */

import { copy } from "./copy";

/** What to show the owner for a failed agent call. */
export function describeAgentError(error: unknown): string {
  const text =
    error instanceof Error
      ? `${error.name} ${error.message}`
      : typeof error === "string"
        ? error
        : "";

  const lower = text.toLowerCase();

  if (
    lower.includes("429") ||
    lower.includes("resource_exhausted") ||
    lower.includes("resource exhausted") ||
    lower.includes("quota") ||
    lower.includes("rate limit")
  ) {
    return copy.banner.busy;
  }

  // A timeout is a different failure again: the work may still be running.
  if (lower.includes("timeout") || lower.includes("timed out")) {
    return copy.banner.timeout;
  }

  return copy.banner.offline;
}
