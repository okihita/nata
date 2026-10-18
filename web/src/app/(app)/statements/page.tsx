"use client";

import { useMemo, useState } from "react";
import {
  FileBarChart,
  ShieldCheck,
  ShieldAlert,
  ScanLine,
  Download,
  FileText,
  Printer,
  ChevronDown,
} from "lucide-react";

import Link from "next/link";

import { PageHeader } from "@/components/app-sidebar";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspace } from "@/lib/store";
import { balanceSheet, incomeStatement, type JournalEntry } from "@/lib/ledger";
import { downloadCsv, reportFilename, statementsToCsv } from "@/lib/export-csv";
import { openStatementPdfInNewTab } from "@/lib/statement-pdf";
import { useLanguage } from "@/lib/copy";
import { idrFull } from "@/lib/format";
import { toast } from "sonner";

export default function LaporanPage() {
  const { entries, ready, business } = useWorkspace();
  const { copy, locale } = useLanguage();
  const [period, setPeriod] = useState("all");

  const periods = useMemo(() => {
    const set = new Set(entries.map((e) => e.date.slice(0, 7)));
    return [...set].sort().reverse();
  }, [entries]);

  const scoped: JournalEntry[] = useMemo(
    () => (period === "all" ? entries : entries.filter((e) => e.date.startsWith(period))),
    [entries, period],
  );

  const income = incomeStatement(scoped);
  const bs = balanceSheet(scoped);

  if (!ready) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Statements only mean something once there are entries. With an empty
  // journal, point at the action that produces the first one instead of
  // rendering two all-zero statements.
  if (entries.length === 0) {
    return (
      <>
        <PageHeader title={copy.laporan.title} subtitle={copy.laporan.subtitle} />
        <Card>
          <CardContent>
            <EmptyState
              icon={<FileBarChart className="size-6" />}
              title={copy.laporan.emptyTitle}
              body={copy.laporan.emptyBody}
              actions={
                <Button asChild size="sm">
                  <Link href="/record">
                    <ScanLine className="mr-2 size-4" />
                    {copy.dashboard.actionScan}
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      </>
    );
  }

  const periodLabel =
    period === "all"
      ? copy.laporan.allPeriods
      : new Date(`${period}-01`).toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
          month: "long",
          year: "numeric",
        });

  const handleExportCsv = () => {
    downloadCsv(
      reportFilename(business?.name ?? copy.app.name, periodLabel),
      statementsToCsv(scoped, {
        periodLabel,
        businessName: business?.name ?? copy.app.name,
      }),
    );
    toast.success(copy.laporan.exported);
  };

  const handleExportPdf = () => {
    openStatementPdfInNewTab(scoped, {
      businessName: business?.name ?? copy.app.name,
      businessAddress: business?.address,
      npwp: business?.npwp,
      nib: business?.nib,
      periodLabel,
      calkPoints: copy.laporan.calkPoints,
      locale,
    });
    toast.success(copy.laporan.exportedPdf);
  };

  return (
    <>
      <PageHeader title={copy.laporan.title} subtitle={copy.laporan.subtitle}>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[13rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{copy.laporan.allPeriods}</SelectItem>
            {periods.map((p) => (
              <SelectItem key={p} value={p}>
                {new Date(`${p}-01`).toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
                  month: "long",
                  year: "numeric",
                })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={scoped.length === 0} className="gap-1.5 font-medium">
              <Download className="size-4" />
              <span>{copy.laporan.export}</span>
              <ChevronDown className="size-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={handleExportPdf} className="gap-2 cursor-pointer">
              <Printer className="size-4 text-primary" />
              <div className="grid">
                <span className="text-xs font-semibold">{copy.laporan.exportPdf}</span>
                <span className="text-[10px] text-muted-foreground">Buka tab cetak / simpan PDF</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportCsv} className="gap-2 cursor-pointer">
              <FileText className="size-4 text-emerald-600" />
              <div className="grid">
                <span className="text-xs font-semibold">{copy.laporan.exportCsv}</span>
                <span className="text-[10px] text-muted-foreground">Unduh file spreadsheet .csv</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PageHeader>

      <p className="mb-4 text-sm text-muted-foreground">
        {copy.laporan.period}: <span className="font-medium text-foreground">{periodLabel}</span>
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Laba Rugi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{copy.laporan.labaRugi}</CardTitle>
            <CardDescription>{periodLabel}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Section
              title={copy.laporan.revenue}
              rows={income.revenue}
              emptyText={copy.common.empty}
            />
            <Row label={copy.laporan.totalRevenue} value={income.totalRevenue} strong />

            <div className="border-t pt-4">
              <Section
                title={copy.laporan.expenses}
                rows={income.expenses}
                emptyText={copy.common.empty}
              />
            </div>
            <Row label={copy.laporan.totalExpenses} value={income.totalExpenses} strong />

            <div className="border-t pt-4">
              <Row
                label={copy.laporan.netIncome}
                value={income.netIncome}
                strong
                tone={income.netIncome >= 0 ? "positive" : "negative"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Posisi Keuangan */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">{copy.laporan.posisi}</CardTitle>
                <CardDescription>{periodLabel}</CardDescription>
              </div>
              {bs.balanced ? (
                <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600">
                  <ShieldCheck className="size-3" />
                  {copy.transaksi.balanced}
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <ShieldAlert className="size-3" />
                  {copy.laporan.difference}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Section title={copy.laporan.assets} rows={bs.assets} emptyText={copy.common.empty} />
            <Row label={copy.laporan.totalAssets} value={bs.totalAssets} strong />

            <div className="border-t pt-4">
              <Section
                title={copy.laporan.liabilities}
                rows={bs.liabilities}
                emptyText={copy.common.empty}
              />
              <Row label={copy.laporan.totalLiabilities} value={bs.totalLiabilities} strong />
            </div>

            <div className="border-t pt-4">
              <Section
                title={copy.laporan.equity}
                rows={bs.equity}
                emptyText={copy.common.empty}
              />
              <Row label={copy.laporan.totalEquity} value={bs.totalEquity} strong />
            </div>

            <div className="border-t pt-4">
              <Row
                label={`${copy.laporan.totalLiabilities} + ${copy.laporan.totalEquity}`}
                value={bs.totalLiabilities + bs.totalEquity}
                strong
              />
              <p
                className={`mt-2 text-xs ${bs.balanced ? "text-emerald-700" : "text-destructive"}`}
              >
                {bs.balanced ? copy.laporan.balancedNote : copy.laporan.unbalancedNote}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CALK */}
      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileBarChart className="size-4 text-muted-foreground" />
              {copy.laporan.calk}
            </CardTitle>
            <CardDescription>{copy.laporan.calkIntro}</CardDescription>
          </div>
          <Badge variant="secondary">SAK EMKM</Badge>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {copy.laporan.calkPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}

function Section({
  title,
  rows,
  emptyText,
}: {
  title: string;
  rows: { account: string; amount: number }[];
  emptyText: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="space-y-1.5">
          {rows.map((row) => (
            <li key={row.account} className="flex items-center justify-between gap-4 text-sm">
              <span className="truncate">{row.account}</span>
              <span className="shrink-0 tabular-nums">{idrFull(row.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: number;
  strong?: boolean;
  tone?: "positive" | "negative";
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={strong ? "text-sm font-medium" : "text-sm"}>{label}</span>
      <span
        className={[
          "shrink-0 tabular-nums",
          strong ? "text-sm font-semibold" : "text-sm",
          tone === "positive" ? "text-emerald-600" : tone === "negative" ? "text-rose-600" : "",
        ].join(" ")}
      >
        {idrFull(value)}
      </span>
    </div>
  );
}
