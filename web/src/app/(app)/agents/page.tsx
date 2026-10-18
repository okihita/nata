"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  CheckCircle2,
  Sparkles,
  Shield,
  FileText,
  Image as ImageIcon,
  X,
  Upload,
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

  // Mas Nata (Chief of Staff) is on top as default
  const [activePersonaId, setActivePersonaId] = useState<AgentPersonId>("nata");
  const [chatMessages, setChatMessages] = useState<Record<AgentPersonId, ChatMessage[]>>({
    nata: AGENT_PERSONAS.nata.defaultChatHistory,
    maya: AGENT_PERSONAS.maya.defaultChatHistory,
    dimas: AGENT_PERSONAS.dimas.defaultChatHistory,
    arief: AGENT_PERSONAS.arief.defaultChatHistory,
  });
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; type: "image" | "pdf" | "doc" }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const persona = AGENT_PERSONAS[activePersonaId];
  const messages = chatMessages[activePersonaId];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments = Array.from(files).map((file) => {
      const isPdf = file.name.toLowerCase().endsWith(".pdf");
      const isImg = file.type.startsWith("image/");
      return {
        name: file.name,
        type: isPdf ? ("pdf" as const) : isImg ? ("image" as const) : ("doc" as const),
      };
    });

    setAttachedFiles((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    if (!text && attachedFiles.length === 0) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: text || (isEn ? "Uploaded attachment for analysis" : "Melampirkan dokumen untuk diperiksa"),
      timestamp: timeStr,
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    };

    setChatMessages((prev) => ({
      ...prev,
      [activePersonaId]: [...prev[activePersonaId], userMsg],
    }));

    if (!textToSend) setInputText("");
    setAttachedFiles([]);

    setIsTyping(true);
    setTimeout(() => {
      let reply = "";
      if (activePersonaId === "nata") {
        reply = isEn
          ? `All set! I have reviewed "${text || "your attachment"}" and coordinated with Maya, Dimas, and Arief. Everything is verified and balanced in the right panel.`
          : `Beres kak! Nata sudah koordinasikan "${text || "lampiran Anda"}" ke Mbak Maya, Mas Dimas, dan Pak Arief. Seluruh alur kerja tim sudah sinkron di panel kanan.`;
      } else if (activePersonaId === "maya") {
        reply = isEn
          ? `Noted! I have analyzed "${text || "your attachment"}". Debit and credit entries match to the exact rupiah with 0 delta. Check the verified journal on the right.`
          : `Siap kak! Maya sudah baca pesan "${text || "lampiran Anda"}". Jurnal pembukuan sudah disiapkan dan kedua sisi debit-kredit terbukti pas tanpa selisih. Rinciannya langsung tampil di panel kanan.`;
      } else if (activePersonaId === "dimas") {
        reply = isEn
          ? `Got it! Under government tax rules, I evaluated "${text || "your numbers"}". Your tax-free band remains protected and your final 0.5% calculation is on the right.`
          : `Dimas catat kak! Sesuai aturan perpajakan, perhitungan untuk "${text || "data omzet Anda"}" sudah dievaluasi. Hak bebas pajak Rp 500 juta kakak tetap aman dan rinciannya sudah tampil di sebelah kanan.`;
      } else {
        reply = isEn
          ? `Understood! I cross-referenced "${text || "your inquiry"}" with the official government business classification. Your permit checklist is documented on the right.`
          : `Baik kak! Pak Arief sudah mencocokkan "${text || "pertanyaan Anda"}" dengan klasifikasi resmi pemerintah. Syarat izin usaha kakak sudah siap di panel kanan.`;
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
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="shrink-0 mb-4">
        <PageHeader
          title={isEn ? "Digital Finance Team" : "Tim Keuangan Digital"}
          subtitle={
            isEn
              ? "Your personal staff handling bookkeeping, taxes, and licensing behind the scenes."
              : "Tim asisten pribadi yang bekerja otomatis merapikan pembukuan, pajak, dan izin usaha Anda."
          }
        />
      </div>

      {/* 3-PANE WORKSPACE ARCHITECTURE (FULL HEIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1 min-h-0">
        {/* PANE 1: LEFT SUB-SIDEBAR (STAFF LIST) - 3 COLS */}
        <aside className="lg:col-span-3 flex flex-col gap-3 h-full overflow-hidden">
          <div className="rounded-xl border border-border/70 bg-card p-3 shadow-none flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-2.5 border-b border-border/50 px-1 shrink-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isEn ? "Staff Directory" : "Daftar Asisten"}
              </span>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                4 Aktif
              </span>
            </div>

            <div className="mt-2 space-y-1.5 overflow-y-auto flex-1 pr-0.5" role="list">
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

          {/* Peace of Mind Note */}
          <div className="rounded-xl border border-border/70 bg-muted/20 p-3 shrink-0 text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5 text-foreground font-semibold text-xs">
              <Shield className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isEn ? "Quietly Automated" : "Bekerja di Belakang Layar"}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {isEn
                ? "You focus on sales. Nata takes care of ledger balances and tax math automatically."
                : "Anda fokus jualan. Nata yang membereskan hitungan pembukuan dan pajaknya."}
            </p>
          </div>
        </aside>

        {/* PANE 2: MIDDLE CONVERSATION STREAM (GEMINI / CHATGPT STYLE INPUT) - 5 COLS */}
        <section className="lg:col-span-5 rounded-xl border border-border/70 bg-card flex flex-col h-full shadow-none overflow-hidden">
          {/* Header */}
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
            <span className="text-[11px] text-muted-foreground font-medium">
              {isEn ? persona.titleEn : persona.title}
            </span>
          </div>

          {/* Messages Feed */}
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
                    {/* Attachment chips if uploaded */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {msg.attachments.map((att, i) => (
                          <span
                            key={i}
                            className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-mono ${
                              isUser ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-foreground"
                            }`}
                          >
                            {att.type === "image" ? <ImageIcon className="size-3" /> : <FileText className="size-3" />}
                            <span className="truncate max-w-[120px]">{att.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
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
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
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

          {/* Gemini / ChatGPT Style Text Input Box */}
          <div className="p-3 border-t border-border/60 bg-card shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,application/pdf"
              className="hidden"
            />

            <div className="rounded-2xl border border-border/80 bg-muted/20 focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/50 transition-all p-2.5 space-y-2">
              {/* Attachment Preview Chips */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {attachedFiles.map((att, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1.5 text-[11px] bg-muted px-2 py-1 rounded-lg border border-border/50 text-foreground"
                    >
                      {att.type === "image" ? <ImageIcon className="size-3 text-primary" /> : <FileText className="size-3 text-primary" />}
                      <span className="truncate max-w-[130px] font-medium">{att.name}</span>
                      <button
                        onClick={() => handleRemoveAttachment(idx)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <textarea
                rows={2}
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
                    ? `Ask ${persona.name} or upload receipts, invoices, tax files…`
                    : `Tanya ${persona.name} atau unggah nota, faktur, file pajak…`
                }
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1 border-t border-border/30">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1.5 rounded-lg"
                >
                  <Paperclip className="size-3.5" />
                  <span className="text-[11px]">{isEn ? "Attach file / photo" : "Unggah struk / file"}</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() && attachedFiles.length === 0}
                  className="size-7 p-0 rounded-full shrink-0"
                >
                  <Send className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* PANE 3: RIGHT RESULTS & THINKING FLOWCHART - 4 COLS */}
        <section className="lg:col-span-4 flex flex-col gap-4 h-full overflow-y-auto">
          {/* Active Verified Result Card */}
          <Card className="border-border/70 shadow-none shrink-0">
            <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {isEn ? "Verified Result" : "Hasil Terverifikasi"}
                </span>
                <span className="text-[10px] font-medium bg-background px-2 py-0.5 rounded border border-border/60">
                  {persona.activeArtifact.statutePill}
                </span>
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
                <span className="text-[10px] uppercase font-semibold block">
                  {isEn ? "Inspection Status" : "Status Pemeriksaan"}
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
          <Card className="border-border/70 shadow-none flex-1">
            <CardHeader className="py-3 px-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-primary" />
                <CardTitle className="text-xs font-semibold">
                  {isEn ? "How Your Assistant Verified This" : "Cara Asisten Menghitung Ini"}
                </CardTitle>
              </div>
              <CardDescription className="text-[11px]">
                {isEn ? "Step-by-step verified reasoning" : "Langkah pemeriksaan otomatis tanpa salah hitung"}
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
                        <span className="inline-block text-[10px] text-primary font-medium mt-0.5">
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
    </div>
  );
}
