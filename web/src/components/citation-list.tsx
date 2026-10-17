"use client";

import type { TaxCitation } from "@/lib/adk";
import { copy } from "@/lib/copy";

/**
 * The grounded legal basis for a tax figure: one line per Pasal/Ayat, with an
 * expandable verbatim quote. Read by shop owners and judges alike, so the
 * article is the headline and the quote is secondary.
 */
export function CitationList({
  citations,
  showQuotes = false,
}: {
  citations: TaxCitation[] | undefined;
  showQuotes?: boolean;
}) {
  if (!citations?.length) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">{copy.pajak.legalBasis}</p>
      <ul className="space-y-2">
        {citations.map((c) => (
          <li key={c.article} className="rounded-lg border bg-background/60 p-3">
            <div className="flex items-start gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-500" />
              <div className="min-w-0 space-y-1">
                <p className="text-xs">
                  <span className="font-medium text-foreground">{c.article}</span>
                  <span className="text-muted-foreground"> — {c.label}</span>
                </p>
                {showQuotes && (
                  <blockquote className="border-l-2 border-teal-500/30 pl-3 text-[0.7rem] italic leading-relaxed text-muted-foreground">
                    “{c.quote}”
                  </blockquote>
                )}
                <p className="text-[0.65rem] text-muted-foreground/70">
                  {copy.pajak.verbatimQuote}: {c.source} · {c.file}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
