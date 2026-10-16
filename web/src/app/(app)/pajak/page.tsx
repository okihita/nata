"use client";

import { Landmark, Info, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLedger } from "@/lib/store";
import { taxPosition } from "@/lib/ledger";
import { PPH_FINAL_RATE, PPH_INDIVIDUAL_EXEMPTION } from "@/lib/sak-emkm";
import { copy } from "@/lib/copy";
import { idr, idrFull } from "@/lib/format";

export default function PajakPage() {
  const { entries, ready } = useLedger();

  if (!ready) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Prototype assumes an individual taxpayer, so the Rp 500 juta exemption applies.
  const tax = taxPosition(entries, { individual: true });
  const exemptPercent = Math.min(100, Math.round((tax.exemptApplied / PPH_INDIVIDUAL_EXEMPTION) * 100));
  const remaining = Math.max(0, PPH_INDIVIDUAL_EXEMPTION - tax.turnover);

  return (
    <>
      <PageHeader title={copy.pajak.title} subtitle={copy.pajak.subtitle}>
        <Badge variant="secondary">{copy.pajak.scheme}</Badge>
      </PageHeader>

      {tax.payable === 0 && (
        <Alert className="mb-6 border-emerald-500/30 bg-emerald-500/5">
          <ShieldCheck className="size-4 text-emerald-600" />
          <AlertDescription className="text-sm text-emerald-800">
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
          {/* Pemakaian kuota bebas pajak — membuat hasil Rp 0 tetap informatif. */}
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

          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardHeader>
              <CardTitle className="text-base">{copy.pajak.scheme}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{copy.pajak.note}</p>
              <p className="text-xs">
                Batas pembebasan: {idrFull(PPH_INDIVIDUAL_EXEMPTION)} · Tarif: 0,5%
              </p>
            </CardContent>
          </Card>

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
