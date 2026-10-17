"use client";

/**
 * Prose — a deliberately tiny markdown renderer for agent answers.
 *
 * Agents answer in markdown. Dumping that into a `<div>` shows literal `**`
 * markers, which looks broken next to the rest of the UI. This renders the
 * small subset the agents actually emit — headings, bullet lists, bold, inline
 * code — as real elements.
 *
 * It builds React nodes rather than using `dangerouslySetInnerHTML`, so agent
 * output can never inject markup into the page. Deliberately not a full markdown
 * parser: the subset is small, and a dependency here would cost more than it
 * saves.
 */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Split a line into text / bold / code spans. */
function renderInline(line: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Match **bold** and `code` in one pass, keeping the rest as plain text.
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > last) nodes.push(line.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-b${i++}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      nodes.push(
        <code
          key={`${keyPrefix}-c${i++}`}
          className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    }
    last = match.index + token.length;
  }
  if (last < line.length) nodes.push(line.slice(last));
  return nodes;
}

/** Remove `#`/`*` decoration that the renderer re-creates structurally. */
function stripDecoration(line: string): string {
  return line
    .replace(/^#{1,6}\s*/, "")
    .replace(/^[*\-•]\s+/, "")
    .replace(/^\d+[.)]\s+/, "")
    .replace(/\s*#+\s*$/, "")
    .trim();
}

export function Prose({ text, className }: { text: string; className?: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  let key = 0;

  const flushBullets = () => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={`ul-${key++}`} className="ml-4 list-disc space-y-1">
        {bullets.map((b, i) => (
          <li key={i}>{renderInline(b, `li-${key}-${i}`)}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (!line || /^[-*_]{3,}$/.test(line)) {
      flushBullets();
      continue;
    }
    if (/^[*\-•]\s+/.test(line) || /^\d+[.)]\s+/.test(line)) {
      bullets.push(stripDecoration(line));
      continue;
    }

    flushBullets();
    const heading = /^#{1,6}\s+/.test(line);

    // A heading, or a line that is entirely bold (agents often use that shape).
    if (heading || /^\*\*[^*]+\*\*:?$/.test(line)) {
      blocks.push(
        <p key={`h-${key++}`} className="mt-1 font-semibold text-foreground">
          {renderInline(stripDecoration(line), `h-${key}`)}
        </p>,
      );
      continue;
    }

    blocks.push(<p key={`p-${key++}`}>{renderInline(line, `p-${key}`)}</p>);
  }

  flushBullets();

  return <div className={cn("space-y-2 leading-relaxed", className)}>{blocks}</div>;
}
