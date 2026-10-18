"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, ShieldAlert, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWorkspace } from "@/lib/store";
import { useLanguage } from "@/lib/copy";
import { idrFull } from "@/lib/format";
import { INITIAL_APPROVALS, type ApprovalItem } from "@/lib/approvals-data";

export function ApprovalGateModal() {
  const { business } = useWorkspace();
  const { copy, locale } = useLanguage();
  const [open, setOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("approvals") === "1" || params.get("approvals") === "open";
    }
    return false;
  });

  const archetypeKey = useMemo<"A" | "B">(() => {
    if (business?.id.includes("persona-b")) return "B";
    return "A";
  }, [business]);

  const [approvalsState, setApprovalsState] = useState<Record<"A" | "B", ApprovalItem[]>>(INITIAL_APPROVALS);

  const currentItems = approvalsState[archetypeKey] || [];
  const pendingCount = currentItems.filter((i) => i.status === "pending").length;

  const handleStatusChange = (id: string, status: "approved" | "rejected") => {
    setApprovalsState((prev) => ({
      ...prev,
      [archetypeKey]: prev[archetypeKey].map((item) =>
        item.id === id ? { ...item, status } : item
      ),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative h-8 gap-1.5 px-2.5 text-xs font-medium border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800 shadow-2xs"
          aria-label={copy.approvals.badge}
        >
          <ShieldAlert className="size-3.5 text-amber-600 dark:text-amber-500" />
          <span className="hidden sm:inline">{copy.approvals.badge}</span>
          {pendingCount > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-amber-600 px-1.5 py-0.5 text-xs font-semibold leading-none text-white dark:bg-amber-500">
              {pendingCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <ShieldAlert className="size-4" />
            </span>
            <DialogTitle className="text-base font-semibold text-stone-900 dark:text-stone-100">
              {copy.approvals.dialogTitle}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-stone-600 dark:text-stone-400">
            {copy.approvals.dialogDesc}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {currentItems.length === 0 || pendingCount === 0 ? (
            <div className="rounded-lg border border-dashed border-stone-200 p-6 text-center dark:border-stone-800">
              <CheckCircle2 className="mx-auto size-8 text-emerald-600 dark:text-emerald-500 mb-2" />
              <div className="text-xs font-medium text-stone-900 dark:text-stone-100">
                {copy.approvals.noPending}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {copy.approvals.noPendingDesc}
              </div>
            </div>
          ) : (
            currentItems.map((item) => {
              const title = locale === "en" ? item.titleEn : item.titleId;
              const desc = locale === "en" ? item.descEn : item.descId;
              const impact = locale === "en" ? item.impactEn : item.impactId;
              const note = locale === "en" ? item.noteEn : item.noteId;

              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-stone-200 bg-stone-50/50 p-4 dark:border-stone-800 dark:bg-stone-900/40 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium px-2 py-0.5 rounded border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800"
                        >
                          {item.agentName}
                        </Badge>
                        {item.statuteCitation && (
                          <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                            {item.statuteCitation}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {title}
                      </h4>
                    </div>

                    {item.status === "approved" ? (
                      <Badge className="bg-emerald-600 text-white text-xs px-2 py-0.5">
                        {copy.approvals.approvedBadge}
                      </Badge>
                    ) : item.status === "rejected" ? (
                      <Badge variant="outline" className="text-stone-500 text-xs px-2 py-0.5">
                        {copy.approvals.rejectedBadge}
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-600 text-white text-xs px-2 py-0.5">
                        {copy.approvals.pendingBadge}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {desc}
                  </p>

                  <div className="rounded border border-stone-200 bg-white p-2.5 dark:border-stone-800 dark:bg-stone-900 text-xs space-y-1">
                    <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
                      <span className="font-medium">{copy.approvals.impactLabel}:</span>
                      {item.amount && (
                        <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">
                          {idrFull(item.amount)}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 font-medium">
                      {impact}
                    </p>
                    {note && (
                      <p className="text-stone-500 dark:text-stone-500 italic pt-0.5">
                        {note}
                      </p>
                    )}
                  </div>

                  {item.status === "pending" && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(item.id, "rejected")}
                        className="h-7 text-xs border-stone-200 text-stone-600 hover:bg-stone-100 dark:border-stone-800 dark:text-stone-400 dark:hover:bg-stone-800"
                      >
                        <X className="mr-1 size-3.5" />
                        {copy.approvals.rejectBtn}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(item.id, "approved")}
                        className="h-7 text-xs bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                      >
                        <Check className="mr-1 size-3.5" />
                        {copy.approvals.approveBtn}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
