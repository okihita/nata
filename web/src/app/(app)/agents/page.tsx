"use client";

import { useState } from "react";
import {
  Send,
  Paperclip,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  FileCheck2,
  Search,
  Scale,
  ShieldAlert,
  ChevronRight,
  Info,
} from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarMaya, AvatarDimas, AvatarArief, AvatarNata } from "@/components/agent-avatars";
import { useLanguage } from "@/lib/copy";
import { AGENT_PERSONAS, type AgentPersonId, type ChatMessage } from "@/lib/agents-persona-data";

export default function AgentsPage() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [activePersonaId, setActivePersonaId] = useState<AgentPersonId>("maya");
  const [chatMessages, setChatMessages] = useState<Record<AgentPersonId, ChatMessage[]>>({
    maya: AGENT_PERSONAS.maya.defaultChatHistory,
    dimas: AGENT_PERSONAS.dimas.defaultChatHistory,
    arief: AGENT_PERSONAS.arief.defaultChatHistory,
    nata: AGENT_PERSONAS.nata.defaultChatHistory,
  });
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const persona = AGENT_PERSONAS[activePersonaId];
  const messages = chatMessages[activePersonaId];

  const renderAvatar = (id: AgentPersonId, size: number = 40) => {
    switch (id) {
      case "maya":
        return <AvatarMaya size={size} />;
      case "dimas":
        return <AvatarDimas size={size} />;
      case "arief":
        return <AvatarArief size={size} />;
      case "nata":
      default:
        return <AvatarNata size={size} />;
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      timestamp: timeStr,
    };

    setChatMessages((prev) => ({
      ...prev,
      [activePersonaId]: [...prev[activePersonaId], userMsg],
    }));
    if (!textToSend) setInputText("");

    // Simulate smart agent response with typing indicator
    setIsTyping(true);
    setTimeout(() => {
      let reply = "";
      if (activePersonaId === "maya") {
        reply = isEn
          ? `Noted! I have analyzed "${text}". The transaction is mapped to SAK EMKM canonical accounts and double-entry debits equal credits with 0 delta. Check the right panel for the verified journal.`
          : `Siap kak! Maya sudah baca pesan "${text}". Jurnal pembukuan sudah Maya siapkan sesuai SAK EMKM dan kedua sisi debit-kredit terbukti pas tanpa selisih. Rinciannya langsung tampil di panel kanan ya kak.`;
      } else if (activePersonaId === "dimas") {
        reply = isEn
          ? `Got it! Under PP 55/2022, I evaluated your query: "${text}". Your tax band remains protected and your final 0.5% liabilities are updated in the right panel.`
          : `Dimas catat kak! Sesuai PP 55/2022, perhitungan untuk "${text}" sudah Dimas evaluasi. Hak bebas pajak Rp 500 juta kakak tetap aman dan rincian pajaknya sudah diperbarui di panel sebelah kanan.`;
      } else if (activePersonaId === "arief") {
        reply = isEn
          ? `Understood! I cross-referenced "${text}" with the official BPS KBLI 2020 catalogue. Your permit checklist and OSS RBA risk requirements are documented on the right.`
          : `Baik kak! Pak Arief sudah mencocokkan "${text}" dengan taksonomi resmi KBLI 2020 BPS. Rekomendasi kode dan syarat izin OSS RBA kakak sudah siap di panel kanan ya.`;
      } else {
        reply = isEn
          ? `All set! I have routed "${text}" across Maya, Dimas, and Arief. The coordinated pipeline result has been synthesized on the right.`
          : `Beres kak! Nata sudah koordinasikan "${text}" ke Mbak Maya, Mas Dimas, dan Pak Arief. Seluruh alur kerja tim sudah sinkron di panel kanan.`;
      }

      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: "agent",
        text: reply,
        timestamp: timeStr,
      };

      setChatMessages((prev) => ({
        ...prev,
        [activePersonaId]: [...prev[activePersonaId], agentMsg],
      }));
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      <PageHeader
        title={isEn ? "Digital Finance Team" : "Tim Keuangan Digital"}
        subtitle={
          isEn
            ? "Chat with your personal staff handling bookkeeping, taxes, and licensing behind the scenes."
            : "Ngobrol santai dengan tim asisten pribadi Anda untuk urusan pembukuan, pajak, dan izin usaha."
        }
        badge={isEn ? "WhatsApp Style" : "Asisten WhatsApp"}
      />

      {/* 3-PANE WORKSPACE ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* PANE 1: LEFT SUB-SIDEBAR (STAFF LIST / CONTACTS) - 3 COLS */}
        <aside className="lg:col-span-3 space-y-3">
          <div className="rounded-xl border border-border/70 bg-card p-3 shadow-none">
            <div className="flex items-center justify-between pb-2.5 border-b border-border/50 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isEn ? "Your Staff" : "Daftar Asisten"}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono h-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                4 Online
              </Badge>
            </div>

            <div className="mt-2 space-y-1.5" role="list">
              {(Object.keys(AGENT_PERSONAS) as AgentPersonId[]).map((id) => {
                const item = AGENT_PERSONAS[id];
                const isSelected = activePersonaId === id;

                return (
                  <button
                    key={id}
                    onClick={() => setActivePersonaId(id)}
                    className={`w-full text-left rounded-lg p-2.5 transition-colors flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-medium shadow-none"
                        : "hover:bg-muted text-foreground border border-border/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        {renderAvatar(id, 36)}
                        <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold leading-tight">{item.name}</p>
                        <p className={`text-[11px] truncate ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {isEn ? item.titleEn : item.title}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${
                      isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {isEn ? item.badgeEn : item.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reassurance Banner */}
          <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 text-foreground font-semibold text-xs">
              <Shield className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isEn ? "Safe & Confidential" : "Aman & Rahasia"}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {isEn
                ? "All ledger math and legal citations are verified automatically with zero guesswork."
                : "Semua hitungan debit-kredit dan pasal hukum diverifikasi otomatis tanpa salah hitung."}
            </p>
          </div>
        </aside>

        {/* PANE 2: MIDDLE CONVERSATION STREAM (WHATSAPP CHAT) - 5 COLS */}
        <section className="lg:col-span-5 rounded-xl border border-border/70 bg-card flex flex-col h-[650px] shadow-none overflow-hidden">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-border/60 bg-muted/30 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                {renderAvatar(activePersonaId, 38)}
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight">{persona.name}</h3>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {isEn ? persona.statusTextEn : persona.statusText}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              {isEn ? persona.titleEn : persona.title}
            </Badge>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-muted/10">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-br-xs"
                        : "bg-card border border-border/70 text-foreground rounded-bl-xs shadow-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1 text-right ${
                        isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-1 px-2">
                <span className="size-1.5 rounded-full bg-primary animate-bounce" />
                <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] italic">
                  {persona.name} {isEn ? "is typing…" : "sedang mengetik…"}
                </span>
              </div>
            )}
          </div>

          {/* Quick Suggested Prompts Chips */}
          <div className="p-2 border-t border-border/40 bg-card flex gap-1.5 overflow-x-auto shrink-0">
            {persona.suggestedPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.prompt)}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-full border border-border/60 hover:bg-muted text-foreground transition-colors"
              >
                {isEn ? chip.labelEn : chip.label}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-border/60 bg-card flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                isEn
                  ? `Message ${persona.name}…`
                  : `Ketik pesan atau belanjaan ke ${persona.name}…`
              }
              className="flex-1 bg-muted/40 border border-border/60 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              size="sm"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="h-8 px-3 text-xs gap-1"
            >
              <Send className="size-3.5" />
            </Button>
          </div>
        </section>

        {/* PANE 3: RIGHT EXPLAINABLE RESULT & FLOWCHART (PROVENANCE CANVAS) - 4 COLS */}
        <section className="lg:col-span-4 space-y-4">
          {/* Active Verified Result Card */}
          <Card className="border-border/70 shadow-none">
            <CardHeader className="py-3.5 px-4 border-b border-border/40 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {isEn ? "Verified Result" : "Hasil Terverifikasi"}
                </span>
                <Badge variant="outline" className="text-[10px] font-mono bg-background">
                  {persona.activeArtifact.statutePill}
                </Badge>
              </div>
              <CardTitle className="text-sm font-semibold mt-1">
                {persona.activeArtifact.title}
              </CardTitle>
              <CardDescription className="text-xs">
                {persona.activeArtifact.summary}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                <span className="text-[10px] font-mono uppercase block">
                  {isEn ? "Audit Verified State" : "Status Pemeriksaan"}
                </span>
                <p className="text-base font-bold tracking-tight">
                  {persona.activeArtifact.highlight}
                </p>
              </div>

              <div className="space-y-1.5 text-xs">
                {persona.activeArtifact.details.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between py-1 border-b border-border/30 gap-2">
                    <span className="text-muted-foreground text-[11px] shrink-0">{item.key}</span>
                    <span className="font-medium text-foreground text-right text-[11px]">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Explainability Flowchart (Agent Thinking Chain) */}
          <Card className="border-border/70 shadow-none">
            <CardHeader className="py-3 px-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-primary" />
                <CardTitle className="text-xs font-semibold">
                  {isEn ? "Agent Thinking Flowchart" : "Bagan Alur Berpikir Asisten"}
                </CardTitle>
              </div>
              <CardDescription className="text-[11px]">
                {isEn ? "Explainable verification sequence" : "Transparansi langkah penentuan logika"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
                {persona.thinkingFlow.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-6 top-0.5 grid size-4 place-items-center rounded-full bg-emerald-500 text-white ring-4 ring-background text-[10px]">
                      <CheckCircle2 className="size-3" />
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground leading-snug">{step.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{step.detail}</p>
                      {step.statuteCitation && (
                        <span className="inline-block text-[10px] font-mono text-primary font-medium mt-0.5">
                          {step.statuteCitation}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
