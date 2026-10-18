"use client";

import { useState } from "react";
import {
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/copy";
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
  const [selectedRoutine, setSelectedRoutine] = useState<AutonomousRoutine>(DEMO_ROUTINES[0]);
  const [cadenceFilter, setCadenceFilter] = useState<RoutineCadence | "all">("all");
  const [runningRoutineId, setRunningRoutineId] = useState<string | null>(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [activeExecRecord, setActiveExecRecord] = useState<RoutineExecutionRecord | null>(null);

  const filteredRoutines = routines.filter((r) =>
    cadenceFilter === "all" ? true : r.cadence === cadenceFilter
  );

  const handleTriggerRoutine = async (routineId: string) => {
    setRunningRoutineId(routineId);
    // Simulate real background agent execution
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const timeStr = isEn ? "Just now" : "Baru saja";
    const newExec: RoutineExecutionRecord = {
      id: `exec-${Date.now()}`,
      timestamp: timeStr,
      status: "success",
      durationMs: 3820,
      tokensUsed: 1420,
      findingSummary: isEn
        ? "Autonomous cycle executed on Cloud Run. Ledger invariants and statutory grounding verified."
        : "Siklus otonom selesai diproses di Cloud Run. Kepatuhan pembukuan dan dasar hukum terverifikasi.",
      findingSummaryEn: "Autonomous cycle executed on Cloud Run. Ledger invariants and statutory grounding verified.",
      impactMetrics: [
        { label: isEn ? "Status" : "Status", labelEn: "Status", value: "Verified" },
        { label: isEn ? "Duration" : "Durasi", labelEn: "Duration", value: "3.8s" },
        { label: isEn ? "Ledger Sync" : "Sinkronisasi Buku", labelEn: "Ledger Sync", value: "100%" },
      ],
      statutoryGrounding: "SAK EMKM & PP 55/2022",
      actionTaken: isEn
        ? "State synchronized with business ledger."
        : "Status disinkronkan dengan buku besar usaha.",
      actionTakenEn: "State synchronized with business ledger.",
    };

    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === routineId) {
          const updated = {
            ...r,
            lastRunTime: timeStr,
            lastRunStatus: "success" as const,
            recentExecutions: [newExec, ...r.recentExecutions],
          };
          if (selectedRoutine.id === routineId) {
            setSelectedRoutine(updated);
          }
          return updated;
        }
        return r;
      })
    );

    setRunningRoutineId(null);
  };

  const getAgentBadge = (id: string, name: string) => {
    switch (id) {
      case "maya":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {name}
          </span>
        );
      case "dimas":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
            <span className="size-1.5 rounded-full bg-blue-500" />
            {name}
          </span>
        );
      case "arief":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            <span className="size-1.5 rounded-full bg-amber-500" />
            {name}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
            <span className="size-1.5 rounded-full bg-primary" />
            {name}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] font-mono border-primary/40 text-primary uppercase">
              Cloud Scheduler &bull; Autonomous Cron
            </Badge>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {isEn ? "Engine Healthy (4 Active Jobs)" : "Engine Aktif (4 Jadwal Otomatis)"}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {isEn ? "Autonomous Routines" : "Rutinitas Otonom"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEn
              ? "Scheduled background workers guarding your books, tax thresholds, and compliance while you sleep."
              : "Jadwal kerja mandiri agen AI untuk menjaga pembukuan, ambang pajak, dan perizinan tanpa perlu dipicu manual."}
          </p>
        </div>

        {/* Global Action Pill */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTriggerRoutine(routines[0].id)}
            disabled={runningRoutineId !== null}
            className="text-xs h-8 gap-1.5"
          >
            <RotateCcw className={`size-3.5 ${runningRoutineId ? "animate-spin" : ""}`} />
            <span>{isEn ? "Run Morning Briefing" : "Jalankan Briefing Pagi"}</span>
          </Button>
        </div>
      </div>

      {/* Filter and Cadence Segmented Control */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/60 text-xs">
          {(["all", "daily", "weekly", "monthly"] as const).map((cadence) => (
            <button
              key={cadence}
              onClick={() => setCadenceFilter(cadence)}
              className={`px-3 py-1 rounded-lg font-medium transition-all capitalize ${
                cadenceFilter === cadence
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cadence === "all"
                ? isEn
                  ? "All Routines"
                  : "Semua Rutinitas"
                : cadence === "daily"
                ? isEn
                  ? "Daily"
                  : "Harian"
                : cadence === "weekly"
                ? isEn
                  ? "Weekly"
                  : "Mingguan"
                : isEn
                ? "Monthly"
                : "Bulanan"}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-muted-foreground hidden sm:block">
          {isEn ? "Showing" : "Menampilkan"} <strong className="text-foreground">{filteredRoutines.length}</strong> {isEn ? "active workers" : "pekerja otomatis"}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Routine Cards List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredRoutines.map((routine) => {
            const isSelected = selectedRoutine.id === routine.id;
            const isRunning = runningRoutineId === routine.id;

            return (
              <div
                key={routine.id}
                onClick={() => setSelectedRoutine(routine)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative bg-card ${
                  isSelected
                    ? "border-primary/80 ring-1 ring-primary/30 shadow-sm"
                    : "border-border/70 hover:border-border hover:bg-muted/10"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {getAgentBadge(routine.assignedAgent.id, routine.assignedAgent.name)}
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {isEn ? routine.titleEn : routine.title}
                      </h3>
                      {routine.lastRunStatus === "warning" ? (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500/40 text-amber-600 dark:text-amber-400">
                          Warning
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {isEn ? routine.descriptionEn : routine.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1 font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border/50 text-foreground">
                        <Clock className="size-3 text-primary" />
                        {routine.cronSchedule}
                      </span>
                      <span>&bull;</span>
                      <span>{isEn ? routine.scheduleHumanEn : routine.scheduleHuman}</span>
                      <span>&bull;</span>
                      <span className="text-foreground/80">{isEn ? routine.assignedAgent.roleEn : routine.assignedAgent.role}</span>
                    </div>
                  </div>

                  {/* Immediate Trigger Button */}
                  <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    disabled={isRunning}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTriggerRoutine(routine.id);
                    }}
                    className="shrink-0 h-7 text-xs px-2.5 gap-1.5"
                  >
                    {isRunning ? (
                      <RotateCcw className="size-3 animate-spin" />
                    ) : (
                      <Play className="size-3 fill-current" />
                    )}
                    <span>{isRunning ? (isEn ? "Running…" : "Berjalan…") : (isEn ? "Trigger" : "Jalankan")}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Routine Deep Inspection & Execution Logs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-primary" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {isEn ? "Routine Specification" : "Spesifikasi Rutinitas"}
                </h2>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {selectedRoutine.id}
              </Badge>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground">
                {isEn ? selectedRoutine.titleEn : selectedRoutine.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {isEn ? selectedRoutine.purposeEn : selectedRoutine.purpose}
              </p>
            </div>

            {/* Invariant Grounding Box */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>{isEn ? "Statutory Grounding" : "Landasan Yuridis & Standar"}</span>
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                {selectedRoutine.statutoryGrounding}
              </p>
            </div>

            {/* Execution History Feed */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  {isEn ? "Recent Execution History" : "Riwayat Eksekusi Terkini"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {selectedRoutine.recentExecutions.length} {isEn ? "runs recorded" : "eksekusi tercatat"}
                </span>
              </div>

              <div className="space-y-2">
                {selectedRoutine.recentExecutions.map((exec) => (
                  <div
                    key={exec.id}
                    onClick={() => {
                      setActiveExecRecord(exec);
                      setInspectModalOpen(true);
                    }}
                    className="p-3 rounded-xl border border-border/60 bg-background/50 hover:bg-muted/30 transition-colors cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        {exec.status === "warning" ? (
                          <AlertTriangle className="size-3.5 text-amber-500" />
                        ) : (
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                        )}
                        <span className="font-medium text-foreground">{exec.timestamp}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {(exec.durationMs / 1000).toFixed(1)}s &bull; {exec.tokensUsed} tokens
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {isEn ? exec.findingSummaryEn : exec.findingSummary}
                    </p>

                    {/* Metric Pills */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {exec.impactMetrics.map((m, idx) => (
                        <div key={idx} className="bg-muted/50 p-1.5 rounded-lg border border-border/40 text-center">
                          <div className="text-[9px] text-muted-foreground truncate">
                            {isEn ? m.labelEn : m.label}
                          </div>
                          <div className="text-[11px] font-semibold text-foreground truncate mt-0.5">
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Execution Inspection Modal */}
      {inspectModalOpen && activeExecRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  {isEn ? "Execution Audit Record" : "Detail Log Audit Eksekusi"}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInspectModalOpen(false)}
                className="h-7 px-2 text-xs"
              >
                {isEn ? "Close" : "Tutup"}
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-mono uppercase text-muted-foreground">
                  {isEn ? "Timestamp & Engine Duration" : "Waktu Eksekusi & Durasi Engine"}
                </span>
                <p className="text-xs font-semibold text-foreground mt-0.5">
                  {activeExecRecord.timestamp} &bull; {(activeExecRecord.durationMs / 1000).toFixed(2)}s &bull; {activeExecRecord.tokensUsed} Vertex AI Tokens
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-muted-foreground">
                  {isEn ? "Autonomous Finding & Analysis" : "Temuan & Analisis Mandiri"}
                </span>
                <p className="text-xs text-foreground mt-0.5 leading-relaxed bg-muted/30 p-2.5 rounded-xl border border-border/50">
                  {isEn ? activeExecRecord.findingSummaryEn : activeExecRecord.findingSummary}
                </p>
              </div>

              {activeExecRecord.actionTaken && (
                <div>
                  <span className="text-[11px] font-mono uppercase text-muted-foreground">
                    {isEn ? "Automated Ledger Action" : "Tindakan Pembukuan Otomatis"}
                  </span>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {isEn ? activeExecRecord.actionTakenEn : activeExecRecord.actionTaken}
                  </p>
                </div>
              )}

              {activeExecRecord.statutoryGrounding && (
                <div>
                  <span className="text-[11px] font-mono uppercase text-muted-foreground">
                    {isEn ? "Legal & Accounting Citation" : "Sitasi Standar & Regulasi"}
                  </span>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    {activeExecRecord.statutoryGrounding}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" onClick={() => setInspectModalOpen(false)}>
                {isEn ? "Done" : "Selesai"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
