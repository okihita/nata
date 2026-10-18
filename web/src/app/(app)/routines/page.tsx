"use client";

import { useState } from "react";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
  FileCheck2,
  Table,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/copy";
import { idr, idrFull } from "@/lib/format";
import {
  DEMO_ROUTINES,
  type AutonomousRoutine,
  type RoutineCadence,
  type RoutineExecutionRecord,
} from "@/lib/routines-data";

export default function RoutinesPage() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [routines, setRoutines] = useState<AutonomousRoutine[]>(DEMO_ROUTINES);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>(DEMO_ROUTINES[0].id);
  const [selectedExecId, setSelectedExecId] = useState<string>(
    DEMO_ROUTINES[0].recentExecutions[0].id
  );
  const [activeCadence, setActiveCadence] = useState<RoutineCadence | "all">("all");
  const [runningId, setRunningId] = useState<string | null>(null);

  const selectedRoutine = routines.find((r) => r.id === selectedRoutineId) ?? routines[0];
  const selectedExec =
    selectedRoutine.recentExecutions.find((e) => e.id === selectedExecId) ??
    selectedRoutine.recentExecutions[0];

  const filteredRoutines = routines.filter((r) =>
    activeCadence === "all" ? true : r.cadence === activeCadence
  );

  const handleTrigger = async (id: string) => {
    setRunningId(id);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const timeStr = isEn ? "Just now" : "Baru saja";
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const freshExec: RoutineExecutionRecord = {
            id: `exec-${Date.now()}`,
            timestamp: timeStr,
            status: "success",
            durationMs: 3420,
            tokensUsed: 1120,
            findingSummary: isEn
              ? "Autonomous background cycle executed on Cloud Run. Invariants and statutory constraints validated."
              : "Siklus otonom selesai diproses di Cloud Run. Parameter pembukuan dan regulasi terverifikasi valid.",
            findingSummaryEn:
              "Autonomous background cycle executed on Cloud Run. Invariants and statutory constraints validated.",
            impactMetrics: [
              { label: "Status", labelEn: "Status", value: "Verified" },
              { label: "Duration", labelEn: "Duration", value: "3.4s" },
              { label: "Ledger", labelEn: "Ledger", value: "Balanced" },
            ],
            statutoryGrounding: r.statutoryGrounding,
            artifactType: r.recentExecutions[0].artifactType,
            artifactPayload: r.recentExecutions[0].artifactPayload,
            actionTaken: isEn
              ? "State synchronized with business ledger."
              : "Status disinkronkan dengan buku besar usaha.",
            actionTakenEn: "State synchronized with business ledger.",
          };
          return {
            ...r,
            lastRunTime: timeStr,
            lastRunStatus: "success",
            recentExecutions: [freshExec, ...r.recentExecutions],
          };
        }
        return r;
      })
    );
    setRunningId(null);
  };

  const getAgentTone = (id: string) => {
    switch (id) {
      case "maya":
        return "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20";
      case "dimas":
        return "text-blue-700 dark:text-blue-300 bg-blue-500/10 border-blue-500/20";
      case "arief":
        return "text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-primary bg-primary/10 border-primary/20";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {isEn ? "4 Autonomous Workers Active" : "4 Jadwal Otomatis Aktif"}
            </span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {isEn ? "Autonomous Routines" : "Rutinitas Otonom"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEn
              ? "Scheduled background agents that guard your books, tax thresholds, and legal status."
              : "Jadwal kerja mandiri agen AI yang menjaga pembukuan, ambang pajak, dan legalitas usaha."}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTrigger(selectedRoutine.id)}
          disabled={runningId !== null}
          className="text-xs h-8 gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className={`size-3.5 ${runningId ? "animate-spin" : ""}`} />
          <span>{isEn ? "Trigger Selected Job" : "Jalankan Pekerjaan Ini"}</span>
        </Button>
      </div>

      {/* 3-Pane Cascading Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch min-h-[580px]">
        {/* PANE 1: Jobs List (3 cols / 25%) */}
        <div className="lg:col-span-3 flex flex-col rounded-xl border border-border/70 bg-card overflow-hidden">
          <div className="p-3 border-b border-border/60 flex items-center justify-between bg-muted/20">
            <span className="text-xs font-semibold text-foreground">
              {isEn ? "1. Jobs" : "1. Jadwal"}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              {filteredRoutines.length} {isEn ? "registered" : "terdaftar"}
            </span>
          </div>

          {/* Quick filter tabs */}
          <div className="p-2 border-b border-border/40 flex gap-1 text-[11px] bg-muted/10">
            {(["all", "daily", "weekly"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setActiveCadence(c)}
                className={`px-2 py-0.5 rounded capitalize ${
                  activeCadence === c
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c === "all" ? (isEn ? "All" : "Semua") : c === "daily" ? (isEn ? "Daily" : "Harian") : (isEn ? "Weekly" : "Mingguan")}
              </button>
            ))}
          </div>

          <div className="p-2 space-y-1.5 flex-1 overflow-y-auto">
            {filteredRoutines.map((routine) => {
              const isSelected = selectedRoutineId === routine.id;
              const isRunning = runningId === routine.id;

              return (
                <div
                  key={routine.id}
                  onClick={() => {
                    setSelectedRoutineId(routine.id);
                    setSelectedExecId(routine.recentExecutions[0]?.id ?? "");
                  }}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary/80 bg-primary/5 shadow-xs"
                      : "border-border/50 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${getAgentTone(
                        routine.assignedAgent.id
                      )}`}
                    >
                      {routine.assignedAgent.name}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {routine.cronSchedule}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-foreground line-clamp-1">
                    {isEn ? routine.titleEn : routine.title}
                  </h3>

                  <div className="flex items-center justify-between pt-1.5 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {routine.lastRunStatus === "warning" ? (
                        <span className="size-1.5 rounded-full bg-amber-500" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                      )}
                      <span>{routine.lastRunTime}</span>
                    </span>

                    {isRunning ? (
                      <span className="text-primary font-medium">{isEn ? "Running…" : "Proses…"}</span>
                    ) : (
                      <ChevronRight className="size-3 text-muted-foreground" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANE 2: Historical Runs (3 cols / 25%) */}
        <div className="lg:col-span-4 flex flex-col rounded-xl border border-border/70 bg-card overflow-hidden">
          <div className="p-3 border-b border-border/60 flex items-center justify-between bg-muted/20">
            <div>
              <span className="text-xs font-semibold text-foreground">
                {isEn ? "2. Run History" : "2. Riwayat Eksekusi"}
              </span>
              <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                {isEn ? selectedRoutine.titleEn : selectedRoutine.title}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              disabled={runningId === selectedRoutine.id}
              onClick={() => handleTrigger(selectedRoutine.id)}
              className="h-6 px-2 text-[10px] gap-1"
            >
              <Play className="size-2.5 fill-current" />
              <span>{isEn ? "Trigger" : "Jalankan"}</span>
            </Button>
          </div>

          <div className="p-2 space-y-2 flex-1 overflow-y-auto">
            {selectedRoutine.recentExecutions.map((exec) => {
              const isSelected = selectedExecId === exec.id;

              return (
                <div
                  key={exec.id}
                  onClick={() => setSelectedExecId(exec.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border/50 hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      {exec.status === "warning" ? (
                        <AlertTriangle className="size-3.5 text-amber-500" />
                      ) : (
                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                      )}
                      <span>{exec.timestamp}</span>
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {(exec.durationMs / 1000).toFixed(1)}s
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {isEn ? exec.findingSummaryEn : exec.findingSummary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-2 text-[10px]">
                    <span className="text-muted-foreground font-mono">
                      {exec.tokensUsed} Vertex AI Tokens
                    </span>
                    <span className="text-primary font-medium flex items-center gap-0.5">
                      {isEn ? "Inspect" : "Periksa"} <ChevronRight className="size-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANE 3: Result & Artifact Canvas (5 cols / 50%) */}
        <div className="lg:col-span-5 flex flex-col rounded-xl border border-border/70 bg-card overflow-hidden">
          <div className="p-3 border-b border-border/60 flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-1.5">
              <FileCheck2 className="size-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground">
                {isEn ? "3. Proof & Artifact Canvas" : "3. Dokumen & Bukti Temuan"}
              </span>
            </div>

            <Badge variant="outline" className="text-[10px] font-mono">
              {selectedExec.id}
            </Badge>
          </div>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {/* Finding Summary Box */}
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">
                {isEn ? "Autonomous Finding" : "Temuan Mandiri Agen"}
              </span>
              <p className="text-xs text-foreground leading-relaxed font-medium">
                {isEn ? selectedExec.findingSummaryEn : selectedExec.findingSummary}
              </p>
            </div>

            {/* Impact Metric Chips */}
            <div className="grid grid-cols-3 gap-2">
              {selectedExec.impactMetrics.map((m, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-background border border-border/70 text-center">
                  <div className="text-[10px] text-muted-foreground truncate">
                    {isEn ? m.labelEn : m.label}
                  </div>
                  <div className="text-xs font-semibold text-foreground mt-0.5 truncate">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Specific Artifact Rendering */}
            <div className="p-3 rounded-xl border border-border/80 bg-background space-y-2.5">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Table className="size-3.5 text-primary" />
                  {isEn ? "Generated Proof Document" : "Dokumen Hasil Verifikasi"}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {selectedExec.artifactType}
                </span>
              </div>

              {/* Artifact: Cash Briefing */}
              {selectedExec.artifactType === "cash_briefing" && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">{isEn ? "Daily Burn Rate" : "Burn Rate Harian"}</span>
                    <span className="font-mono font-medium">{idrFull(selectedExec.artifactPayload.dailyBurnRate as number)}/hari</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">{isEn ? "Operating Buffer" : "Batas Pengaman Kas"}</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {String(selectedExec.artifactPayload.operatingBuffer)}
                    </span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-muted-foreground font-mono uppercase">
                      {isEn ? "Reconciled Accounts" : "Akun Terverifikasi"}
                    </span>
                    {((selectedExec.artifactPayload.lineItems as Array<{ label: string; amount: number }>) || []).map(
                      (item, i) => (
                        <div key={i} className="flex justify-between text-[11px] py-0.5">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-mono">{idr(item.amount)}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Artifact: Tax Threshold Sentinel */}
              {selectedExec.artifactType === "tax_threshold" && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">{isEn ? "Gross Turnover YTD" : "Omzet Bruto YTD"}</span>
                    <span className="font-mono font-medium">{idrFull(selectedExec.artifactPayload.turnoverYtd as number)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">{isEn ? "Non-Taxable Limit" : "Plafon Bebas Pajak"}</span>
                    <span className="font-mono font-medium">{idrFull(selectedExec.artifactPayload.exemptionCeiling as number)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">{isEn ? "Threshold Consumed" : "Persentase Terpakai"}</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {String(selectedExec.artifactPayload.percentConsumed)}% (Warning Tier)
                    </span>
                  </div>
                  <div className="p-2 rounded bg-muted/40 text-[11px] text-muted-foreground font-mono leading-relaxed">
                    {String(selectedExec.artifactPayload.statuteCite)}
                  </div>
                </div>
              )}

              {/* Artifact: Marketplace Reconciliation Table */}
              {selectedExec.artifactType === "reconciliation_table" && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">{isEn ? "Platform & Batch" : "Platform & Batch Ref"}</span>
                    <span className="font-medium">
                      {String(selectedExec.artifactPayload.platform)} (#{String(selectedExec.artifactPayload.batchRef)})
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">{isEn ? "Disbursed to Bank" : "Diterima ke Rekening"}</span>
                    <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      {idrFull(selectedExec.artifactPayload.netDisbursed as number)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">{isEn ? "Admin Deductions" : "Potongan Biaya Admin"}</span>
                    <span className="font-mono font-medium text-muted-foreground">
                      {idrFull(selectedExec.artifactPayload.platformFee as number)}
                    </span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-muted-foreground font-mono uppercase">
                      {isEn ? "Auto-Balanced Posting Lines" : "Jurnal Penyesuaian SAK EMKM"}
                    </span>
                    {((selectedExec.artifactPayload.journalLines as Array<{ account: string; debit: number; credit: number }>) || []).map(
                      (line, i) => (
                        <div key={i} className="flex justify-between text-[11px] py-0.5">
                          <span className="text-muted-foreground truncate max-w-[200px]">{line.account}</span>
                          <span className="font-mono">
                            {line.debit > 0 ? `D: ${idr(line.debit)}` : `C: ${idr(line.credit)}`}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Artifact: KBLI Certificate */}
              {selectedExec.artifactType === "kbli_certificate" && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded bg-primary/5 border border-primary/20">
                    <BadgeCheck className="size-5 text-primary shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground">
                        {String(selectedExec.artifactPayload.kbliCode)} &bull; {String(selectedExec.artifactPayload.riskLevel)}
                      </div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1">
                        {String(selectedExec.artifactPayload.kbliTitle)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-muted-foreground font-mono uppercase">
                      {isEn ? "OSS Statutory Requirements" : "Kepatuhan Regulasi OSS"}
                    </span>
                    {((selectedExec.artifactPayload.legalRequirements as Array<{ req: string; status: string }>) || []).map(
                      (r, i) => (
                        <div key={i} className="flex justify-between text-[11px] py-0.5">
                          <span className="text-muted-foreground">{r.req}</span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">{r.status}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Statutory Grounding Box */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/50 text-[11px]">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary shrink-0" />
                <span className="truncate">{selectedExec.statutoryGrounding}</span>
              </span>

              <Link
                href="/agents"
                className="flex items-center gap-0.5 text-primary hover:underline font-medium shrink-0"
              >
                <span>{isEn ? "Consult Agent" : "Konsultasi"}</span>
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
