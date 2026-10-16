"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Landmark, ArrowRight, RotateCcw, Sparkles, Upload } from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { APP_NAME, ensureSession, streamRun, type AdkEvent, type RunRequest } from "@/lib/adk";
import { emptyRun, readingStep, reduceEvent, type RunState } from "@/lib/trace";
import { CitationList } from "@/components/citation-list";
import { copy } from "@/lib/copy";
import { useWorkspace } from "@/lib/store";
import { idrFull } from "@/lib/format";

const USER_ID = "web-console";
const SESSION_KEY = "***";

export default function CatatPage() {
  const router = useRouter();
  const { addEntry, business } = useWorkspace();

  const [run, setRun] = useState<RunState>(emptyRun);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const sessionRef = useRef<string | null>(null);
  const startedAt = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const clearPreview = useCallback(() => {
    setPreview((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return null;
    });
  }, []);

  const pick = useCallback(
    (next: File, url: string, name: string) => {
      clearPreview();
      setFile(next);
      setPreview(url);
      setFileName(name);
      setRun(emptyRun);
      setBanner(null);
    },
    [clearPreview],
  );

  const reset = useCallback(() => {
    clearPreview();
    setFile(null);
    setFileName(null);
    setRun(emptyRun);
    setBanner(null);
  }, [clearPreview]);

  const submit = useCallback(async () => {
    if (!file || busy) return;
    setBusy(true);
    setBanner(null);
    setRun({ ...emptyRun, status: "working", steps: [readingStep()] });
    startedAt.current = performance.now();

    let latest: RunState = { ...emptyRun, status: "working", steps: [readingStep()] };

    try {
      const sessionId = await ensureSession(
        USER_ID,
        sessionRef.current ?? localStorage.getItem(SESSION_KEY),
      );
      sessionRef.current = sessionId;
      localStorage.setItem(SESSION_KEY, sessionId);

      const base64 = await toBase64(file);
      const payload: RunRequest = {
        appName: APP_NAME,
        userId: USER_ID,
        sessionId,
        streaming: true,
        newMessage: {
          role: "user",
          parts: [
            {
              // The KBLI classification must describe the *business*, not the
              // receipt. Without this, a stationery purchase at a coffee shop
              // was classified as a stationery retailer (47611) rather than a
              // cafe (56303) — the agent can only see what it is told.
              text:
                `Here is a receipt photo. Post it to the ledger.` +
                (business
                  ? ` This business is "${business.name}", a ${business.type} ` +
                    `(entity: ${business.entity}). Use THAT as the business's ` +
                    `activity when classifying its KBLI code — the receipt is ` +
                    `only one purchase it made, not what the business does.`
                  : ""),
            },
            { inlineData: { mimeType: file.type || "image/png", data: base64 } } as never,
          ],
        },
      };

      await streamRun(payload, (event: AdkEvent) => {
        latest = reduceEvent(latest, event);
        setRun(latest);
      });

      const finished: RunState = {
        ...latest,
        status: "done",
        latencyMs: Math.round(performance.now() - startedAt.current),
      };
      setRun(finished);

      // A committed posting becomes a real journal entry in the ledger.
      if (finished.commit?.status === "success") {
        const lines = finished.commit.lines.map((l) => ({
          account: l.account,
          debit: l.debit,
          credit: l.credit,
        }));
        addEntry({
          date: new Date().toISOString().slice(0, 10),
          description: finished.commit.description,
          lines,
          source: "ocr",
          receiptName: fileName ?? undefined,
        });
        toast.success(copy.add.submitted, { description: finished.commit.description });
      }
    } catch {
      setBanner(copy.banner.offline);
      setRun((current) => ({ ...current, status: "error" }));
    } finally {
      setBusy(false);
    }
  }, [addEntry, busy, file, fileName, business]);

  const accepted = run.commit?.status === "success";
  const rejected = run.commit?.status === "error";
  const lines = run.commit?.status === "success" ? run.commit.lines : run.proposed;
  const canSubmit = Boolean(file) && !busy;

  return (
    <>
      <PageHeader title={copy.add.title} subtitle={copy.add.subtitle} />

      {banner && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>{copy.banner.title}</AlertTitle>
          <AlertDescription>{banner}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        {/* Masukan struk */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">{copy.add.dropTitle}</CardTitle>
            <CardDescription>{copy.add.dropHint}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              role="button"
              tabIndex={0}
              aria-label={copy.add.dropTitle}
              onClick={() => !busy && inputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && !busy && inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                if (!busy) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (busy) return;
                const dropped = e.dataTransfer.files?.[0];
                if (dropped?.type.startsWith("image/")) {
                  pick(dropped, URL.createObjectURL(dropped), dropped.name);
                }
              }}
              className={cn(
                "flex min-h-[15rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-4 text-center transition",
                dragging
                  ? "border-primary bg-accent"
                  : "border-border hover:border-primary/50 hover:bg-muted/50",
                busy && "pointer-events-none opacity-60",
              )}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt={fileName ?? copy.add.dropTitle}
                  className="max-h-[20rem] w-full rounded-lg object-contain"
                />
              ) : (
                <>
                  <div className="grid size-11 place-items-center rounded-full bg-muted">
                    <Upload className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{copy.add.dropTitle}</p>
                    <p className="text-xs text-muted-foreground">{copy.add.dropHint}</p>
                  </div>
                </>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const chosen = e.target.files?.[0];
                if (chosen) pick(chosen, URL.createObjectURL(chosen), chosen.name);
                e.target.value = "";
              }}
            />

            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3.5" />
                {copy.add.examplesLabel}
              </p>
              <div className="grid gap-2">
                {copy.add.samples.map((sample) => (
                  <button
                    key={sample.id}
                    disabled={busy}
                    onClick={async () => {
                      const src = `/samples/${sample.id}.png`;
                      const res = await fetch(src);
                      const blob = await res.blob();
                      pick(
                        new File([blob], `${sample.id}.png`, { type: "image/png" }),
                        src,
                        `${sample.id}.png`,
                      );
                    }}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-sm transition hover:border-primary/50 hover:bg-muted/50 disabled:opacity-50"
                  >
                    <span className="font-medium">{sample.label}</span>
                    <span className="text-xs text-muted-foreground">{sample.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button className="flex-1" onClick={submit} disabled={!canSubmit}>
                {busy ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {busy ? copy.add.working : copy.add.submit}
              </Button>
              <Button variant="outline" size="icon" onClick={reset} aria-label={copy.common.reset}>
                <RotateCcw />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <ActivityCard run={run} />
          <ResultCard
            run={run}
            lines={lines}
            accepted={accepted}
            rejected={rejected}
            onViewAll={() => router.push("/transaksi")}
          />
          {run.tax && <TaxCard run={run} onViewTax={() => router.push("/pajak")} />}
        </div>
      </div>
    </>
  );
}

function ActivityCard({ run }: { run: RunState }) {
  const description =
    run.status === "working"
      ? copy.activity.working
      : run.status === "idle"
        ? copy.activity.idle
        : run.latencyMs != null
          ? copy.activity.finished((run.latencyMs / 1000).toFixed(1))
          : copy.activity.idle;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{copy.activity.title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {run.steps.map((step) => (
            <li key={step.id} className="flex gap-3">
              <span className="mt-1.5 flex size-4 shrink-0 items-center justify-center">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    STEP_TONE[step.kind] ?? "bg-muted-foreground",
                  )}
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{step.title}</p>
                {step.detail && <p className="text-sm text-muted-foreground">{step.detail}</p>}
              </div>
            </li>
          ))}
          {run.status === "working" && (
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              {copy.activity.stillWorking}
            </li>
          )}
          {run.status === "idle" && (
            <li className="text-sm text-muted-foreground">{copy.activity.empty}</li>
          )}
        </ol>
      </CardContent>
    </Card>
  );
}

const STEP_TONE: Record<string, string> = {
  reading: "bg-blue-500",
  matching: "bg-violet-500",
  checking: "bg-amber-500",
  posted: "bg-emerald-500",
  handoff: "bg-sky-500",
  tax: "bg-teal-500",
  regulasi: "bg-indigo-500",
  problem: "bg-rose-500",
};

function ResultCard({
  run,
  lines,
  accepted,
  rejected,
  onViewAll,
}: {
  run: RunState;
  lines: { account: string; debit: number; credit: number }[] | null;
  accepted: boolean;
  rejected: boolean;
  onViewAll: () => void;
}) {
  const debit = lines?.reduce((s, l) => s + (l.debit || 0), 0) ?? 0;
  const credit = lines?.reduce((s, l) => s + (l.credit || 0), 0) ?? 0;

  const description = accepted
    ? copy.books.recordedDescription
    : rejected
      ? copy.books.rejectedDescription
      : lines
        ? copy.books.pendingDescription
        : copy.books.emptyDescription;

  return (
    <Card className={cn(rejected && "border-destructive/40")}>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">{copy.books.title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {accepted ? (
            <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
              {copy.status.recorded}
            </Badge>
          ) : rejected ? (
            <Badge variant="destructive">{copy.status.notRecorded}</Badge>
          ) : run.status === "working" ? (
            <Badge variant="secondary">{copy.status.working}</Badge>
          ) : (
            <Badge variant="outline">{copy.status.waiting}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!lines ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {copy.books.empty}
          </p>
        ) : (
          <>
            {run.commit?.status === "success" && (
              <p className="text-sm font-medium">{run.commit.description}</p>
            )}
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
                  {lines.map((line, i) => (
                    <tr key={`${line.account}-${i}`} className="border-t">
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
                <tfoot className="bg-muted/30 font-medium">
                  <tr className="border-t">
                    <td className="px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground">
                      {copy.common.total}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{idrFull(debit)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{idrFull(credit)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {accepted ? (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700">
                <CheckCircle2 className="size-4 shrink-0" />
                {copy.balance.ok}
              </div>
            ) : rejected ? (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                <span className="text-base leading-none">✕</span>
                {copy.balance.bad}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                {copy.balance.checking}
              </div>
            )}

            {accepted && (
              <Button variant="outline" size="sm" className="w-full" onClick={onViewAll}>
                {copy.transaksi.title}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

/** Agent Fiskal's grounded assessment, shown right after a receipt is posted. */
function TaxCard({ run, onViewTax }: { run: RunState; onViewTax: () => void }) {
  const tax = run.tax;
  if (!tax) return null;

  return (
    <Card className="border-teal-500/20 bg-teal-500/[0.03]">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Landmark className="size-4 text-teal-600" />
              {copy.pajak.agentTitle}
            </CardTitle>
            <CardDescription>
              {run.handoff
                ? copy.pajak.handoffFrom(copy.agents.keuangan, copy.agents.fiskal)
                : copy.pajak.officialCalc}
            </CardDescription>
          </div>
          <Badge className="bg-teal-600 text-white hover:bg-teal-600">{copy.pajak.scheme}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label={copy.pajak.turnoverLabel} value={idrFull(tax.turnover)} />
          <Metric label={copy.pajak.exemptionLabel} value={idrFull(tax.exemption_applied)} />
          <Metric label={copy.pajak.rateLabel} value={tax.rate_percent} />
          <Metric label={copy.pajak.payableLabel} value={idrFull(tax.payable)} strong />
        </div>

        {run.taxAnswer && (
          <div className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-lg border bg-background/60 p-3 text-xs leading-relaxed text-muted-foreground">
            {run.taxAnswer}
          </div>
        )}

        <CitationList citations={tax.citations} />

        <Button variant="outline" size="sm" className="w-full" onClick={onViewTax}>
          {copy.nav.pajak}
          <ArrowRight />
        </Button>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-lg border bg-background/60 p-3">
      <p className="text-[0.7rem] text-muted-foreground">{label}</p>
      <p className={cn("tabular-nums", strong ? "text-base font-semibold" : "text-sm font-medium")}>
        {value}
      </p>
    </div>
  );
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
