"use client";

/**
 * Perizinan — klasifikasi KBLI 2020, dijalankan oleh Agent Regulasi.
 *
 * Layar ini mengikuti pola yang sama dengan Pajak: angka dan kode **tidak**
 * dihitung di sini. Kita mengirim deskripsi kegiatan usaha ke Agent Regulasi,
 * agen itu memanggil `classify_kbli`, dan kita menampilkan hasil tool apa
 * adanya — termasuk judul resmi yang dikutip verbatim dari katalog.
 *
 * Satu hal yang sengaja **tidak** ditampilkan: tingkat risiko. Katalog KBLI
 * tidak memuatnya, jadi layar ini menyatakan terus terang bahwa tingkat risiko
 * dan syarat izin perlu dicek di OSS-RBA. Menandai yang belum diketahui lebih
 * baik daripada menampilkan tebakan sebagai fakta.
 */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  Landmark,
  Loader2,
  ScanSearch,
  Sparkles,
} from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
import { EmptyState } from "@/components/empty-state";
import { Prose } from "@/components/prose";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWorkspace } from "@/lib/store";
import { ENTITY_LABEL, TYPE_LABEL } from "@/lib/business";
import {
  cacheRegulasi,
  clearRegulasi,
  getRegulasiSnapshot,
  getServerRegulasiSnapshot,
  primeRegulasiStore,
  runRegulasi,
  subscribeRegulasi,
} from "@/lib/agent-regulasi";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

export default function PerizinanPage() {
  const { business, ready, updateBusiness } = useWorkspace();
  const cached = useSyncExternalStore(
    subscribeRegulasi,
    getRegulasiSnapshot,
    getServerRegulasiSnapshot,
  );

  const [answer, setAnswer] = useState("");
  const [running, setRunning] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  // Seed the description from what the owner already told us, so the common
  // case needs no typing at all.
  useEffect(() => {
    if (!business) return;
    setDescription((current) => current || defaultDescription(business.type));
  }, [business]);

  useEffect(() => {
    primeRegulasiStore();
  }, []);

  const run = useCallback(async () => {
    setRunning(true);
    setError(null);
    try {
      const result = await runRegulasi({
        description: description.trim(),
        entity: business ? ENTITY_LABEL[business.entity] : undefined,
      });
      if (result.verdict) {
        cacheRegulasi(result);
        // Simpan kode terverifikasi ke profil usaha: ini atribut tetap usaha,
        // bukan hasil sesaat, jadi tidak boleh hilang saat cache dibersihkan.
        updateBusiness({
          kbliCode: result.verdict.code,
          kbliTitle: result.verdict.title,
        });
      }
      setAnswer(result.answer);
      setLatency(result.latencyMs);
    } catch {
      setError(copy.banner.offline);
    } finally {
      setRunning(false);
    }
  }, [description, business, updateBusiness]);

  if (!ready) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  const verdict = cached?.verdict ?? null;
  const candidates = cached?.candidates ?? [];

  // A KBLI verified anywhere in the app is saved on the business profile, and
  // BOTH paths write it — the cascade and this screen's own run. So the profile
  // is always at least as fresh as this screen's cache, and it wins when they
  // disagree. (Preferring the cache showed a stale code here after the receipt
  // cascade had verified a different one.)
  const saved = business?.kbliCode
    ? { code: business.kbliCode, title: business.kbliTitle ?? "" }
    : null;
  const shownCode = saved?.code ?? verdict?.code ?? null;
  const shownTitle = saved?.title ?? verdict?.title ?? null;
  const fromProfile = saved != null && saved.code !== verdict?.code;

  return (
    <>
      <PageHeader title={copy.perizinan.title} subtitle={copy.perizinan.subtitle}>
        {shownCode && (
          <Button
            variant="outline"
            onClick={() => {
              clearRegulasi();
              setAnswer("");
              setLatency(null);
            }}
          >
            {copy.perizinan.reset}
          </Button>
        )}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* ── Kiri: apa yang usaha Anda lakukan ──────────────────────────── */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ScanSearch className="size-4 text-primary" />
                {copy.perizinan.describeTitle}
              </CardTitle>
              <CardDescription>{copy.perizinan.describeHint}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={copy.perizinan.describePlaceholder}
                rows={3}
                aria-label={copy.perizinan.describeTitle}
              />

              {business && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="size-3.5" />
                  <span>
                    {business.name} · {TYPE_LABEL[business.type]} ·{" "}
                    {ENTITY_LABEL[business.entity]}
                  </span>
                </div>
              )}

              <Button
                onClick={run}
                disabled={running || description.trim().length === 0}
                className="w-full sm:w-auto"
              >
                {running ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {copy.perizinan.running}
                  </>
                ) : verdict ? (
                  copy.perizinan.rerun
                ) : (
                  copy.perizinan.run
                )}
              </Button>

              {latency != null && !running && (
                <p className="text-xs text-muted-foreground">
                  {copy.perizinan.done((latency / 1000).toFixed(1))}
                </p>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Kandidat yang dipertimbangkan — menunjukkan pilihannya nyata,
              bukan kode yang dikarang. */}
          {candidates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{copy.perizinan.candidatesTitle}</CardTitle>
                <CardDescription>{copy.perizinan.candidatesHint}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {candidates.map((c) => {
                    const isChosen = verdict?.code === c.code;
                    return (
                      <li key={c.code} className="flex items-start gap-3 py-2.5">
                        <span
                          className={cn(
                            "mt-0.5 grid size-6 shrink-0 place-items-center rounded-md text-[10px] font-semibold tabular-nums",
                            isChosen
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {isChosen ? <BadgeCheck className="size-3.5" /> : c.code.slice(0, 2)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium tabular-nums">{c.code}</p>
                          <p className="text-xs text-muted-foreground">{c.title}</p>
                        </div>
                        {isChosen && (
                          <Badge variant="secondary" className="shrink-0 text-[10px]">
                            {copy.perizinan.chosen}
                          </Badge>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          )}

          {!shownCode && !running && candidates.length === 0 && (
            <Card>
              <CardContent>
                <EmptyState
                  icon={<Landmark className="size-6" />}
                  title={copy.perizinan.emptyTitle}
                  body={copy.perizinan.emptyBody}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Kanan: hasil terverifikasi ─────────────────────────────────── */}
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BadgeCheck className="size-4 text-primary" />
                {copy.perizinan.resultTitle}
              </CardTitle>
              <CardDescription>
                {shownCode
                  ? copy.perizinan.resultHintVerified
                  : copy.perizinan.resultHintEmpty}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {shownCode ? (
                <>
                  <div id="kode-kbli-anda" className="rounded-xl border bg-card p-4">
                    <p className="text-xs text-muted-foreground">
                      {copy.perizinan.codeLabel}
                    </p>
                    <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">
                      {shownCode}
                    </p>
                    <p className="mt-1 text-sm font-medium">{shownTitle}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
                      <Badge
                        variant="secondary"
                        className="bg-tone-hijau-bg text-tone-hijau"
                      >
                        {copy.perizinan.verified}
                      </Badge>
                      <span className="text-muted-foreground">
                        {fromProfile
                          ? copy.perizinan.fromCascade
                          : (verdict?.source ?? copy.perizinan.fromCascade)}
                      </span>
                    </div>
                  </div>

                  {verdict?.description && (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {verdict.description}
                    </p>
                  )}

                  {/* Di mana kode ini berada dalam klasifikasi — KBLI bersifat
                      hierarkis, jadi angkanya tidak berdiri sendiri. */}
                  {verdict?.hierarchy && verdict.hierarchy.length > 1 && (
                    <div className="space-y-2">
                      <p className="text-[11px] font-medium text-muted-foreground">
                        {copy.perizinan.hierarchyLabel}
                      </p>
                      <ol className="space-y-1.5">
                        {verdict.hierarchy.map((h, i) => {
                          const last = i === verdict.hierarchy!.length - 1;
                          return (
                            <li
                              key={h.code}
                              className="flex items-start gap-2"
                              style={{ paddingLeft: `${i * 12}px` }}
                            >
                              <span
                                className={cn(
                                  "mt-1 size-1.5 shrink-0 rounded-full",
                                  last ? "bg-primary" : "bg-muted-foreground/40",
                                )}
                              />
                              <span className="min-w-0 flex-1 text-[11px] leading-snug">
                                <span
                                  className={cn(
                                    "tabular-nums",
                                    last ? "font-semibold" : "text-muted-foreground",
                                  )}
                                >
                                  {h.code}
                                </span>
                                <span className="text-muted-foreground"> · {h.title}</span>
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  )}
                </>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  {copy.perizinan.noResult}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Risiko: sengaja menyatakan belum diketahui, bukan menebak. */}
          {shownCode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="size-4 text-tone-oranye" />
                  {copy.perizinan.riskTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2.5">
                  <span className="text-sm">{copy.perizinan.riskLevelLabel}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {copy.perizinan.riskUnknown}
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {copy.perizinan.riskNote}
                </p>
                <Separator />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {copy.perizinan.ossHint}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Penjelasan agen, apa adanya. */}
          {answer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="size-4 text-primary" />
                  {copy.perizinan.agentTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Prose
                  text={answer}
                  className="max-h-80 overflow-y-auto rounded-lg bg-muted/40 p-3 text-xs"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

/** A sensible starting description from the business type the owner picked. */
function defaultDescription(type: string): string {
  switch (type) {
    case "warung":
      return "Warung yang menjual makanan dan minuman, pembeli makan di tempat.";
    case "kafe":
      return "Kafe yang menjual kopi dan makanan ringan, pembeli makan di tempat.";
    case "toko":
      return "Toko yang menjual barang dagangan sehari-hari secara eceran.";
    case "jasa":
      return "Usaha jasa yang melayani pelanggan.";
    default:
      return "";
  }
}
