"use client";

import { Bot, Sparkles, Cpu, Layers } from "lucide-react";
import { PageHeader } from "@/components/app-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/copy";

export default function AgentsPage() {
  const { copy } = useLanguage();

  return (
    <>
      <PageHeader
        title={copy.nav.agents}
        subtitle={copy.agents.keuanganRole ? "Multi-Agent Autonomous Orchestration for Indonesian MSMEs" : "Manajemen Agen Multi-Inference Nata"}
        badge="Multi-Agent System"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Bot className="size-5" />
              </span>
              <Badge variant="outline" className="font-mono text-xs">SAK EMKM</Badge>
            </div>
            <CardTitle className="text-base mt-2">{copy.agents.keuangan}</CardTitle>
            <CardDescription className="text-xs">{copy.agents.keuanganRole}</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground border-t pt-3">
            Autonomously ingests receipt data, enforces double-entry equality, and classifies accounts.
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Cpu className="size-5" />
              </span>
              <Badge variant="outline" className="font-mono text-xs">PP 55/2022</Badge>
            </div>
            <CardTitle className="text-base mt-2">{copy.agents.fiskal}</CardTitle>
            <CardDescription className="text-xs">{copy.agents.fiskalRole}</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground border-t pt-3">
            Computes PPh Final 0.5% liabilities, enforces statutory omzet threshold checks, and tracks deposits.
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Layers className="size-5" />
              </span>
              <Badge variant="outline" className="font-mono text-xs">OSS RBA</Badge>
            </div>
            <CardTitle className="text-base mt-2">{copy.agents.regulasi}</CardTitle>
            <CardDescription className="text-xs">{copy.agents.regulasiRole}</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground border-t pt-3">
            Resolves official 5-digit KBLI 2020 codes, synthesizes risk verification rules, and requirements.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
