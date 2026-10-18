"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ReceiptText, ScanLine, Download } from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWorkspace } from "@/lib/store";
import { entryTotals, type JournalEntry } from "@/lib/ledger";
import { downloadCsv, journalToCsv, reportFilename } from "@/lib/export-csv";
import { copy } from "@/lib/copy";
import { idrFull } from "@/lib/format";
import { toast } from "sonner";

type Filter = "all" | "ocr" | "manual";

export default function TransaksiPage() {
  const { entries, ready, business } = useWorkspace();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<JournalEntry | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...entries].reverse().filter((entry) => {
      if (filter === "ocr" && entry.source !== "ocr") return false;
      if (filter === "manual" && entry.source === "ocr") return false;
      if (!q) return true;
      return (
        entry.description.toLowerCase().includes(q) ||
        entry.lines.some((l) => l.account.toLowerCase().includes(q))
      );
    });
  }, [entries, query, filter]);

  if (!ready) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: copy.transaksi.filterAll },
    { id: "ocr", label: copy.transaksi.filterOcr },
    { id: "manual", label: copy.transaksi.filterManual },
  ];

  return (
    <>
      <PageHeader
        title={copy.transaksi.title}
        subtitle={copy.transaksi.subtitle}
        badge={copy.transaksi.countLabel(entries.length)}
      >
        <Button
          variant="outline"
          disabled={filtered.length === 0}
          onClick={() => {
            downloadCsv(
              reportFilename(`${business?.name ?? copy.app.name}-jurnal`, copy.common.total),
              journalToCsv(filtered),
            );
            toast.success(copy.transaksi.exported);
          }}
        >
          <Download className="mr-2 size-4" />
          {copy.transaksi.export}
        </Button>
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.transaksi.searchPlaceholder}
            aria-label={copy.transaksi.searchPlaceholder}
            type="search"
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-lg border p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={
                filter === tab.id
                  ? "rounded-md bg-muted px-3 py-1.5 text-sm font-medium"
                  : "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<ReceiptText className="size-6" />}
              title={copy.transaksi.emptyTitle}
              body={copy.transaksi.emptyBody}
              actions={
                <Button asChild size="sm">
                  <Link href="/record">
                    <ScanLine className="mr-2 size-4" />
                    {copy.dashboard.actionScan}
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left font-medium">{copy.common.date}</th>
                    <th className="px-3 py-2 text-left font-medium">{copy.common.description}</th>
                    <th className="hidden px-3 py-2 text-left font-medium md:table-cell">
                      {copy.common.account}
                    </th>
                    <th className="px-3 py-2 text-right font-medium">{copy.common.amount}</th>
                    <th className="px-3 py-2 text-right font-medium">{copy.common.source}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => {
                    const { debit } = entryTotals(entry.lines);
                    return (
                      <tr
                        key={entry.id}
                        onClick={() => setSelected(entry)}
                        className="cursor-pointer border-b last:border-0 hover:bg-muted/40"
                      >
                        <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </td>
                        <td className="max-w-[22rem] px-3 py-3">
                          <p className="truncate font-medium">{entry.description}</p>
                        </td>
                        <td className="hidden max-w-[16rem] px-3 py-3 text-muted-foreground md:table-cell">
                          <p className="truncate">
                            {entry.lines.map((l) => l.account).join(", ")}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-right font-medium tabular-nums">
                          {idrFull(debit)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          {entry.source === "ocr" ? (
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {copy.transaksi.filterOcr}
                            </Badge>
                          ) : (
                            <Badge variant="outline">{copy.transaksi.filterManual}</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rincian */}
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{copy.transaksi.detailTitle}</DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{copy.common.date}</span>
                  <span>
                    {new Date(selected.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">{copy.common.account}</th>
                        <th className="px-3 py-2 text-right font-medium">{copy.common.debit}</th>
                        <th className="px-3 py-2 text-right font-medium">{copy.common.credit}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.lines.map((line, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2">{line.account}</td>
                          <td className="px-3 py-2 text-right tabular-nums">
                            {line.debit ? idrFull(line.debit) : <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums">
                            {line.credit ? idrFull(line.credit) : <span className="text-muted-foreground">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-700">
                  <span>✓</span>
                  {copy.transaksi.balanced}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
