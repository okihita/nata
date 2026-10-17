"use client";

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
  Sparkles,
  Wallet,
  Info,
} from "lucide-react";
import {
  Area,
  AreaChart,
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
import { copy } from "@/lib/copy";
import { idr, idrFull } from "@/lib/format";

export default function DashboardPage() {
  const { entries, ready, business, loadDemo } = useWorkspace();
  const income = incomeStatement(entries);
  const bs = balanceSheet(entries);
  const series = monthlyRevenue(entries);
  const accounts = trialBalance(entries);
  const tax = taxPosition(entries, { individual: entityHasExemption(business?.entity ?? "orang_pribadi") });

  // "Perlu tindakan": plain-language items the owner should look at. This is
  // the panel the incumbents do worst — an empty state here says the books are
  // clean rather than showing a blank table.
  const unpaid = bs.liabilities.filter((l) => l.account.toLowerCase().includes("utang usaha"));
  const unpaidTotal = unpaid.reduce((s, l) => s + l.amount, 0);
  const actions: { id: string; text: string; tone: "info" | "warn"; href: string }[] = [];
  if (unpaid.length > 0 && unpaidTotal > 0) {
    actions.push({
      id: "unpaid",
      text: copy.dashboard.needsUnpaid(unpaid.length, idrFull(unpaidTotal)),
      tone: "warn",
      href: "/laporan",
    });
  }
  if (tax.payable > 0) {
    actions.push({
      id: "tax",
      text: copy.dashboard.needsTaxDue(idrFull(tax.payable)),
      tone: "warn",
      href: "/pajak",
    });
  } else if (entityHasExemption(business?.entity ?? "orang_pribadi")) {
    actions.push({
      id: "tax-exempt",
      text: copy.dashboard.needsTaxExempt,
      tone: "info",
      href: "/pajak",
    });
  }
  // A badan usaha can owe Rp 0 simply because turnover is zero. Saying "masih di
  // bawah batas bebas pajak" would imply a threshold that does not apply to it,
  // so no tax item is shown at all in that case.

  if (!ready) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-72" />
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
                    <Link href="/catat">
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
      <PageHeader title={copy.dashboard.title} subtitle={copy.dashboard.subtitle} />

      {/* Kartu ringkasan */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<ArrowUpRight className="size-4" />}
          label={copy.dashboard.revenue}
          value={idrFull(income.totalRevenue)}
          hint={copy.dashboard.allTime}
          tone="positive"
        />
        <Metric
          icon={<ArrowDownRight className="size-4" />}
          label={copy.dashboard.expenses}
          value={idrFull(income.totalExpenses)}
          hint={copy.dashboard.allTime}
          tone="negative"
        />
        <Metric
          icon={<Wallet className="size-4" />}
          label={copy.dashboard.netIncome}
          value={idrFull(income.netIncome)}
          hint={copy.dashboard.allTime}
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

      {/* Status usaha: tiga hal yang menentukan kewajiban pemilik — bentuk
          usaha, perlakuan pajaknya, dan kode KBLI-nya. Ditampilkan di sini
          karena inilah layar pertama yang dibuka pemilik. */}
      {business && <ComplianceRow business={business} className="mt-4" />}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Grafik */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{copy.dashboard.chartTitle}</CardTitle>
            <CardDescription>{business?.name ?? copy.app.name}</CardDescription>
          </CardHeader>
          <CardContent>
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
                <AreaChart data={series} margin={{ left: 4, right: 8, top: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
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
                    formatter={(value) => idrFull(Number(value))}
                    labelFormatter={(m) =>
                      new Date(`${m}-01`).toLocaleDateString("id-ID", {
                        month: "long",
                        year: "numeric",
                      })
                    }
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name={copy.dashboard.chartRevenue}
                    stroke="var(--chart-1)"
                    fill="url(#rev)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name={copy.dashboard.chartExpense}
                    stroke="var(--chart-2)"
                    fill="url(#exp)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            )}
          </CardContent>
        </Card>

        {/* Aksi cepat + agentik */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{copy.dashboard.quickActions}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuickAction
                href="/catat"
                icon={<ScanLine className="size-4" />}
                label={copy.dashboard.actionScan}
                hint={copy.dashboard.actionScanHint}
                primary
              />
              <QuickAction
                href="/laporan"
                icon={<FileBarChart className="size-4" />}
                label={copy.dashboard.actionReport}
                hint={copy.dashboard.actionReportHint}
              />
              <QuickAction
                href="/pajak"
                icon={<Landmark className="size-4" />}
                label={copy.dashboard.actionTax}
                hint={copy.dashboard.actionTaxHint}
              />
            </CardContent>
          </Card>

          {/* Perlu tindakan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{copy.dashboard.needsAction}</CardTitle>
            </CardHeader>
            <CardContent>
              {actions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {copy.dashboard.needsActionEmpty}
                </p>
              ) : (
                <ul className="space-y-2">
                  {actions.map((action) => (
                    <li key={action.id}>
                      <Link
                        href={action.href}
                        className="flex items-start gap-2 rounded-lg border px-3 py-2 text-sm transition hover:bg-muted/50"
                      >
                        <Info
                          className={cn(
                            "mt-0.5 size-3.5 shrink-0",
                            action.tone === "warn" ? "text-amber-600" : "text-sky-600",
                          )}
                        />
                        <span>{action.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-primary" />
                {copy.dashboard.agentTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{copy.dashboard.agentBody}</p>
              <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-xs">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span className="font-medium">{copy.dashboard.balanced}</span>
                <span className="text-muted-foreground">· {copy.dashboard.balancedHint}</span>
                {bs.balanced ? (
                  <Badge className="ml-auto bg-emerald-600 text-white hover:bg-emerald-600">✓</Badge>
                ) : (
                  <Badge variant="destructive" className="ml-auto">
                    ✕
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Aktivitas terakhir */}
      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">{copy.dashboard.recentActivity}</CardTitle>
            <CardDescription>{copy.transaksi.countLabel(entries.length)}</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/transaksi">{copy.common.seeAll}</Link>
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
      ? "text-emerald-600"
      : tone === "negative"
        ? "text-rose-600"
        : "text-foreground";
  return (
    <Card>
      <CardContent className="pt-6">
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

function QuickAction({
  href,
  icon,
  label,
  hint,
  primary,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  hint: string;
  primary?: boolean;
}) {
  return (
    <Button
      asChild
      variant={primary ? "default" : "outline"}
      className="h-auto w-full justify-start gap-3 py-2.5"
    >
      <Link href={href}>
        {icon}
        <div className="grid text-left">
          <span className="text-sm font-medium">{label}</span>
          <span
            className={`text-[11px] font-normal ${primary ? "text-primary-foreground/70" : "text-muted-foreground"}`}
          >
            {hint}
          </span>
        </div>
      </Link>
    </Button>
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
  const exempt = entityHasExemption(business.entity);
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{copy.dashboard.complianceTitle}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <ComplianceItem
          icon={<Building2 className="size-3.5" />}
          label={copy.dashboard.complianceEntity}
          value={ENTITY_LABEL[business.entity]}
        />
        <ComplianceItem
          icon={<Landmark className="size-3.5" />}
          label={copy.dashboard.complianceTax}
          value={exempt ? copy.pajak.entityExemptTitle : copy.pajak.entityTaxedTitle}
          tone={exempt ? "ok" : "warn"}
        />
        <ComplianceItem
          icon={<ShieldCheck className="size-3.5" />}
          label={copy.dashboard.complianceKbli}
          value={
            business.kbliCode
              ? `${business.kbliCode} · ${business.kbliTitle ?? ""}`
              : copy.dashboard.complianceKbliNone
          }
          href="/perizinan"
          cta={
            business.kbliCode
              ? copy.dashboard.complianceOpen
              : copy.dashboard.complianceKbliCta
          }
          tone={business.kbliCode ? "ok" : "warn"}
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
