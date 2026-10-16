"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Landmark, Info, ShieldCheck, Sparkles, Loader2, Building2 } from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
import { CitationList } from "@/components/citation-list";
import { Prose } from "@/components/prose";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWorkspace } from "@/lib/store";
import { ENTITY_LABEL, entityHasExemption } from "@/lib/business";
import { taxPosition } from "@/lib/ledger";
import { PPH_FINAL_RATE, PPH_INDIVIDUAL_EXEMPTION } from "@/lib/sak-emkm";
import type { TaxAssessment } from "@/lib/adk";
import { cacheTax, getServerTaxSnapshot, getTaxSnapshot, primeTaxStore, readCachedTax, runFiskal, subscribeTax } from "@/lib/agent-tax";
import { copy } from "@/lib/copy";
import { idrFull } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Pajak — the tax screen.
 *
 * The deterministic breakdown is derived from the ledger on read. On top of it,
 * Agent Fiskal is invoked: it calls the same engine and returns every figure
 * with its verbatim Pasal/Ayat citation. The agent's assessment is cached so the
 * screen shows it instantly after a receipt has been recorded.
 */
export default function PajakPage() {
  const { entries, ready, business } = useWorkspace();

  // The entity type chosen at onboarding decides whether the Rp 500 juta
  // exemption applies (Pasal 60 ayat (2)): orang pribadi gets it, PT Perorangan
  // and PT/CV do not.
  const individual = entityHasExemption(business?.entity ?? "orang_pribadi");
  const tax = useMemo(
    () => taxPosition(entries, { individual }),
    [entries, individual],
  );

  const [answer, setAnswer] = useState("");
  const [running, setRunning] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // The cached assessment lives in an external store so this screen does not
  // sync React state inside an effect.
  const cached = useSyncExternalStore(subscribeTax, getTaxSnapshot, getServerTaxSnapshot);

  useEffect(() => {
    primeTaxStore();
  }, []);

  const matchesLedger = (t: TaxAssessment | null) =>
    t != null && Math.round(t.turnover) === Math.round(tax.turnover);

  // Show an assessment only while its turnover still matches the ledger.
  const agentTax = matchesLedger(cached) ? cached : null;
  const stale = cached != null && !matchesLedger(cached);

  const runAgent = useCallback(async () => {
    setRunning(true);
    setError(null);
    try {
      const result = await runFiskal({ turnover: tax.turnover, individual });
      // cacheTax updates the external store, which re-renders this screen.
      if (result.tax) cacheTax(result.tax);
      setAnswer(result.answer);
      setLatency(result.latencyMs);
    } catch {
      setError(copy.banner.offline);
    } finally {
      setRunning(false);
    }
  }, [tax.turnover, individual]);

  // Auto-run exactly once per turnover: the moment the books change, Agent
  // Fiskal assesses them (the cascade, seen from the tax screen). The persisted
  // cache and a ref guard keep a fresh assessment from re-running, and a
  // failed/empty run from looping.
  const attempted = useRef<number | null>(null);
  useEffect(() => {
    if (!ready || running) return;
    if (readCachedTax(tax.turnover)) return;
    if (attempted.current === tax.turnover) return;
    attempted.current = tax.turnover;
    void runAgent();
  }, [ready, running, tax.turnover, runAgent]);

  if (!ready) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const exemptPercent = Math.min(
    100,
    Math.round((tax.exemptApplied / PPH_INDIVIDUAL_EXEMPTION) * 100),
  );
  const remaining = Math.max(0, PPH_INDIVIDUAL_EXEMPTION - tax.turnover);

  return (
    <>
      <PageHeader title={copy.pajak.title} subtitle={copy.pajak.subtitle}>
        <Badge variant="secondary">{copy.pajak.scheme}</Badge>
      </PageHeader>

      {/* Kenapa pajaknya seperti ini: bentuk usaha menentukan pembebasan. */}
      {business && (
        <Card
          className={cn(
            "mb-6",
            individual
              ? "border-tone-hijau/30 bg-tone-hijau-bg/40"
              : "border-tone-oranye/30 bg-tone-oranye-bg/40",
          )}
        >
          <CardContent className="flex flex-wrap items-start gap-3 pt-6">
            <span
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-lg",
                individual
                  ? "bg-tone-hijau-bg text-tone-hijau"
                  : "bg-tone-oranye-bg text-tone-oranye",
              )}
            >
              {individual ? (
                <ShieldCheck className="size-4" />
              ) : (
                <Building2 className="size-4" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                {individual ? copy.pajak.entityExemptTitle : copy.pajak.entityTaxedTitle}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {individual ? copy.pajak.entityExemptBody : copy.pajak.entityTaxedBody}
              </p>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {ENTITY_LABEL[business.entity]} · {copy.pajak.entityChangeHint}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {tax.payable === 0 && (
        <Alert className="mb-6 border-tone-hijau/30 bg-tone-hijau-bg/40">
          <ShieldCheck className="size-4 text-tone-hijau" />
          <AlertDescription className="text-sm text-tone-hijau">
            {copy.pajak.exemptBanner}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Landmark className="size-4 text-muted-foreground" />
              {copy.pajak.breakdown}
            </CardTitle>
            <CardDescription>
              {copy.pajak.scheme} · {copy.pajak.basedOn(tax.months)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Line label={copy.pajak.turnoverLabel} value={idrFull(tax.turnover)} />
            <Line
              label={copy.pajak.exemptionLabel}
              value={exemptOrDash(tax.exemptApplied)}
              muted={tax.exemptApplied === 0}
            />
            <Line label={copy.pajak.baseLabel} value={idrFull(tax.taxableBase)} />
            <Line
              label={copy.pajak.rateLabel}
              value={`${(PPH_FINAL_RATE * 100).toLocaleString("id-ID", { minimumFractionDigits: 1 })}%`}
            />
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium">{copy.pajak.payableLabel}</span>
              <span className="text-2xl font-semibold tabular-nums text-foreground">
                {idrFull(tax.payable)}
              </span>
            </div>
            {tax.payable > 0 && (
              <p className="text-xs text-muted-foreground">
                {copy.pajak.monthlyLabel}:{" "}
                <span className="font-medium">{idrFull(tax.monthlyEstimate)}</span>
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Agent Fiskal — the engine behind the figures, with its Pasal evidence. */}
          <Card className="border-teal-500/20 bg-teal-500/[0.03]">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Landmark className="size-4 text-teal-600" />
                    {copy.pajak.agentTitle}
                  </CardTitle>
                  <CardDescription>
                    {agentTax
                      ? copy.pajak.handoffFrom(copy.agents.keuangan, copy.agents.fiskal)
                      : copy.pajak.agentNote}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {agentTax ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Metric label={copy.pajak.turnoverLabel} value={idrFull(agentTax.turnover)} />
                    <Metric label={copy.pajak.payableLabel} value={idrFull(agentTax.payable)} strong />
                    <Metric
                      label={copy.pajak.exemptionLabel}
                      value={idrFull(agentTax.exemption_applied)}
                    />
                    <Metric label={copy.pajak.rateLabel} value={agentTax.rate_percent} />
                  </div>

                  {answer && (
                    <Prose
                      text={answer}
                      className="max-h-64 overflow-y-auto rounded-lg border bg-background/60 p-3 text-xs text-muted-foreground"
                    />
                  )}

                  <CitationList citations={agentTax.citations} showQuotes />

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={runAgent} disabled={running}>
                      {running ? <Loader2 className="animate-spin" /> : <Sparkles />}
                      {running ? copy.pajak.agentRunning : copy.pajak.agentRerun}                    </Button>
                  </div>
                  {latency != null && (
                    <p className="text-[0.7rem] text-muted-foreground">
                      {copy.pajak.agentDone((latency / 1000).toFixed(1))}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">{copy.pajak.noAgentYet}</p>
                  <Button className="w-full" onClick={runAgent} disabled={running}>
                    {running ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    {running ? copy.pajak.agentRunning : copy.pajak.agentRun}
                  </Button>
                  {latency != null && !running && (
                    <p className="text-[0.7rem] text-muted-foreground">
                      {copy.pajak.agentDone((latency / 1000).toFixed(1))}
                    </p>
                  )}
                </>
              )}

              {stale && (
                <Alert>
                  <Info className="size-4" />
                  <AlertDescription className="text-xs">
                    {copy.pajak.turnoverLabel}: pembukuan sudah berubah sejak perhitungan terakhir —{" "}
                    <button className="underline" onClick={runAgent}>
                      {copy.pajak.agentRerun}
                    </button>
                    .
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Pemakaian kuota bebas pajak — hanya relevan untuk orang pribadi.
              Badan usaha tidak punya kuota ini, jadi menampilkan meter yang
              membandingkan omzet dengan Rp 500 juta akan menyesatkan: seolah
              ada batas yang sebenarnya tidak berlaku baginya. */}
          {individual ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{copy.pajak.exemptionUsage}</CardTitle>
                <CardDescription>{copy.pajak.exemptNote}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={exemptPercent} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{idrFull(tax.turnover)}</span>
                  <span>{idrFull(PPH_INDIVIDUAL_EXEMPTION)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {remaining > 0
                    ? copy.pajak.exemptionRemaining(idrFull(remaining))
                    : copy.pajak.exemptionUsed(`${exemptPercent}%`)}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{copy.pajak.noQuotaTitle}</CardTitle>
                <CardDescription>{copy.pajak.noQuotaBody}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {copy.pajak.noQuotaCitation}
                </p>
              </CardContent>
            </Card>
          )}

          <Alert>
            <Info className="size-4" />
            <AlertDescription className="text-xs">{copy.pajak.estimateOnly}</AlertDescription>
          </Alert>
        </div>
      </div>
    </>
  );
}

function exemptOrDash(value: number): string {
  return value > 0 ? idrFull(value) : "—";
}

function Line({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm tabular-nums ${muted ? "text-muted-foreground" : "font-medium"}`}>
        {value}
      </span>
    </div>
  );
}

function Metric({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-lg border bg-background/60 p-3">
      <p className="text-[0.7rem] text-muted-foreground">{label}</p>
      <p className={`tabular-nums ${strong ? "text-base font-semibold" : "text-sm font-medium"}`}>
        {value}
      </p>
    </div>
  );
}
