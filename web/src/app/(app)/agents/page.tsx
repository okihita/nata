"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ReceiptText,
  Landmark,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ScanLine,
  ArrowRight,
  Shield,
  Clock,
  Briefcase,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/copy";
import { AGENT_TEAM, type AgentStaffId, type TeamMember } from "@/lib/agents-data";

const STAFF_ICONS: Record<string, LucideIcon> = {
  ReceiptText,
  Landmark,
  ShieldCheck,
  Sparkles,
};

export default function AgentsPage() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [selectedStaffId, setSelectedStaffId] = useState<AgentStaffId>("akuntan");
  const currentStaff = AGENT_TEAM[selectedStaffId];

  const CurrentIcon = STAFF_ICONS[currentStaff.avatarIcon] ?? Sparkles;

  return (
    <>
      <PageHeader
        title={isEn ? "Digital Finance Team" : "Tim Keuangan Digital"}
        subtitle={
          isEn
            ? "Your autonomous staff handling bookkeeping, taxes, and licensing in the background."
            : "Tim asisten pintar yang bekerja otomatis mengurus pembukuan, pajak, dan izin usaha Anda."
        }
        badge={isEn ? "Autonomous Team" : "Asisten Aktif"}
      />

      {/* Main Split-Pane Container with Internal Sidebar */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Sub-Sidebar (Master Staff List) */}
        <aside className="w-full md:w-80 shrink-0 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card p-3 shadow-none">
            <div className="flex items-center justify-between pb-2 border-b border-border/50 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isEn ? "Your Digital Team" : "Daftar Tim Asisten"}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono h-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                {isEn ? "4 Ready to Help" : "4 Siap Membantu"}
              </Badge>
            </div>

            <nav className="mt-2 space-y-2" aria-label="Team staff list">
              {(Object.keys(AGENT_TEAM) as AgentStaffId[]).map((id) => {
                const member = AGENT_TEAM[id];
                const isSelected = selectedStaffId === id;
                const Icon = STAFF_ICONS[member.avatarIcon] ?? Sparkles;

                return (
                  <button
                    key={id}
                    onClick={() => setSelectedStaffId(id)}
                    className={`w-full text-left rounded-lg p-3 transition-colors flex items-start justify-between gap-3 text-sm ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-medium shadow-none"
                        : "hover:bg-muted text-foreground border border-border/40"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className={`grid size-9 shrink-0 place-items-center rounded-lg mt-0.5 ${
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 space-y-0.5">
                        <p className="truncate text-xs font-semibold leading-snug">
                          {member.name.split(" (")[0]}
                        </p>
                        <p className={`text-[11px] truncate ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {isEn ? member.roleEn : member.role}
                        </p>
                        <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          isSelected
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {isEn ? member.badgeEn : member.badge}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Value Promise Card */}
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
              <Shield className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isEn ? "The Nata Guarantee" : "Jaminan Kemudahan Nata"}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isEn
                ? "You focus on selling and growing your business. Nata's specialized staff handles the administrative and accounting math quietly behind the scenes."
                : "Anda fokus jualan dan membesarkan usaha. Tim pintar Nata yang membereskan hitungan pembukuan, pajak, dan izin usaha di belakang layar."}
            </p>
          </div>
        </aside>

        {/* Right Detail Canvas (Staff Profile & Tasks) */}
        <main className="flex-1 min-w-0 w-full space-y-6">
          {/* Active Staff Hero Card */}
          <div className="rounded-xl border border-border/70 bg-card p-6 shadow-none space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <CurrentIcon className="size-6" />
                </span>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight">{currentStaff.name}</h2>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {isEn ? currentStaff.badgeEn : currentStaff.badge}
                    </Badge>
                  </div>
                  <p className="text-xs font-medium text-primary">
                    {isEn ? currentStaff.roleEn : currentStaff.role}
                  </p>
                  <p className="text-xs text-muted-foreground pt-0.5">
                    {isEn ? currentStaff.taglineEn : currentStaff.tagline}
                  </p>
                </div>
              </div>

              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs py-1 px-2.5">
                {isEn ? currentStaff.statusTextEn : currentStaff.statusText}
              </Badge>
            </div>

            {/* Quick Benefits Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {currentStaff.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border/50 bg-muted/30 p-3 space-y-1"
                >
                  <p className="text-[11px] text-muted-foreground">{isEn ? stat.labelEn : stat.label}</p>
                  <p className="text-sm font-semibold tracking-tight">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: What This Staff Does For You */}
          <Card className="border-border/70 shadow-none">
            <CardHeader className="py-4 px-6 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Briefcase className="size-4 text-primary" />
                <CardTitle className="text-sm font-semibold">
                  {isEn ? "Tasks Handled Autonomously" : "Tugas yang Dikerjakan Otomatis untuk Anda"}
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                {isEn
                  ? "Every day, this assistant takes these responsibilities off your plate."
                  : "Setiap hari asisten ini menggantikan tugas rumit berikut agar Anda tidak pusing."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {(isEn ? currentStaff.responsibilitiesEn : currentStaff.responsibilities).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                      <CheckCircle2 className="size-3.5" />
                    </span>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Section: Peace of Mind & Safety Guardrails */}
          <Card className="border-border/70 shadow-none">
            <CardHeader className="py-4 px-6 border-b border-border/40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-sm font-semibold">
                  {isEn ? "Safety Rules & Protection" : "Aturan Keamanan Pembukuan"}
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                {isEn
                  ? "Built-in protection so your business records remain 100% accurate."
                  : "Perlindungan otomatis agar catatan usaha Anda tetap aman dan bebas kesalahan fatal."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {(isEn ? currentStaff.autonomousRulesEn : currentStaff.autonomousRules).map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-border/50 bg-muted/20 text-xs leading-relaxed text-foreground"
                  >
                    {rule}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Real Life Example Callout & Quick Action */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                {isEn ? "How to use this assistant" : "Cara Pakai Asisten Ini"}
              </span>
              <p className="text-xs text-foreground leading-relaxed">
                {isEn ? currentStaff.delegationExampleEn : currentStaff.delegationExample}
              </p>
            </div>

            <Button asChild size="sm" className="gap-2 shrink-0 text-xs">
              <Link href={selectedStaffId === "konsultan_pajak" ? "/taxes" : selectedStaffId === "legal_izin" ? "/licensing" : "/record"}>
                <ScanLine className="size-3.5" />
                <span>{isEn ? "Try with Real Receipt" : "Coba Catat Struk"}</span>
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}
