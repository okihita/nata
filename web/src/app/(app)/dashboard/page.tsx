"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  ChevronRight,
  FileBarChart,
  Landmark,
  ScanLine,
  ShieldCheck,
  Wallet,
  Info,
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  Compass,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/app-sidebar";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/store";
import { ENTITY_LABEL, entityHasExemption } from "@/lib/business";
import { balanceSheet, incomeStatement, monthlyRevenue, taxPosition, trialBalance } from "@/lib/ledger";
import { useLanguage } from "@/lib/copy";
import { idr, idrFull } from "@/lib/format";

export default function DashboardPage() {
  const { entries, ready, business, loadDemo } = useWorkspace();
  const { copy } = useLanguage();
  const [metricScope, setMetricScope] = useState<"this_month" | "all">("this_month");

  // Determine latest active month in the dataset (e.g. "2026-10")
  const latestMonth = useMemo(() => {
    if (entries.length === 0) return new Date().toISOString().slice(0, 7);
    const months = [...new Set(entries.map((e) => e.date.slice(0, 7)))].sort();
    return months[months.length - 1];
  }, [entries]);

  // Entries scoped to this month vs all time
  const thisMonthEntries = useMemo(() => {
    return entries.filter((e) => e.date.slice(0, 7) === latestMonth);
  }, [entries, latestMonth]);

  const activeEntries = metricScope === "this_month" ? thisMonthEntries : entries;

  const income = incomeStatement(activeEntries);
  const bs = balanceSheet(entries); // Balance sheet is always cumulative financial position
  const series = monthlyRevenue(entries);
  const accounts = trialBalance(entries);
  const tax = taxPosition(entries, { individual: entityHasExemption(business?.entity ?? "orang_pribadi") });

  // 2. Action Required & To-Do List (Curated recommendations from AI bots)
  const unpaid = bs.liabilities.filter((l) => l.account.toLowerCase().includes("utang usaha"));
  const unpaidTotal = unpaid.reduce((s, l) => s + l.amount, 0);
  const actions: { id: string; text: string; tone: "info" | "warn"; href: string }[] = [];
  if (unpaid.length > 0 && unpaidTotal > 0) {
    actions.push({
      id: "unpaid",
      text: copy.dashboard.needsUnpaid(unpaid.length, idrFull(unpaidTotal)),
      tone: "warn",
      href: "/statements",
    });
  }
  if (tax.payable > 0) {
    actions.push({
      id: "tax",
      text: copy.dashboard.needsTaxDue(idrFull(tax.payable)),
      tone: "warn",
      href: "/taxes",
    });
  } else if (entityHasExemption(business?.entity ?? "orang_pribadi")) {
    actions.push({
      id: "tax-exempt",
      text: copy.dashboard.needsTaxExempt,
      tone: "info",
      href: "/taxes",
    });
  }

  // To-Do list items (including financial statement opening balance, NIB docs, tax threshold, export)
  const todos = useMemo(() => {
    const list = [
      {
        id: "todo-last-year",
        icon: <Calendar className="size-4 text-amber-600" />,
        title: copy.dashboard.todoTasks.financialStatementLastYear.title,
        desc: copy.dashboard.todoTasks.financialStatementLastYear.desc,
        cta: copy.dashboard.todoTasks.financialStatementLastYear.cta,
        href: "/accounts",
        done: false,
        priority: "Tinggi",
      },
      {
        id: "todo-perizinan",
        icon: <ShieldCheck className="size-4 text-emerald-600" />,
        title: copy.dashboard.todoTasks.perizinanDocs.title,
        desc: copy.dashboard.todoTasks.perizinanDocs.desc,
        cta: copy.dashboard.todoTasks.perizinanDocs.cta,
        href: "/licensing",
        done: Boolean(business?.kbliCode && business?.nib),
        priority: business?.kbliCode ? "Selesai" : "Penting",
      },
      {
        id: "todo-tax-threshold",
        icon: <Landmark className="size-4 text-sky-600" />,
        title: copy.dashboard.todoTasks.taxThresholdMonitor.title,
        desc: copy.dashboard.todoTasks.taxThresholdMonitor.desc,
        cta: copy.dashboard.todoTasks.taxThresholdMonitor.cta,
        href: "/taxes",
        done: false,
        priority: "Normal",
      },
      {
        id: "todo-monthly-export",
        icon: <Printer className="size-4 text-purple-600" />,
        title: copy.dashboard.todoTasks.monthlyExportPrint.title,
        desc: copy.dashboard.todoTasks.monthlyExportPrint.desc,
        cta: copy.dashboard.todoTasks.monthlyExportPrint.cta,
        href: "/statements",
        done: false,
        priority: "Rekomendasi",
      },
    ];
    return list;
  }, [copy, business]);
  // A badan usaha can owe Rp 0 simply because turnover is zero. Saying "masih di
  // bawah batas bebas pajak" would imply a threshold that does not apply to it,
  // so no tax item is shown at all in that case.

  if (!ready) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Skeleton className="size-14 rounded-2xl" />
            <Skeleton className="mt-4 h-5 w-48" />
            <Skeleton className="mt-2 h-4 w-80 max-w-full" />
            <div className="mt-6 flex gap-2">
              <Skeleton className="h-9 w-32 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-36" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // First run: a business with an empty journal. Showing four Rp 0 cards and an
  // empty chart would read as broken, so the whole page becomes one clear step.
  if (entries.length === 0) {
    return (
      <>
        <PageHeader title={copy.dashboard.title} subtitle={copy.dashboard.subtitle} />
        <Card>
          <CardContent>
            <EmptyState
              icon={<ScanLine className="size-6" />}
              title={copy.dashboard.firstRunTitle}
              body={copy.dashboard.firstRunBody}
              actions={
                <>
                  <Button asChild>
                    <Link href="/record">
                      <ScanLine className="mr-2 size-4" />
                      {copy.dashboard.actionScan}
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={loadDemo}>
                    {copy.common.tryDemo}
                  </Button>
                </>
              }
              hint={copy.dashboard.firstRunDemoHint}
            />
          </CardContent>
        </Card>

        {/* Bentuk usaha dan perlakuan pajaknya sudah pasti sejak onboarding, jadi
            pemilik baru harus melihatnya di sini juga — bukan baru setelah ada
            transaksi. Kode KBLI memang belum ada, dan justru itu yang perlu
            terlihat sebagai langkah berikutnya. */}
        {business && <ComplianceRow business={business} />}
      </>
    );
  }

  return (
    <>
      {/* Header with Scope Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{copy.dashboard.title}</h1>
          <p className="text-sm text-muted-foreground">{copy.dashboard.subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg border bg-muted/30 p-1">
          <Button
            variant={metricScope === "this_month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMetricScope("this_month")}
            className="h-7 text-xs font-medium"
          >
            {copy.dashboard.toggleViewThisMonth}
          </Button>
          <Button
            variant={metricScope === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMetricScope("all")}
            className="h-7 text-xs font-medium"
          >
            {copy.dashboard.toggleViewAllTime}
          </Button>
        </div>
      </div>

      {/* Number Dashboard */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<ArrowUpRight className="size-4" />}
          label={copy.dashboard.revenue}
          value={idrFull(income.totalRevenue)}
          hint={metricScope === "this_month" ? copy.dashboard.thisMonthMetrics : copy.dashboard.allTimeMetrics}
          tone="positive"
        />
        <Metric
          icon={<ArrowDownRight className="size-4" />}
          label={copy.dashboard.expenses}
          value={idrFull(income.totalExpenses)}
          hint={metricScope === "this_month" ? copy.dashboard.thisMonthMetrics : copy.dashboard.allTimeMetrics}
          tone="negative"
        />
        <Metric
          icon={<Wallet className="size-4" />}
          label={copy.dashboard.netIncome}
          value={idrFull(income.netIncome)}
          hint={metricScope === "this_month" ? copy.dashboard.thisMonthMetrics : copy.dashboard.allTimeMetrics}
          tone={income.netIncome >= 0 ? "positive" : "negative"}
        />
        <Metric
          icon={<Landmark className="size-4" />}
          label={copy.dashboard.taxDue}
          value={idrFull(tax.payable)}
          hint={copy.pajak.scheme}
          tone="neutral"
        />
      </div>

      {/* Main Grid: Balanced 1:1 for Monthly Trends and Action Plan */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Trend Chart (Compact & High-Signal) */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{copy.dashboard.chartTitle}</CardTitle>
                <CardDescription className="text-xs">{copy.dashboard.chartSubtitle ?? (business?.name ?? copy.app.name)}</CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <span className="size-2 rounded-full bg-[var(--chart-1)]" />
                  {copy.dashboard.chartRevenue}
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <span className="size-2 rounded-full bg-[var(--chart-2)]" />
                  {copy.dashboard.chartExpense}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {series.length === 0 ? (
              <EmptyState
                compact
                icon={<FileBarChart className="size-5" />}
                title={copy.dashboard.emptyChart}
                body={copy.dashboard.firstRunBody}
              />
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={series} margin={{ left: 4, right: 8, top: 8, bottom: 0 }} barGap={6}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/70" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      tickFormatter={(m: string) =>
                        new Date(`${m}-01`).toLocaleDateString("id-ID", { month: "short" })
                      }
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      width={64}
                      tickFormatter={(v: number) => `${idr(v / 1_000_000)} jt`}
                    />
                    <RTooltip
                      cursor={{ fill: "var(--muted)", opacity: 0.35, rx: 6 }}
                      formatter={(value) => idrFull(Number(value))}
                      labelFormatter={(m) =>
                        new Date(`${m}-01`).toLocaleDateString("id-ID", {
                          month: "long",
                          year: "numeric",
                        })
                      }
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--popover)",
                        boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.08)",
                        fontSize: 12,
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      name={copy.dashboard.chartRevenue}
                      fill="var(--chart-1)"
                      radius={[5, 5, 0, 0]}
                      maxBarSize={32}
                    />
                    <Bar
                      dataKey="expense"
                      name={copy.dashboard.chartExpense}
                      fill="var(--chart-2)"
                      radius={[5, 5, 0, 0]}
                      maxBarSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
          <div className="px-6 pb-4 pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>{copy.dashboard.balanced}:</span>
              <span className="font-medium text-foreground">{bs.balanced ? "Seimbang" : "Periksa"}</span>
            </span>
            <Button asChild variant="ghost" size="sm" className="h-6 text-xs px-1.5">
              <Link href="/statements">
                {copy.dashboard.actionReport} <ChevronRight className="size-3 ml-0.5" />
              </Link>
            </Button>
          </div>
        </Card>

        {/* Action Plan & Priority Checklist */}
        <Card className="flex flex-col border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                <span>{copy.dashboard.todoTitle}</span>
              </CardTitle>
              <Badge variant="outline" className="text-[11px] font-normal bg-muted/40">
                {todos.filter((t) => t.done).length}/{todos.length} Selesai
              </Badge>
            </div>
            <CardDescription className="text-xs">
              {copy.dashboard.todoSubtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 flex-1">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={cn(
                  "rounded-lg border p-3 text-xs transition-colors",
                  todo.done ? "bg-muted/30 border-muted" : "bg-card hover:bg-muted/40 border-border"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">{todo.icon}</span>
                    <div>
                      <p className={cn("font-medium text-foreground", todo.done && "line-through text-muted-foreground")}>
                        {todo.title}
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        {todo.desc}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={todo.priority === "Tinggi" ? "destructive" : "secondary"}
                    className="text-[10px] shrink-0 font-normal py-0 h-5"
                  >
                    {todo.priority}
                  </Badge>
                </div>
                <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3" /> Rekomendasi Bot
                  </span>
                  <Button asChild variant="outline" size="sm" className="h-6 text-[11px] px-2 py-0">
                    <Link href={todo.href}>
                      {todo.cta}
                      <ChevronRight className="ml-1 size-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {/* Optional Alert Item if any outstanding action exists */}
            {actions.length > 0 && (
              <div className="pt-1">
                {actions.map((action) => (
                  <Link
                    key={action.id}
                    href={action.href}
                    className="flex items-start gap-2 rounded-lg border px-3 py-2 text-xs transition hover:bg-muted/50 bg-muted/20"
                  >
                    <Info
                      className={cn(
                        "mt-0.5 size-3.5 shrink-0",
                        action.tone === "warn" ? "text-amber-600" : "text-sky-600",
                      )}
                    />
                    <span>{action.text}</span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Aktivitas terakhir */}
      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">{copy.dashboard.recentActivity}</CardTitle>
            <CardDescription>{copy.transaksi.countLabel(entries.length)}</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/transactions">{copy.common.seeAll}</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <EmptyState
              compact
              icon={<ArrowUpRight className="size-5" />}
              title={copy.dashboard.emptyActivity}
              body={copy.dashboard.recentEmpty}
            />
          ) : (
            <ul className="divide-y">
              {[...entries]
                .reverse()
                .slice(0, 6)
                .map((entry) => {
                  const total = entry.lines.reduce((s, l) => s + l.debit, 0);
                  return (
                    <li key={entry.id} className="flex items-center gap-3 py-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                        <ArrowUpRight className="size-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{entry.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {" · "}
                          {entry.lines.map((l) => l.account).slice(0, 2).join(", ")}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-medium tabular-nums">
                        {idrFull(total)}
                      </span>
                    </li>
                  );
                })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Cek cepat: daftar akun terpakai */}
      <p className="mt-4 text-xs text-muted-foreground">
        {copy.dashboard.accountsActive(accounts.length)}
        {" · "}
        {idr(income.totalRevenue)} {copy.dashboard.revenue.toLowerCase()}
        {" · "}
        {idrFull(bs.totalAssets)} {copy.laporan.assets.toLowerCase()}
      </p>
    </>
  );
}

function Metric({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  tone: "positive" | "negative" | "neutral";
}) {
  const toneClass =
    tone === "positive"
      ? "text-[var(--chart-1)]"
      : tone === "negative"
        ? "text-[var(--chart-2)]"
        : "text-foreground";
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className={`${toneClass} opacity-70`}>{icon}</span>
        </div>
        <p className={`mt-2 text-2xl font-semibold tracking-tight tabular-nums ${toneClass}`}>
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}


/**
 * The three standing facts that decide what the owner owes: business form, its
 * tax treatment, and its KBLI code.
 *
 * Extracted because it must appear on both dashboard branches — the first-run
 * view as well as the populated one. Entity and tax treatment are settled at
 * onboarding, so a brand-new owner can already see them; the KBLI is usually
 * still open, which is exactly what makes it useful there.
 */
function ComplianceRow({
  business,
  className,
}: {
  business: NonNullable<ReturnType<typeof useWorkspace>["business"]>;
  className?: string;
}) {
  const { copy } = useLanguage();
  const exempt = entityHasExemption(business.entity);
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{copy.dashboard.complianceTitle}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ComplianceItem
          icon={<Building2 className="size-3.5" />}
          label={copy.dashboard.complianceEntity}
          value={copy.entityLabels?.[business.entity] ?? ENTITY_LABEL[business.entity]}
        />
        <ComplianceItem
          icon={<Landmark className="size-3.5" />}
          label={copy.dashboard.complianceTax}
          value={exempt ? copy.pajak.entityExemptTitle : copy.pajak.entityTaxedTitle}
          tone={exempt ? "ok" : "warn"}
        />
        <ComplianceItem
          icon={<Compass className="size-3.5" />}
          label={copy.dashboard.complianceKbli}
          value={
            business.kbliCode
              ? `${business.kbliCode} · ${business.kbliTitle ?? ""}`
              : copy.dashboard.complianceKbliNone
          }
          href="/licensing"
          cta={
            business.kbliCode
              ? copy.dashboard.complianceOpen
              : copy.dashboard.complianceKbliCta
          }
          tone={business.kbliCode ? "ok" : "warn"}
        />
        <ComplianceItem
          icon={<ShieldCheck className="size-3.5" />}
          label={copy.dashboard.complianceNib}
          value={business.nib ? `${business.nib} (OSS RBA)` : copy.dashboard.complianceNibMissing}
          href="/business"
          cta={business.nib ? copy.dashboard.complianceNibReady : copy.dashboard.complianceNibCta}
          tone={business.nib ? "ok" : "warn"}
        />
      </CardContent>
    </Card>
  );
}

/**
 * One compliance fact about the business (entity, tax treatment, KBLI).
 *
 * These are durable facts, not figures for the period, so they are presented as
 * a quiet status row rather than as a metric card — and the KBLI item links
 * straight to the screen that can determine it.
 */
function ComplianceItem({
  icon,
  label,
  value,
  tone = "neutral",
  href,
  cta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "ok" | "warn" | "neutral";
  href?: string;
  cta?: string;
}) {
  const toneClass =
    tone === "ok"
      ? "text-tone-hijau"
      : tone === "warn"
        ? "text-tone-oranye"
        : "text-muted-foreground";

  const body = (
    <>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="mt-1 block truncate text-sm font-medium" title={value}>
        {value}
      </span>
      {href && cta && (
        <span
          className={cn(
            "mt-1 inline-flex items-center gap-0.5 text-[11px] font-medium",
            toneClass,
          )}
        >
          {cta}
          <ChevronRight className="size-3" />
        </span>
      )}
    </>
  );

  return href ? (
    <Link
      href={href}
      className="min-w-0 rounded-lg border bg-card p-3 transition hover:bg-muted/40"
    >
      {body}
    </Link>
  ) : (
    <div className="min-w-0 rounded-lg border bg-card p-3">{body}</div>
  );
}
