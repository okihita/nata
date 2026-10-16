"use client";

/**
 * EmptyState — the shared "nothing here yet" surface.
 *
 * Every list in the app eventually has zero rows: a brand-new business has no
 * journal at all. A blank table in that moment reads as broken; this component
 * makes the empty case a deliberate, encouraging step instead.
 *
 * Two shapes, one component:
 *  - page-level (default): a centred card with icon, title, body, actions.
 *  - inline (`compact`):  a smaller block for a panel inside a populated page.
 */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  body,
  actions,
  hint,
  compact = false,
  className,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  actions?: ReactNode;
  hint?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        compact ? "gap-3 py-10" : "gap-4 py-16",
        className,
      )}
    >
      <span
        className={cn(
          "grid place-items-center rounded-2xl bg-primary/10 text-primary",
          compact ? "size-11" : "size-14",
        )}
      >
        {icon}
      </span>
      <div className="space-y-1.5">
        <h3 className={cn("font-semibold", compact ? "text-sm" : "text-base")}>{title}</h3>
        <p
          className={cn(
            "mx-auto text-muted-foreground",
            compact ? "max-w-sm text-xs" : "max-w-md text-sm",
          )}
        >
          {body}
        </p>
      </div>
      {actions && <div className="flex flex-wrap items-center justify-center gap-2">{actions}</div>}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
