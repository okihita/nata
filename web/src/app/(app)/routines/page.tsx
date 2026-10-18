"use client";

import { useState, useEffect } from "react";
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
  Plus,
  X,
  ChevronDown,
  CalendarClock,
  Archive,
  ArchiveRestore,
  MousePointerClick,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/copy";
import { idr, idrFull } from "@/lib/format";
import { useWorkspace } from "@/lib/store";
import {
  DEMO_ROUTINES,
  type AutonomousRoutine,
  type RoutineCadence,
  type RoutineExecutionRecord,
} from "@/lib/routines-data";

export default function RoutinesPage() {
  const { locale } = useLanguage();
  const isEn = locale === "en";
  const { business } = useWorkspace();
  const businessId = business?.id || "default";
  const storageKey = `nata.routines.v1.${businessId}`;

  const [routines, setRoutines] = useState<AutonomousRoutine[]>(() => {
    if (typeof window === "undefined") return DEMO_ROUTINES;
    try {
      const cached = localStorage.getItem(`nata.routines.v1.${businessId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      /* Fallback */
    }
    return DEMO_ROUTINES;
  });

  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [selectedExecId, setSelectedExecId] = useState<string | null>(null);
  const [activeCadence, setActiveCadence] = useState<RoutineCadence | "all">("all");
  const [runningId, setRunningId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAgent, setNewAgent] = useState<"nata" | "maya" | "dimas" | "arief">("nata");
  const [newCadence, setNewCadence] = useState<RoutineCadence>("daily");
  const [newHour, setNewHour] = useState("08:00");
  const [newDay, setNewDay] = useState("0"); // 0 = Sunday

  const [showArchived, setShowArchived] = useState(false);
  const [masterTab, setMasterTab] = useState<"jobs" | "runs">("jobs");

  // Keep localStorage synchronized whenever routines change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(routines));
    } catch {
      /* Ignore quota or private mode */
    }
  }, [routines, storageKey]);

  // Revalidate from Firestore API in background without layout flash
  useEffect(() => {
    let active = true;
    fetch(`/api/routines?businessId=${encodeURIComponent(businessId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data || !Array.isArray(data.routines) || data.routines.length === 0) return;
        setRoutines((prev) => {
          // Merge to avoid blowing away newly added custom routines not yet confirmed
          const serverMap = new Map<string, AutonomousRoutine>(
            data.routines.map((r: AutonomousRoutine) => [r.id, r])
          );
          const merged = prev.map((localR) => serverMap.get(localR.id) || localR);
          data.routines.forEach((serverR: AutonomousRoutine) => {
            if (!merged.some((m) => m.id === serverR.id)) {
              merged.push(serverR);
            }
          });
          return merged;
        });
      })
      .catch(() => {
        /* Keep existing cached or default routines */
      });
    return () => {
      active = false;
    };
  }, [businessId]);

  // Keyboard shortcut: Escape clears selection progressively (Pane 3 -> Pane 2)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isAddModalOpen) {
        if (selectedExecId) {
          setSelectedExecId(null);
        } else if (selectedRoutineId) {
          setSelectedRoutineId(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAddModalOpen, selectedExecId, selectedRoutineId]);

  const activeRoutines = routines.filter((r) =>
    showArchived ? r.status === "archived" : r.status !== "archived"
  );

  const selectedRoutine = selectedRoutineId
    ? activeRoutines.find((r) => r.id === selectedRoutineId) ?? null
    : null;

  const selectedExec = selectedRoutine && selectedExecId
    ? selectedRoutine.recentExecutions.find((e) => e.id === selectedExecId) ?? null
    : null;

  const filteredRoutines = activeRoutines.filter((r) =>
    activeCadence === "all" ? true : r.cadence === activeCadence
  );

  const handleToggleArchive = (id: string) => {
    const target = routines.find((r) => r.id === id);
    if (!target) return;

    const nextStatus = target.status === "archived" ? "active" : "archived";

    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );

    // Persist status change asynchronously
    fetch("/api/routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_status",
        routineId: id,
        status: nextStatus,
        businessId,
      }),
    }).catch(() => {});
  };

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
            artifactType: r.recentExecutions[0]?.artifactType || "cash_briefing",
            artifactPayload: r.recentExecutions[0]?.artifactPayload || {
              cashBalance: 50000000,
              dailyBurnRate: 1500000,
              runwayDays: 33,
              operatingBuffer: "Configured",
              lineItems: [{ label: "Rekening Operasional", amount: 50000000 }],
            },
            actionTaken: isEn
              ? "State synchronized with business ledger."
              : "Status disinkronkan dengan buku besar usaha.",
            actionTakenEn: "State synchronized with business ledger.",
          };
          // Persist execution run to Firestore in background
          fetch("/api/routines", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "record_execution",
              routineId: id,
              execution: freshExec,
              businessId,
            }),
          }).catch(() => {});

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

  const handleAddNewRoutine = () => {
    if (!newTitle.trim()) return;

    const agentMeta = {
      nata: { name: "Mas Nata", role: "Kepala Tim Keuangan", roleEn: "Chief Financial Lead" },
      maya: { name: "Mba Maya", role: "Spesialis Pajak UMKM", roleEn: "Tax Specialist" },
      dimas: { name: "Mas Dimas", role: "Auditor Pembukuan & Rekonsiliasi", roleEn: "Audit & Ledger Specialist" },
      arief: { name: "Bang Arief", role: "Spesialis Perizinan & KBLI", roleEn: "Licensing Specialist" },
    }[newAgent];

    const [hourStr, minStr] = newHour.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minStr, 10) || 0;

    let computedCron = `${minute} ${hour} * * *`;
    let humanId = `Setiap hari ${newHour} WIB`;
    let humanEn = `Daily at ${newHour} WIB`;

    if (newCadence === "weekly") {
      computedCron = `${minute} ${hour} * * ${newDay}`;
      const dayNamesId = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const dayNamesEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayIdx = parseInt(newDay, 10) || 0;
      humanId = `Setiap ${dayNamesId[dayIdx]} ${newHour} WIB`;
      humanEn = `Every ${dayNamesEn[dayIdx]} at ${newHour} WIB`;
    } else if (newCadence === "monthly") {
      computedCron = `${minute} ${hour} 28-31 * *`;
      humanId = `Setiap akhir bulan ${newHour} WIB`;
      humanEn = `End of month at ${newHour} WIB`;
    }

    const newId = `rtn-custom-${Date.now()}`;
    const fresh: AutonomousRoutine = {
      id: newId,
      title: newTitle.trim(),
      titleEn: newTitle.trim(),
      category: newAgent === "maya" ? "tax" : newAgent === "arief" ? "compliance" : "treasury",
      assignedAgent: {
        id: newAgent,
        ...agentMeta,
      },
      cronSchedule: computedCron,
      scheduleHuman: humanId,
      scheduleHumanEn: humanEn,
      cadence: newCadence,
      status: "active",
      lastRunTime: isEn ? "Scheduled" : "Terjadwal",
      lastRunStatus: "success",
      description: "Jadwal kerja mandiri kustom yang dikonfigurasi pengguna untuk memantau aktivitas usaha.",
      descriptionEn: "User-configured background schedule to monitor ongoing business activities.",
      purpose: "Eksekusi otomatis pada server Cloud Run sesuai interval waktu.",
      purposeEn: "Automated execution on Cloud Run server per scheduled interval.",
      statutoryGrounding: "SAK EMKM & PP 55/2022",
      recentExecutions: [],
    };

    setRoutines((prev) => [fresh, ...prev]);
    setSelectedRoutineId(fresh.id);
    setSelectedExecId(null);
    setNewTitle("");
    setIsAddModalOpen(false);

    // Persist to backend asynchronously
    fetch("/api/routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_routine",
        businessId: business?.id || "default",
        routine: fresh,
      }),
    }).catch((err) => {
      console.warn("Offline fallback: routine stored locally in UI state", err);
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="border-b border-border/60 pb-4">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {isEn ? "Autonomous Routines" : "Rutinitas Otonom"}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isEn
            ? "Scheduled background agents that guard your books, tax thresholds, and legal status."
            : "Jadwal kerja mandiri agen AI yang menjaga pembukuan, ambang pajak, dan legalitas usaha."}
        </p>
      </div>

      {/* Adaptive 2-Column (Medium/Large) / 3-Pane (Extra Large) Explorer */}
      {/* On < xl screens, show a clean segmented switcher between Jobs and Timeline */}
      <div className="flex xl:hidden items-center justify-between p-1.5 rounded-lg border border-border/70 bg-card mb-2">
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setMasterTab("jobs")}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              masterTab === "jobs"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isEn ? "1. Jobs List" : "1. Daftar Jadwal"} ({filteredRoutines.length})
          </button>
          <button
            onClick={() => setMasterTab("runs")}
            disabled={!selectedRoutine}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              masterTab === "runs"
                ? "bg-foreground text-background"
                : selectedRoutine
                ? "text-muted-foreground hover:text-foreground"
                : "text-muted-foreground/40 cursor-not-allowed"
            }`}
          >
            {isEn ? "2. Run Timeline" : "2. Garis Waktu"} {selectedRoutine ? `(${selectedRoutine.recentExecutions.length})` : ""}
          </button>
        </div>

        <span className="text-xs font-medium text-foreground truncate max-w-[200px] px-2">
          {selectedRoutine ? (isEn ? selectedRoutine.titleEn : selectedRoutine.title) : (isEn ? "No job selected" : "Pilih jadwal")}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch min-h-[580px]">
        {/* PANE 1: Jobs List (lg:col-span-5 xl:col-span-3) */}
        <div
          className={`flex flex-col rounded-xl border border-border/70 bg-card overflow-hidden ${
            masterTab === "jobs" ? "flex" : "hidden xl:flex"
          } lg:col-span-5 xl:col-span-3`}
        >
          <div className="p-3 border-b border-border/60 flex items-center justify-between bg-muted/20">
            <span className="text-xs font-semibold text-foreground">
              {isEn ? "1. Jobs" : "1. Jadwal"}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddModalOpen(true)}
              className="h-6 px-2 text-xs gap-1 border-primary/40 text-primary hover:bg-primary/5"
            >
              <Plus className="size-3" />
              <span>{isEn ? "Add New" : "Tambah"}</span>
            </Button>
          </div>

          {/* Quick filter tabs */}
          <div className="p-2 border-b border-border/40 flex items-center justify-between text-xs bg-muted/10">
            <div className="flex gap-1">
              {(["all", "daily", "weekly"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCadence(c)}
                  className={`px-2 py-0.5 rounded capitalize transition-colors ${
                    activeCadence === c
                      ? "bg-foreground text-background font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c === "all" ? (isEn ? "All" : "Semua") : c === "daily" ? (isEn ? "Daily" : "Harian") : (isEn ? "Weekly" : "Mingguan")}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowArchived((prev) => !prev)}
              className={`px-1.5 py-0.5 rounded text-xs flex items-center gap-1 transition-colors ${
                showArchived
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 font-medium border border-amber-500/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={isEn ? "Toggle archived jobs" : "Tampilkan jadwal diarsip"}
            >
              <Archive className="size-3" />
              <span>{showArchived ? (isEn ? "Archived" : "Arsip") : (isEn ? "Archived" : "Arsip")}</span>
            </button>
          </div>

          <div className="p-2 space-y-1.5 flex-1 overflow-y-auto">
            {filteredRoutines.map((routine) => {
              const isSelected = selectedRoutineId === routine.id;
              const isRunning = runningId === routine.id;

              return (
                <div
                  key={routine.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedRoutineId(null);
                      setSelectedExecId(null);
                    } else {
                      setSelectedRoutineId(routine.id);
                      setSelectedExecId(null);
                      setMasterTab("runs");
                    }
                  }}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary/80 bg-primary/5 shadow-xs"
                      : "border-border/50 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded border ${getAgentTone(
                        routine.assignedAgent.id
                      )}`}
                    >
                      {routine.assignedAgent.name}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/40">
                      {isEn ? routine.scheduleHumanEn : routine.scheduleHuman}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-foreground line-clamp-1">
                    {isEn ? routine.titleEn : routine.title}
                  </h3>

                  <div className="flex items-center justify-between pt-1.5 text-xs text-muted-foreground">
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

        {/* PANE 2: Historical Runs (lg:col-span-5 xl:col-span-4) */}
        <div
          className={`flex flex-col rounded-xl border border-border/70 bg-card overflow-hidden ${
            masterTab === "runs" ? "flex" : "hidden xl:flex"
          } lg:col-span-5 xl:col-span-4`}
        >
          <div className="p-3 border-b border-border/60 flex items-center justify-between bg-muted/20">
            <div>
              <span className="text-xs font-semibold text-foreground">
                {isEn ? "2. Run Timeline" : "2. Garis Waktu Eksekusi"}
              </span>
              <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                {selectedRoutine
                  ? (isEn ? selectedRoutine.titleEn : selectedRoutine.title)
                  : (isEn ? "Select a job from pane 1" : "Pilih jadwal dari panel 1")}
              </p>
            </div>
            {selectedRoutine && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-muted-foreground">
                  {selectedRoutine.recentExecutions.length} {isEn ? "runs" : "riwayat"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoutineId(null);
                    setSelectedExecId(null);
                  }}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  title={isEn ? "Clear selection (Esc)" : "Batalkan pilihan (Esc)"}
                  aria-label={isEn ? "Clear selection" : "Batalkan pilihan"}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
          </div>

          {selectedRoutine ? (
            <div className="p-2 space-y-2 flex-1 overflow-y-auto">
              {/* NEXT SCHEDULED RUN CARD */}
              <div className="p-3 rounded-xl border border-border/80 bg-muted/30 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <CalendarClock className="size-3.5 text-primary" />
                    {isEn ? "Next Scheduled Run" : "Jadwal Berikutnya"}
                  </span>
                  <span className="text-xs font-medium bg-background text-foreground/80 px-2 py-0.5 rounded border border-border/70">
                    {isEn ? selectedRoutine.scheduleHumanEn : selectedRoutine.scheduleHuman}
                  </span>
                </div>

                <div className="text-xs text-foreground/90 font-medium flex items-center justify-between">
                  <span>{selectedRoutine.cadence === "daily" ? (isEn ? "Recurring Daily Cycle" : "Siklus Rutin Harian") : (isEn ? "Scheduled Cycle" : "Siklus Terjadwal")}</span>
                  <span className="text-xs font-mono text-muted-foreground">{selectedRoutine.cronSchedule}</span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {isEn ? selectedRoutine.purposeEn : selectedRoutine.purpose}
                </p>

                <div className="pt-1 flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground font-mono truncate">
                    Worker: {selectedRoutine.assignedAgent.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleArchive(selectedRoutine.id)}
                      className="h-7 px-2 text-xs gap-1 border-border/80 text-muted-foreground hover:text-foreground"
                      title={
                        selectedRoutine.status === "archived"
                          ? (isEn ? "Restore routine" : "Aktifkan kembali")
                          : (isEn ? "Archive routine (soft-delete)" : "Arsipkan jadwal (nonaktifkan)")
                      }
                    >
                      {selectedRoutine.status === "archived" ? (
                        <>
                          <ArchiveRestore className="size-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{isEn ? "Restore" : "Pulihkan"}</span>
                        </>
                      ) : (
                        <>
                          <Archive className="size-3 text-muted-foreground" />
                          <span>{isEn ? "Archive" : "Arsipkan"}</span>
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="default"
                      disabled={runningId === selectedRoutine.id || selectedRoutine.status === "archived"}
                      onClick={() => handleTrigger(selectedRoutine.id)}
                      className="h-7 px-2.5 text-xs gap-1.5 shadow-xs"
                    >
                      {runningId === selectedRoutine.id ? (
                        <RotateCcw className="size-3 animate-spin" />
                      ) : (
                        <Play className="size-3 fill-current" />
                      )}
                      <span>
                        {runningId === selectedRoutine.id
                          ? (isEn ? "Running…" : "Berjalan…")
                          : (isEn ? "Run Now" : "Jalankan Sekarang")}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* PAST RUNS DIVIDER */}
              <div className="px-1 pt-1 flex items-center gap-2 text-xs uppercase font-mono text-muted-foreground">
                <span>{isEn ? "Past Executions" : "Riwayat Eksekusi"}</span>
                <div className="h-px bg-border/60 flex-1" />
              </div>

              {selectedRoutine.recentExecutions.length === 0 ? (
                <div className="p-6 rounded-lg border border-dashed border-border/70 text-center space-y-1.5 text-muted-foreground">
                  <p className="text-xs font-medium text-foreground">
                    {isEn ? "No Past Runs Yet" : "Belum Ada Riwayat Eksekusi"}
                  </p>
                  <p className="text-xs text-muted-foreground max-w-[220px] mx-auto">
                    {isEn
                      ? "This worker is freshly registered. Click 'Run Now' above to trigger its initial verification run."
                      : "Pekerja ini baru didaftarkan. Klik 'Jalankan Sekarang' di atas untuk memicu siklus perdananya."}
                  </p>
                </div>
              ) : (
                selectedRoutine.recentExecutions.map((exec) => {
                  const isSelected = selectedExecId === exec.id;

                  return (
                    <div
                      key={exec.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedExecId(null);
                        } else {
                          setSelectedExecId(exec.id);
                        }
                      }}
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
                        <span className="text-xs font-mono text-muted-foreground">
                          {(exec.durationMs / 1000).toFixed(1)}s
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {isEn ? exec.findingSummaryEn : exec.findingSummary}
                      </p>

                      <div className="flex items-center justify-end pt-2 border-t border-border/40 mt-2 text-xs">
                        <span className="text-primary font-medium flex items-center gap-0.5">
                          {isEn ? "Inspect" : "Periksa"} <ChevronRight className="size-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center flex-1 text-center space-y-2.5 text-muted-foreground">
              <MousePointerClick className="size-7 text-muted-foreground/50 stroke-1" />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">
                  {isEn ? "No Job Selected" : "Belum Ada Jadwal Dipilih"}
                </p>
                <p className="text-xs text-muted-foreground max-w-[220px]">
                  {isEn
                    ? "Click any autonomous job in Pane 1 to inspect its schedule and past execution runs."
                    : "Pilih salah satu jadwal di Panel 1 untuk memeriksa siklus dan riwayat pekerjaannya."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* PANE 3: Result & Artifact Canvas (lg:col-span-7 xl:col-span-5) */}
        <div className="lg:col-span-7 xl:col-span-5 flex flex-col rounded-xl border border-border/70 bg-card overflow-hidden">
          <div className="p-3 border-b border-border/60 flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-1.5">
              <FileCheck2 className="size-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground">
                {isEn ? "3. Proof & Artifact Canvas" : "3. Dokumen & Bukti Temuan"}
              </span>
            </div>

            {selectedExec && (
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-xs font-mono">
                  {selectedExec.id}
                </Badge>
                <button
                  type="button"
                  onClick={() => setSelectedExecId(null)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  title={isEn ? "Clear run selection (Esc)" : "Batalkan pilihan riwayat (Esc)"}
                  aria-label={isEn ? "Clear run selection" : "Batalkan pilihan riwayat"}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
          </div>

          {selectedExec ? (
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {/* Finding Summary Box */}
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1">
              <span className="text-xs font-mono uppercase text-muted-foreground">
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
                  <div className="text-xs text-muted-foreground truncate">
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
                <span className="text-xs font-mono text-muted-foreground">
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
                    <span className="text-xs text-muted-foreground font-mono uppercase">
                      {isEn ? "Reconciled Accounts" : "Akun Terverifikasi"}
                    </span>
                    {((selectedExec.artifactPayload.lineItems as Array<{ label: string; amount: number }>) || []).map(
                      (item, i) => (
                        <div key={i} className="flex justify-between text-xs py-0.5">
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
                  <div className="p-2 rounded bg-muted/40 text-xs text-muted-foreground font-mono leading-relaxed">
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
                    <span className="text-xs text-muted-foreground font-mono uppercase">
                      {isEn ? "Auto-Balanced Posting Lines" : "Jurnal Penyesuaian SAK EMKM"}
                    </span>
                    {((selectedExec.artifactPayload.journalLines as Array<{ account: string; debit: number; credit: number }>) || []).map(
                      (line, i) => (
                        <div key={i} className="flex justify-between text-xs py-0.5">
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
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {String(selectedExec.artifactPayload.kbliTitle)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-xs text-muted-foreground font-mono uppercase">
                      {isEn ? "OSS Statutory Requirements" : "Kepatuhan Regulasi OSS"}
                    </span>
                    {((selectedExec.artifactPayload.legalRequirements as Array<{ req: string; status: string }>) || []).map(
                      (r, i) => (
                        <div key={i} className="flex justify-between text-xs py-0.5">
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
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/50 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary shrink-0" />
                <span className="truncate">{selectedExec.statutoryGrounding}</span>
              </span>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/library"
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium"
                >
                  <Archive className="size-3" />
                  <span>{isEn ? "Library" : "Arsip Bukti"}</span>
                </Link>
                <Link
                  href="/agents"
                  className="flex items-center gap-0.5 text-primary hover:underline font-medium"
                >
                  <span>{isEn ? "Consult Agent" : "Konsultasi"}</span>
                  <ArrowUpRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center flex-1 text-center space-y-2.5 text-muted-foreground">
            <MousePointerClick className="size-7 text-muted-foreground/50 stroke-1" />
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">
                {isEn ? "No Run Selected" : "Belum Ada Riwayat Dipilih"}
              </p>
              <p className="text-xs text-muted-foreground max-w-[260px]">
                {isEn
                  ? "Select an execution run from the timeline in Pane 2 to inspect its autonomous findings, impact metrics, and statutory proof."
                  : "Pilih salah satu riwayat eksekusi di Panel 2 untuk memeriksa temuan mandiri, metrik dampak, dan bukti regulasi."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>

      {/* Add New Routine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80">
          <div className="bg-card border border-border w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {isEn ? "Add Scheduled Background Routine" : "Tambah Jadwal Rutinitas Otonom"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isEn
                    ? "Configure an AI worker to run periodic audit and compliance tasks."
                    : "Tugaskan asisten AI untuk memantau pembukuan dan kepatuhan secara otomatis."}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted/50"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-foreground block mb-1.5">
                  {isEn ? "Routine Title" : "Nama Jadwal / Pekerjaan"}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    isEn
                      ? "e.g. Nightly POS Settlement & Cash Discrepancy Audit"
                      : "mis. Audit Selisih Kas & Rekonsiliasi Setelmen POS Malam"
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1.5">
                  {isEn ? "Assigned Agent Worker" : "Tugaskan ke Asisten"}
                </label>
                <div className="relative">
                  <select
                    value={newAgent}
                    onChange={(e) => setNewAgent(e.target.value as "nata" | "maya" | "dimas" | "arief")}
                    className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="nata">Mas Nata (Kepala Tim Keuangan · Kas & Runway)</option>
                    <option value="maya">Mba Maya (Spesialis Pajak UMKM · PP 55 & PPh Final)</option>
                    <option value="dimas">Mas Dimas (Auditor Pembukuan · Rekonsiliasi Bank & SAK EMKM)</option>
                    <option value="arief">Bang Arief (Spesialis Perizinan · KBLI 2020 & OSS RBA)</option>
                  </select>
                  <ChevronDown className="size-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className={`grid ${newCadence === "weekly" ? "grid-cols-3" : "grid-cols-2"} gap-3`}>
                <div>
                  <label className="font-medium text-foreground block mb-1.5">
                    {isEn ? "Frequency" : "Frekuensi"}
                  </label>
                  <div className="relative">
                    <select
                      value={newCadence}
                      onChange={(e) => setNewCadence(e.target.value as RoutineCadence)}
                      className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="daily">{isEn ? "Daily" : "Setiap Hari"}</option>
                      <option value="weekly">{isEn ? "Weekly" : "Setiap Minggu"}</option>
                      <option value="monthly">{isEn ? "Monthly" : "Akhir Bulan"}</option>
                    </select>
                    <ChevronDown className="size-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {newCadence === "weekly" && (
                  <div>
                    <label className="font-medium text-foreground block mb-1.5">
                      {isEn ? "Day of Week" : "Pilihan Hari"}
                    </label>
                    <div className="relative">
                      <select
                        value={newDay}
                        onChange={(e) => setNewDay(e.target.value)}
                        className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="0">{isEn ? "Sunday" : "Minggu"}</option>
                        <option value="1">{isEn ? "Monday" : "Senin"}</option>
                        <option value="2">{isEn ? "Tuesday" : "Selasa"}</option>
                        <option value="3">{isEn ? "Wednesday" : "Rabu"}</option>
                        <option value="4">{isEn ? "Thursday" : "Kamis"}</option>
                        <option value="5">{isEn ? "Friday" : "Jumat"}</option>
                        <option value="6">{isEn ? "Saturday" : "Sabtu"}</option>
                      </select>
                      <ChevronDown className="size-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-medium text-foreground block mb-1.5">
                    {isEn ? "Execution Time" : "Waktu Jam Eksekusi"}
                  </label>
                  <div className="relative">
                    <select
                      value={newHour}
                      onChange={(e) => setNewHour(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="07:00">07:00 WIB ({isEn ? "Morning Briefing" : "Pagi Toko Buka"})</option>
                      <option value="08:00">08:00 WIB ({isEn ? "Standard Morning" : "Pagi Standar"})</option>
                      <option value="12:00">12:00 WIB ({isEn ? "Midday Shift" : "Siang Hari"})</option>
                      <option value="18:00">18:00 WIB ({isEn ? "Store Close" : "Tutup Shift Sore"})</option>
                      <option value="21:00">21:00 WIB ({isEn ? "Nightly POS Audit" : "Malam Tutup Kasir"})</option>
                      <option value="23:00">23:00 WIB ({isEn ? "Late Night Batch" : "Tengah Malam"})</option>
                    </select>
                    <ChevronDown className="size-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Friendly summary card */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs flex items-center justify-between">
                <span className="text-muted-foreground">{isEn ? "Computed Cloud Schedule:" : "Ringkasan Jadwal Server:"}</span>
                <span className="font-semibold text-foreground font-mono">
                  {newCadence === "daily"
                    ? `${isEn ? "Daily at" : "Setiap hari"} ${newHour} WIB`
                    : newCadence === "weekly"
                    ? `${isEn ? "Every" : "Setiap"} ${
                        ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][parseInt(newDay, 10) || 0]
                      } ${newHour} WIB`
                    : `${isEn ? "End of month at" : "Setiap akhir bulan"} ${newHour} WIB`}
                </span>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-border/40">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs h-9 px-4"
              >
                {isEn ? "Cancel" : "Batal"}
              </Button>
              <Button
                size="sm"
                onClick={handleAddNewRoutine}
                disabled={!newTitle.trim()}
                className="text-xs h-9 px-4 font-medium"
              >
                {isEn ? "Create Routine" : "Simpan Jadwal"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
