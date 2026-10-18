"use client";

import { useState } from "react";
import {
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/copy";
import {
  DEMO_ROUTINES,
  type AutonomousRoutine,
  type RoutineCadence,
} from "@/lib/routines-data";

export default function RoutinesPage() {
  const { locale } = useLanguage();
  const isEn = locale === "en";
  const [routines, setRoutines] = useState<AutonomousRoutine[]>(DEMO_ROUTINES);
  const [activeCadence, setActiveCadence] = useState<RoutineCadence | "all">("all");
  const [runningId, setRunningId] = useState<string | null>(null);

  const filteredRoutines = routines.filter((r) =>
    activeCadence === "all" ? true : r.cadence === activeCadence
  );

  const handleTrigger = async (id: string) => {
    setRunningId(id);
    await new Promise((resolve) => setTimeout(resolve, 900));

    const timeStr = isEn ? "Just now" : "Baru saja";
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              lastRunTime: timeStr,
              lastRunStatus: "success" as const,
            }
          : r
      )
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {isEn ? "4 Autonomous Workers Active" : "4 Jadwal Otomatis Aktif"}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {isEn ? "Routines" : "Rutinitas"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEn
              ? "Background checks running automatically on Google Cloud."
              : "Pemeriksaan otomatis di latar belakang yang menjaga pembukuan dan pajak Anda."}
          </p>
        </div>

        {/* Global Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTrigger(routines[0].id)}
          disabled={runningId !== null}
          className="text-xs h-8 gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className={`size-3.5 ${runningId ? "animate-spin" : ""}`} />
          <span>{isEn ? "Run Morning Briefing" : "Jalankan Briefing Pagi"}</span>
        </Button>
      </div>

      {/* Cadence Tabs */}
      <div className="flex items-center gap-1 border-b border-border/40 pb-2 text-xs">
        {(["all", "daily", "weekly", "monthly"] as const).map((cadence) => (
          <button
            key={cadence}
            onClick={() => setActiveCadence(cadence)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeCadence === cadence
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {cadence === "all"
              ? isEn
                ? "All"
                : "Semua"
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

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoutines.map((routine) => {
          const isRunning = runningId === routine.id;
          const latest = routine.recentExecutions[0];

          return (
            <div
              key={routine.id}
              className="p-4 rounded-xl border border-border/70 bg-card hover:border-border transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${getAgentTone(
                          routine.assignedAgent.id
                        )}`}
                      >
                        {routine.assignedAgent.name}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                        <Clock className="size-3" />
                        {routine.cronSchedule}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-foreground">
                      {isEn ? routine.titleEn : routine.title}
                    </h3>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isRunning}
                    onClick={() => handleTrigger(routine.id)}
                    className="shrink-0 h-7 px-2.5 text-xs gap-1"
                  >
                    {isRunning ? (
                      <RotateCcw className="size-3 animate-spin" />
                    ) : (
                      <Play className="size-3 fill-current" />
                    )}
                    <span>{isRunning ? (isEn ? "Running…" : "Proses…") : (isEn ? "Run" : "Jalankan")}</span>
                  </Button>
                </div>

                {/* Plain purpose line */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isEn ? routine.purposeEn : routine.purpose}
                </p>

                {/* Latest Execution Banner */}
                {latest && (
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        {routine.lastRunStatus === "warning" ? (
                          <AlertTriangle className="size-3.5 text-amber-500" />
                        ) : (
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                        )}
                        <span>{routine.lastRunTime}</span>
                      </span>
                      <span className="text-muted-foreground font-mono text-[10px]">
                        {(latest.durationMs / 1000).toFixed(1)}s
                      </span>
                    </div>

                    <p className="text-xs text-foreground/90 leading-normal">
                      {isEn ? latest.findingSummaryEn : latest.findingSummary}
                    </p>

                    {/* Key metric chips */}
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {latest.impactMetrics.map((m, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-background px-1.5 py-0.5 rounded border border-border/60 text-muted-foreground"
                        >
                          <strong className="text-foreground">{m.value}</strong> ({isEn ? m.labelEn : m.label})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Statutory Tag & Link */}
              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1 truncate max-w-[280px]">
                  <ShieldCheck className="size-3 text-primary shrink-0" />
                  <span className="truncate">{routine.statutoryGrounding}</span>
                </span>

                <Link
                  href="/agents"
                  className="flex items-center gap-0.5 text-primary hover:underline font-medium shrink-0"
                >
                  <span>{isEn ? "Talk to Agent" : "Tanya Agen"}</span>
                  <ArrowUpRight className="size-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
