"use client";

import {
  Cpu,
  Layers,
  ShieldCheck,
  Code2,
  Zap,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JudgeDeepDiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEn: boolean;
}

export function JudgeDeepDiveModal({ open, onOpenChange, isEn }: JudgeDeepDiveModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border/80 shadow-xl p-6">
        <DialogHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
                <Cpu className="size-4" />
              </span>
              <DialogTitle className="text-base font-semibold tracking-tight">
                {isEn ? "Google AI Builder Cup — Architecture Inspector" : "Inspeksi Arsitektur — Google AI Builder Cup"}
              </DialogTitle>
            </div>
            <Badge variant="outline" className="text-xs font-mono bg-primary/5 text-primary border-primary/20">
              ADK 2.x + Gemini 3.8 Flash
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            {isEn
              ? "Technical breakdown of Nata's autonomous multi-agent orchestration, deterministic guardrails, and regulatory grounding."
              : "Rincian teknis orkestrasi multi-agen otonom Nata, guardrail deterministik, dan dasar kepatuhan hukum."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs">
          {/* Pillar 1: Multi-Agent Cascade */}
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" />
                1. Multi-Agent Autonomous Cascade
              </span>
              <span className="text-xs font-mono text-muted-foreground">nata_agent/agent.py</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {isEn
                ? "Rather than a generic monolithic LLM prompt, Nata coordinates 3 specialized agents via an autonomous cascade state machine. Ingestion triggers Keuangan (Ledger), which dispatches to Fiskal (Taxation) and Regulasi (Licensing) with typed payload immutability."
                : "Bukan prompt monolitik umum, Nata mengoordinasikan 3 agen terspesialisasi lewat state machine otonom: Keuangan (Buku Besar), Fiskal (Pajak), dan Regulasi (KBLI) dengan integritas data bertipe."}
            </p>
          </div>

          {/* Pillar 2: Google Cloud & Gemini Backbone */}
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-500" />
                2. Inference & Infrastructure Backbone
              </span>
              <span className="text-xs font-mono text-muted-foreground">Vertex AI Global</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {isEn
                ? "Deployed on Google Cloud Run with Vertex AI Global Endpoint. Powered by Gemini 3.8 Flash for multimodal receipt extraction and structured JSON generation, wrapped with HttpRetryOptions (exponential backoff) against rate limits."
                : "Dideploy di Google Cloud Run dengan endpoint Vertex AI Global. Menggunakan Gemini 3.8 Flash untuk OCR multimodal dan JSON terstruktur, dilengkapi HttpRetryOptions otomatis."}
            </p>
          </div>

          {/* Pillar 3: Deterministic Guardrails */}
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                3. Deterministic Guardrails (Zero Hallucination)
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">Strict Code Enforcement</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {isEn
                ? "The LLM only proposes; deterministic Python and TypeScript guardrails enforce truth. Bookkeeping transactions are halted if Debits != Credits (Zero-Variance Check). Tax obligations hardcode statutory thresholds without arithmetic drift."
                : "Model hanya mengusulkan; kode deterministik memverifikasi kebenaran. Entri buku besar ditolak otomatis jika Debit != Kredit (selisih > 0). Rumus pajak dan batas Rp 500M diuji secara absolut."}
            </p>
          </div>

          {/* Pillar 4: In-Context Grounding */}
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Code2 className="size-3.5 text-blue-500" />
                4. Statutory In-Context Grounding
              </span>
              <span className="text-xs font-mono text-muted-foreground">1,790 KBLI + SAK EMKM</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {isEn
                ? "Zero external vector database drift. Official BPS KBLI 2020 (1,790 codes), SAK EMKM DSAK IAI accounting rules, and PP 55/2022 statutes are ground directly in-context, guaranteeing reproducible and auditable legal citations."
                : "Tanpa ketergantungan vector DB eksternal yang rentan halusinasi. Taksonomi 1.790 kode KBLI 2020 BPS, SAK EMKM, dan PP 55/2022 terpasang langsung in-context untuk jaminan sitasi hukum yang valid."}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Target: Grand Winner & Best Use of Google Cloud AI
          </span>
          <Button
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs px-4"
          >
            {isEn ? "Close Inspector" : "Tutup"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
