"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Bot,
  Receipt,
  FileCheck2,
  TrendingUp,
  CheckCircle2,
  Store,
  Scale,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvatarNata, AvatarMaya, AvatarDimas, AvatarArief } from "@/components/agent-avatars";
import { useLanguage, copyEn, copyId } from "@/lib/copy";
import type { AcademyLesson } from "@/lib/academy";
import type { WalkthroughDeck } from "@/lib/academy-decks";

interface AcademyWalkthroughDeckProps {
  lesson: AcademyLesson | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AcademyWalkthroughDeckModal({
  lesson,
  open,
  onOpenChange,
}: AcademyWalkthroughDeckProps) {
  if (!lesson || !open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DeckModalContent key={lesson.id} lesson={lesson} />
    </Dialog>
  );
}

function DeckModalContent({ lesson }: { lesson: AcademyLesson }) {
  const { locale, copy } = useLanguage();
  const isEn = locale === "en";
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const deck = getDeckForLesson(lesson);
  const contentSlides = deck.slides;
  const totalSlides = contentSlides.length + 1; // Slide 0 = Title Slide, Slide 1..N = Content Slides
  const activeSlide = currentSlideIndex > 0 ? contentSlides[currentSlideIndex - 1] : null;

  const handlePrev = () => setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  const handleNext = () => setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));

  // Keyboard navigation: ArrowLeft, ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides]);

  const lessonCopy = copy.academy.lessons[lesson.id as keyof typeof copy.academy.lessons];

  return (
    <DialogContent className="max-w-6xl w-[96vw] max-h-[92vh] p-0 gap-0 border-border/70 shadow-2xl bg-card overflow-hidden rounded-2xl ring-1 ring-border/50">
      <DialogTitle className="sr-only">
        {deck.title[isEn ? "en" : "id"]}
      </DialogTitle>
      <DialogDescription className="sr-only">
        {deck.subtitle[isEn ? "en" : "id"]}
      </DialogDescription>

      {/* 16:9 Aspect Ratio Presentation Stage */}
      <div className="relative w-full aspect-video flex flex-col bg-background select-none overflow-hidden">
        {/* Slide Canvas: 16:9 PowerPoint style stage */}
        <div className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto md:overflow-hidden flex flex-col justify-center">
          {currentSlideIndex === 0 ? (
            /* First Page / Title Slide of PPTX */
            <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs md:text-sm font-medium text-primary shadow-2xs">
                <Sparkles className="size-4" />
                <span>Nata Walkthrough & Guide</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                  {deck.title[isEn ? "en" : "id"]}
                </h1>
                <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {deck.subtitle[isEn ? "en" : "id"]}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <Button
                  size="default"
                  className="rounded-xl px-6 font-medium shadow-xs cursor-pointer gap-2"
                  onClick={handleNext}
                >
                  <span>{isEn ? "Start Presentation" : "Mulai Tur Presentasi"}</span>
                  <ChevronRight className="size-4" />
                </Button>
                {lesson.actionLink && (
                  <Button asChild variant="outline" size="default" className="rounded-xl px-4 cursor-pointer gap-1.5">
                    <Link href={lesson.actionLink.href}>
                      <span>{copy.academy.actionButtons[lesson.actionLink.labelKey]}</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            /* Content Slides (2-Column Split: Narrative & Live Visual) */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center h-full">
              {/* Left Column (5 cols): Slide narrative */}
              <div className="md:col-span-5 flex flex-col justify-center space-y-4">
                <div>
                  <Badge variant="outline" className="text-xs font-medium bg-primary/5 text-primary border-primary/20 px-2.5 py-0.5">
                    {activeSlide?.badge[isEn ? "en" : "id"]}
                  </Badge>
                </div>

                <h2 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-foreground leading-snug">
                  {activeSlide?.title[isEn ? "en" : "id"]}
                </h2>

                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {activeSlide?.description[isEn ? "en" : "id"]}
                </p>

                {activeSlide?.highlight && (
                  <div className="rounded-xl border bg-tone-hijau-bg/40 border-tone-hijau/25 p-3.5 text-xs md:text-sm text-foreground flex items-start gap-2.5 shadow-2xs">
                    <CheckCircle2 className="size-4 text-tone-hijau shrink-0 mt-0.5" />
                    <span className="leading-snug">{activeSlide.highlight[isEn ? "en" : "id"]}</span>
                  </div>
                )}
              </div>

              {/* Right Column (7 cols): Visual Screen Stage */}
              <div className="md:col-span-7 h-full flex flex-col justify-center">
                <div className="relative rounded-2xl border bg-muted/20 p-5 md:p-6 lg:p-7 shadow-xs border-border/80 flex flex-col justify-center overflow-hidden min-h-[260px] md:min-h-[320px]">
                  {activeSlide?.renderVisual ? (
                    activeSlide.renderVisual()
                  ) : (
                    <DefaultFallbackVisual isEn={isEn} lessonTitle={lessonCopy?.title ?? ""} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Presentation Slide Footer / Presenter Bar */}
        <div className="px-6 py-3 border-t bg-muted/20 flex items-center justify-between gap-4 shrink-0">
          {/* Slide Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 cursor-pointer rounded-lg"
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              aria-label="Previous Slide"
            >
              <ChevronLeft className="size-4" />
            </Button>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5 px-1.5">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`size-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentSlideIndex
                      ? "w-8 bg-primary"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 cursor-pointer rounded-lg"
              onClick={handleNext}
              disabled={currentSlideIndex === totalSlides - 1}
              aria-label="Next Slide"
            >
              <ChevronRight className="size-4" />
            </Button>

            <span className="text-xs font-mono text-muted-foreground pl-1">
              {currentSlideIndex + 1} / {totalSlides}
            </span>
          </div>

          {/* Direct Handoff CTA */}
          <div className="flex items-center gap-2">
            {lesson.actionLink && (
              <Button asChild size="sm" className="h-8 text-xs md:text-sm px-3.5 gap-2 shadow-xs cursor-pointer rounded-lg">
                <Link href={lesson.actionLink.href}>
                  <span>{copy.academy.actionButtons[lesson.actionLink.labelKey]}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

// ── Built-in Walkthrough Decks ──────────────────────────────────────────────

function getDeckForLesson(lesson: AcademyLesson): WalkthroughDeck {
  switch (lesson.id) {
    case "plat_agents":
      return AGENTS_WALKTHROUGH_DECK;
    case "plat_multimodal":
      return MULTIMODAL_WALKTHROUGH_DECK;
    default:
      return createGenericWalkthroughDeck(lesson);
  }
}

/**
 * Deck 1: Autonomous Multi-Agent AI Staff (`plat_agents`)
 */
const AGENTS_WALKTHROUGH_DECK: WalkthroughDeck = {
  lessonId: "plat_agents",
  title: {
    id: "Tur Interaktif: Tim Staf Multi-Agen Otonom",
    en: "Interactive Tour: Autonomous Multi-Agent AI Staff",
  },
  subtitle: {
    id: "Bagaimana 4 AI spesialis Nata berkolaborasi menyelesaikan pencatatan tanpa saling tunggu",
    en: "How Nata's 4 specialized AIs collaborate atomically across accounting, tax, and licensing",
  },
  slides: [
    {
      id: "slide_nata_routing",
      badge: {
        id: "Langkah 1: Orkestrasi & Asisten Bisnis",
        en: "Step 1: Orchestration & Business Chief",
      },
      title: {
        id: "Mas Nata — Kepala Tim Finansial & Konsultasi Strategis",
        en: "Mas Nata — Chief of Staff & Strategic Copilot",
      },
      description: {
        id: "Mas Nata bertindak sebagai single-point-of-contact pemilik usaha. Saat Anda menanyakan hal bisnis, mengajukan transaksi, atau mensimulasikan order besar, Mas Nata mengorkestrasi agen spesialis lainnya di latar belakang.",
        en: "Mas Nata acts as the business owner's primary interface. Whenever you inquire, submit receipts, or simulate large deals, Mas Nata dispatches sub-tasks to the dedicated specialist agents in the background.",
      },
      highlight: {
        id: "Mendukung simulasi pesanan katering puluhan juta rupiah dan analisis kelayakan pinjaman KUR bank.",
        en: "Supports multi-million revenue deal simulations and bank KUR credit underwriting readiness checks.",
      },
      renderVisual: () => (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-xs">
            <AvatarNata size={44} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-foreground">Mas Nata</span>
                <span className="text-xs rounded-full bg-tone-hijau-bg px-2 py-0.5 font-medium text-tone-hijau">
                  Kepala Tim · Online
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Supervisi operasional bisnis & orkestrasi 3 asisten finansial
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border bg-card/60 p-2 text-center space-y-1">
              <span className="text-xs text-muted-foreground block">Latensi Respon</span>
              <span className="text-xs font-semibold text-foreground">~1.2 Detik</span>
            </div>
            <div className="rounded-lg border bg-card/60 p-2 text-center space-y-1">
              <span className="text-xs text-muted-foreground block">Sinkronisasi</span>
              <span className="text-xs font-semibold text-tone-hijau">Atomik (0 Desinkron)</span>
            </div>
            <div className="rounded-lg border bg-card/60 p-2 text-center space-y-1">
              <span className="text-xs text-muted-foreground block">Jalur Koordinasi</span>
              <span className="text-xs font-semibold text-primary">Keuangan → Fiskal → Legal</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "slide_maya_accounting",
      badge: {
        id: "Langkah 2: Akuntansi SAK EMKM",
        en: "Step 2: SAK EMKM Standard Accounting",
      },
      title: {
        id: "Mbak Maya — Akuntan Standar Baku SAK EMKM",
        en: "Mbak Maya — SAK EMKM Certified Bookkeeper",
      },
      description: {
        id: "Mbak Maya mengunci jurnal pembukuan berpasangan secara deterministik (Debit = Kredit). Setiap rupiah yang keluar dari kas langsung dialokasikan ke akun beban resmi tanpa risiko selisih angka.",
        en: "Mbak Maya deterministically locks double-entry ledger postings (Debit = Credit). Every rupiah leaving cash is mapped precisely to standard SAK EMKM accounts with zero variance.",
      },
      highlight: {
        id: "Strict guardrail: Jurnal tidak akan pernah diposting ke database jika Debit dan Kredit tidak seimbang 100%.",
        en: "Strict guardrail: Postings are permanently rejected if Debits and Credits do not balance 100%.",
      },
      renderVisual: () => (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-xs">
            <AvatarMaya size={44} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-foreground">Mbak Maya</span>
                <span className="text-xs rounded-full bg-tone-biru-bg px-2 py-0.5 font-medium text-tone-biru">
                  Spesialis Akuntansi
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Jurnal Berpasangan & Laporan Keuangan SAK EMKM
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-2.5 font-mono text-xs space-y-1">
            <div className="flex justify-between text-muted-foreground border-b pb-1">
              <span>Akun SAK EMKM</span>
              <span>Debit / Kredit</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>5-100 Beban Perlengkapan</span>
              <span className="font-medium text-tone-hijau">D: Rp 100.000</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>1-100 Kas Operasional</span>
              <span className="font-medium text-tone-hijau">K: Rp 100.000</span>
            </div>
            <div className="flex justify-between pt-1 border-t text-muted-foreground font-sans">
              <span className="text-tone-hijau font-medium">✓ Selisih Neraca: Rp 0 (Seimbang)</span>
              <span className="text-xs">Otomatis Terkunci</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "slide_dimas_tax",
      badge: {
        id: "Langkah 3: Pajak UMKM PP 55/2022",
        en: "Step 3: PP 55/2022 MSME Tax Guard",
      },
      title: {
        id: "Mas Dimas — Pengawal Batas Bebas Pajak 500 Juta",
        en: "Mas Dimas — Rp 500M Tax-Exempt Band Monitor",
      },
      description: {
        id: "Begitu transaksi dicatat Mbak Maya, Mas Dimas menerima operan data untuk mengaudit dampak pajaknya. Untuk Wajib Pajak Orang Pribadi, omzet hingga Rp 500 juta setahun bebas pajak (PPh Final 0%). Mas Dimas menghitung pajak flat 0,5% tepat saat omzet melewati ambang tersebut.",
        en: "As soon as transactions post, Mas Dimas inspects the fiscal impact. For individual MSMEs under PP 55/2022, turnover up to Rp 500 million is 100% tax-free. Dimas applies the flat 0.5% rate exclusively on turnover exceeding 500M.",
      },
      highlight: {
        id: "Pencegah denda telat bayar: Rutinitas pengingat kode billing otomatis tiap tanggal 15 bulan berjalan.",
        en: "Statutory deadline protection: Automated billing code reminders generated before the 15th of each month.",
      },
      renderVisual: () => (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-xs">
            <AvatarDimas size={44} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-foreground">Mas Dimas</span>
                <span className="text-xs rounded-full bg-tone-oranye-bg px-2 py-0.5 font-medium text-tone-oranye">
                  Spesialis Pajak
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                PP 55/2022 Pasal 60 (2) & PPh Final UMKM 0,5%
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-3 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Omzet Berjalan Th. 2026</span>
              <span className="font-semibold font-mono text-foreground">Rp 340.000.000 / Rp 500.000.000</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div className="bg-tone-hijau h-2 rounded-full w-[68%]" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Sisa Bebas Pajak: Rp 160.000.000</span>
              <span className="text-tone-hijau font-medium">Bebas PPh Final (0%)</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "slide_arief_licensing",
      badge: {
        id: "Langkah 4: Perizinan OSS-RBA & KBLI 2020",
        en: "Step 4: OSS-RBA & KBLI 2020 Compliance",
      },
      title: {
        id: "Pak Arief — Verifikator Legalitas & Kode KBLI",
        en: "Pak Arief — Licensing & KBLI 2020 Legal Verifier",
      },
      description: {
        id: "Pak Arief memastikan bisnis Anda beroperasi secara sah sesuai UU Cipta Kerja dan sistem OSS-RBA. Beliau memvalidasi 5 digit kode KBLI 2020 dari BPS/BKPM dan memandu sertifikasi standar (seperti SPP-IRT atau Sertifikasi Halal).",
        en: "Pak Arief guarantees business operations comply with OSS-RBA risk standards. He validates official 5-digit KBLI 2020 codes and guides required permits like Halal Self-Declare and P-IRT.",
      },
      highlight: {
        id: "Terhubung langsung dengan simulasi pembuatan izin NIB di menu Perizinan Usaha.",
        en: "Directly linked to the simulated NIB licensing workflow in the Licensing module.",
      },
      renderVisual: () => (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-xs">
            <AvatarArief size={44} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-foreground">Pak Arief</span>
                <span className="text-xs rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                  Spesialis Legalitas
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Perizinan Berusaha Berbasis Risiko (OSS-RBA) & KBLI 2020
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs font-mono text-primary">
                KBLI 47111
              </Badge>
              <span className="text-xs font-medium text-tone-hijau">Tingkat Risiko: Rendah</span>
            </div>
            <p className="text-xs font-medium text-foreground">
              Perdagangan Eceran Berbagai Macam Barang Yang Utamanya Makanan, Minuman, Atau Tembakau
            </p>
            <p className="text-xs text-muted-foreground">
              Izin Dasar Cukup NIB (Nomor Induk Berusaha) tanpa inspeksi lapangan rumit.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "slide_flow",
      badge: {
        id: "Langkah 5: Alur Orkestrasi Searah",
        en: "Step 5: Sequential Agent Cascade",
      },
      title: {
        id: "Koordinasi Multi-Agen Tanpa Hambatan",
        en: "Seamless Multi-Agent Coordination",
      },
      description: {
        id: "Data mengalir secara deterministik dari Nata -> Maya -> Dimas -> Arief. Tidak ada balapan proses (race conditions), dan tiap agen menjaga domain datanya sendiri secara atomik.",
        en: "Data flows deterministically from Nata -> Maya -> Dimas -> Arief. Zero race conditions, with each specialist strictly safeguarding its own domain.",
      },
      highlight: {
        id: "Arsitektur event-driven menjamin konsistensi ACID di database pembukuan.",
        en: "Event-driven architecture guarantees ACID consistency across ledger states.",
      },
      renderVisual: () => (
        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-lg border bg-card flex items-center justify-between">
            <span className="font-medium text-foreground">1. Input Struk & Suara</span>
            <span className="text-muted-foreground font-mono">Diterima Nata</span>
          </div>
          <div className="p-2.5 rounded-lg border bg-card flex items-center justify-between">
            <span className="font-medium text-foreground">2. Jurnal SAK EMKM</span>
            <span className="text-tone-biru font-mono">Diposting Maya</span>
          </div>
          <div className="p-2.5 rounded-lg border bg-card flex items-center justify-between">
            <span className="font-medium text-foreground">3. Audit PPh Final</span>
            <span className="text-tone-oranye font-mono">Dihitung Dimas</span>
          </div>
          <div className="p-2.5 rounded-lg border bg-card flex items-center justify-between">
            <span className="font-medium text-foreground">4. Verifikasi KBLI</span>
            <span className="text-primary font-mono">Divalidasi Arief</span>
          </div>
        </div>
      ),
    },
    {
      id: "slide_case_study",
      badge: {
        id: "Langkah 6: Skenario Riil UMKM",
        en: "Step 6: Real MSME Scenario",
      },
      title: {
        id: "Studi Kasus: Pembelian Kopi Mentah Rp 1.200.000",
        en: "Case Study: Raw Coffee Purchase Rp 1,200,000",
      },
      description: {
        id: "Saat kafe membeli biji kopi, Mbak Maya mencatat Persediaan Bahan Baku dan Kas Toko. Mas Dimas memeriksa batas bebas pajak PP 55, dan Pak Arief mencocokkannya ke rantai pasok KBLI 56303.",
        en: "When a cafe buys coffee beans, Maya posts Raw Materials and Cash. Dimas tracks the PP 55 threshold, and Arief checks supplier codes against KBLI 56303.",
      },
      highlight: {
        id: "Selesai dalam 3 detik tanpa pemilik usaha membuka software akuntansi rumit.",
        en: "Completed in 3 seconds without the owner ever opening a complex spreadsheet.",
      },
      renderVisual: () => (
        <div className="rounded-xl border bg-card p-3 space-y-2 text-xs">
          <div className="font-semibold text-foreground border-b pb-1">Kedai Seduh Nusantara (Bandung)</div>
          <div className="text-muted-foreground flex justify-between">
            <span>Nota Petani #882</span>
            <span className="font-mono text-foreground">Rp 1.200.000</span>
          </div>
          <div className="p-2 rounded bg-muted/40 font-mono text-xs space-y-1">
            <div className="flex justify-between"><span>(D) 1-130 Persediaan Biji Kopi</span><span>1.200.000</span></div>
            <div className="flex justify-between"><span>(K) 1-100 Kas Toko</span><span>1.200.000</span></div>
          </div>
          <div className="text-xs text-tone-hijau">✓ Audit Pajak: Valid · KBLI: Sesuai</div>
        </div>
      ),
    },
    {
      id: "slide_pitfalls",
      badge: {
        id: "Langkah 7: Kesalahan Umum",
        en: "Step 7: Common Pitfalls",
      },
      title: {
        id: "3 Jebakan Pembukuan Manual",
        en: "3 Biggest Manual Bookkeeping Errors",
      },
      description: {
        id: "Banyak pemilik bisnis terjebak mencatat nota di kertas yang gampang hilang, lupa memisahkan uang pribadi, dan terlambat bayar pajak hingga terbit surat denda bunga.",
        en: "Founders often record in notebooks that get lost, mix household cash with store revenue, and miss tax deadlines incurring monthly interest fines.",
      },
      highlight: {
        id: "Nata menghilangkan kesalahan manusiawi ini secara otomatis sejak hari pertama.",
        en: "Nata eliminates these human errors automatically from day one.",
      },
      renderVisual: () => (
        <div className="space-y-2 text-xs">
          <div className="rounded-lg border bg-destructive/10 border-destructive/20 p-2.5 text-foreground flex items-center gap-2">
            <AlertTriangle className="size-4 text-destructive shrink-0" />
            <span>Nota tercecer di laci kasir dan luntur setelah sebulan.</span>
          </div>
          <div className="rounded-lg border bg-destructive/10 border-destructive/20 p-2.5 text-foreground flex items-center gap-2">
            <AlertTriangle className="size-4 text-destructive shrink-0" />
            <span>Belanja dapur tercampur beban toko, merusak margin laba.</span>
          </div>
          <div className="rounded-lg border bg-destructive/10 border-destructive/20 p-2.5 text-foreground flex items-center gap-2">
            <AlertTriangle className="size-4 text-destructive shrink-0" />
            <span>Terlewat bayar PPh Final tanggal 15 hingga terbit STP denda.</span>
          </div>
        </div>
      ),
    },
    {
      id: "slide_compliance",
      badge: {
        id: "Langkah 8: Kepatuhan Hukum",
        en: "Step 8: Statutory Compliance",
      },
      title: {
        id: "Diselaraskan dengan Aturan Resmi RI",
        en: "Aligned with Official Indonesian Laws",
      },
      description: {
        id: "Nata dirancang berdasarkan perundang-undangan Republik Indonesia: SAK EMKM dari IAI, PP 55/2022 (pajak UMKM), UU Cipta Kerja, dan OSS-RBA BKPM.",
        en: "Nata is architected strictly upon active Indonesian laws: SAK EMKM (IAI), PP 55/2022 (MSME tax), Job Creation Act, and OSS-RBA licensing.",
      },
      highlight: {
        id: "Laporan keuangan langsung diakui analis bank untuk pengajuan KUR modal kerja.",
        en: "Financial statements are readily accepted by bank underwriters for KUR loans.",
      },
      renderVisual: () => (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl border bg-card text-center space-y-1">
            <Scale className="size-6 mx-auto text-primary" />
            <div className="font-semibold text-foreground">SAK EMKM</div>
            <div className="text-xs text-muted-foreground">Ikatan Akuntan Indonesia</div>
          </div>
          <div className="p-3 rounded-xl border bg-card text-center space-y-1">
            <ShieldCheck className="size-6 mx-auto text-tone-oranye" />
            <div className="font-semibold text-foreground">PP 55/2022</div>
            <div className="text-xs text-muted-foreground">Direktorat Jenderal Pajak</div>
          </div>
        </div>
      ),
    },
    {
      id: "slide_action_takeaway",
      badge: {
        id: "Langkah 9: Tindakan Nyata",
        en: "Step 9: Key Action",
      },
      title: {
        id: "Mulai Delegasikan Tugas Hari Ini",
        en: "Start Delegating Today",
      },
      description: {
        id: "Anda fokus pada kualitas produk dan kepuasan pelanggan. Biarkan tim agen digital Nata menjaga pembukuan, pajak, dan izin usaha Anda tetap rapi setiap hari.",
        en: "Focus on your customers and products. Let Nata's digital team keep your books, taxes, and licensing impeccable every single day.",
      },
      highlight: {
        id: "Buka menu Tim Agen untuk mencoba simulasi atau melihat status operasional agen.",
        en: "Navigate to the Agents page to explore simulations and view status.",
      },
      renderVisual: () => (
        <div className="rounded-xl border bg-card p-4 text-center space-y-2 shadow-xs">
          <CheckCircle2 className="size-9 mx-auto text-tone-hijau" />
          <div className="font-semibold text-xs text-foreground">Tim Siap Bekerja Untuk Anda</div>
          <div className="text-xs text-muted-foreground max-w-xs mx-auto">
            Semua catatan transaksi Anda akan langsung ditangani secara atomik oleh Nata, Maya, Dimas, dan Arief.
          </div>
        </div>
      ),
    },
  ],
};

/**
 * Deck 2: Multi-Modal Receipt & Text Recording (`plat_multimodal`)
 */
const MULTIMODAL_WALKTHROUGH_DECK: WalkthroughDeck = {
  lessonId: "plat_multimodal",
  title: {
    id: "Tur Interaktif: Ekstraksi Cepat Struk & Teks",
    en: "Interactive Tour: Fast Receipt & Text Extraction",
  },
  subtitle: {
    id: "Ubah foto struk buram dan catatan chat belanja menjadi jurnal akuntansi dalam 3 detik",
    en: "Turn receipt photos and casual WhatsApp notes into balanced accounting lines in 3 seconds",
  },
  slides: [
    {
      id: "slide_input_modes",
      badge: {
        id: "Langkah 1: Input Fleksibel",
        en: "Step 1: Flexible Input",
      },
      title: {
        id: "Pilih Cara Paling Cepat: Foto Struk atau Tempel Teks",
        en: "Pick What's Fastest: Snap a Receipt or Paste Chat Notes",
      },
      description: {
        id: "Pemilik usaha tidak perlu mengisi formulir panjang. Cukup foto struk belanjaan fisik, atau salin-tempel catatan pengeluaran harian dari percakapan WhatsApp toko Anda.",
        en: "Business owners skip tedious forms. Simply photograph paper receipts or copy-paste daily expense messages straight from WhatsApp.",
      },
      highlight: {
        id: "Mengenali nota tulis tangan pasar tradisional maupun struk kasir minimarket modern.",
        en: "Accurately parses both traditional handwritten receipts and modern supermarket prints.",
      },
      renderVisual: () => (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card p-3 text-center space-y-2 shadow-xs">
            <div className="grid size-9 mx-auto place-items-center rounded-lg bg-primary/10 text-primary">
              <Receipt className="size-4" />
            </div>
            <span className="text-xs font-semibold block text-foreground">Foto Struk / Nota</span>
            <span className="text-xs text-muted-foreground block">
              Kamera ponsel atau upload file JPG / PNG
            </span>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center space-y-2 shadow-xs">
            <div className="grid size-9 mx-auto place-items-center rounded-lg bg-tone-biru-bg text-tone-biru">
              <Bot className="size-4" />
            </div>
            <span className="text-xs font-semibold block text-foreground">Ketik / Salin Catatan</span>
            <span className="text-xs text-muted-foreground block">
              &quot;Beli ayam 10kg 560rb tunai di Pak Ujang&quot;
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "slide_extraction",
      badge: {
        id: "Langkah 2: Ekstraksi Vision AI",
        en: "Step 2: Vision AI Extraction",
      },
      title: {
        id: "Ekstraksi Deterministik Tanpa Salah Angka",
        en: "Deterministic Line-Item Extraction",
      },
      description: {
        id: "Model multimodal mengekstrak nama vendor, daftar item, harga satuan, potongan harga, serta metode bayar (Tunai, QRIS, Transfer Bank) secara otomatis.",
        en: "The multimodal engine extracts vendors, items, quantities, discounts, and payment rails (Cash, QRIS, Bank Transfer) instantly.",
      },
      highlight: {
        id: "Dilengkapi mekanisme verifikasi: Pengguna dapat mengonfirmasi nominal sebelum disimpan permanen.",
        en: "Built-in review: Verify amounts and line items before committing to permanent storage.",
      },
      renderVisual: () => (
        <div className="rounded-lg border bg-card p-3 space-y-2 shadow-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-xs font-semibold text-foreground">Hasil Ekstraksi Nota</span>
            <span className="text-xs text-tone-hijau font-medium">Tingkat Keyakinan: 99.4%</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mitra / Toko</span>
              <span className="font-medium text-foreground">Toko ATK Sentosa Jaya</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Barang</span>
              <span className="font-medium text-foreground">Kertas HVS A4 (2 Rim)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Nominal</span>
              <span className="font-semibold font-mono text-foreground">Rp 110.000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cara Pembayaran</span>
              <span className="text-primary font-medium">QRIS Dinamis</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "slide_posting",
      badge: {
        id: "Langkah 3: Jurnal Otomatis",
        en: "Step 3: Instant Ledger Posting",
      },
      title: {
        id: "Langsung Menjadi Jurnal SAK EMKM",
        en: "Automated SAK EMKM Journal Commit",
      },
      description: {
        id: "Data yang diekstraksi tidak sekadar disimpan sebagai teks mentah, melainkan langsung diposting ke Laporan Laba Rugi dan Neraca sesuai standar akuntansi UMKM Indonesia.",
        en: "Extracted figures are instantly committed as SAK EMKM journal entries, updating your Balance Sheet and Income Statement in real time.",
      },
      highlight: {
        id: "Siap diekspor ke Microsoft Excel dalam format standar perbankan Indonesia.",
        en: "Ready for export to Microsoft Excel in Indonesian banking standard format.",
      },
      renderVisual: () => (
        <div className="space-y-2">
          <div className="rounded-lg border bg-card p-3 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Jurnal Terkunci</span>
              <span className="text-xs rounded-full bg-tone-hijau-bg px-2 py-0.5 text-tone-hijau font-medium">
                Berimbang
              </span>
            </div>
            <div className="p-2 rounded bg-muted/30 font-mono text-xs space-y-1">
              <div className="flex justify-between">
                <span>(D) Beban Perlengkapan Kantor</span>
                <span className="text-tone-hijau">110.000</span>
              </div>
              <div className="flex justify-between">
                <span>(K) Kas / Bank</span>
                <span className="text-tone-hijau">110.000</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <span className="text-xs text-muted-foreground">
              ✓ Masuk ke Laporan Keuangan & Kalkulasi Pajak Tahun Berjalan
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "slide_handwritten_bon",
      badge: {
        id: "Langkah 4: Nota Pasar Tradisional",
        en: "Step 4: Handwritten Market Bills",
      },
      title: {
        id: "Mampu Membaca Nota Bon Tulis Tangan",
        en: "Accurately Reads Handwritten Carbon Bills",
      },
      description: {
        id: "Belanja di pasar induk atau grosir sering kali hanya diberi bon kertas merah/putih tulis tangan pensil atau pulpen. Vision AI Nata mengenali format nama barang, satuan kodi/kg, dan nominal rupiah.",
        en: "Buying from wholesale markets usually yields handwritten carbon receipts. Nata's Vision AI extracts item lines, kilogram weights, and rupiah totals.",
      },
      highlight: {
        id: "Telah diuji dengan ratusan variasi tulisan tangan bon toko kelontong Indonesia.",
        en: "Benchmarked on real handwritten carbon receipts from Indonesian traditional markets.",
      },
      renderVisual: () => (
        <div className="rounded-xl border bg-card p-3 space-y-2 text-xs">
          <div className="text-muted-foreground border-b pb-1 font-mono text-xs">Bon Toko Kelontong Berkah</div>
          <div className="space-y-1 text-foreground">
            <div className="flex justify-between"><span>Telur Ayam 15kg</span><span className="font-mono">Rp 390.000</span></div>
            <div className="flex justify-between"><span>Minyak Goreng 2 jerigen</span><span className="font-mono">Rp 310.000</span></div>
          </div>
          <div className="border-t pt-1 flex justify-between font-semibold text-tone-hijau">
            <span>Total Terekstraksi</span>
            <span className="font-mono">Rp 700.000</span>
          </div>
        </div>
      ),
    },
    {
      id: "slide_payment_rails",
      badge: {
        id: "Langkah 5: Klasifikasi Jalur Bayar",
        en: "Step 5: Payment Rails Tagging",
      },
      title: {
        id: "Deteksi Otomatis: Kasir, QRIS, atau Transfer",
        en: "Auto Tagging: Cash, QRIS, Bank Transfer",
      },
      description: {
        id: "Nata mendeteksi apakah pembayaran dilakukan lewat laci kasir (Tunai), QRIS statis/dinamis, atau debit bank. Memastikan rekonsiliasi kas di neraca akhir bulan akurat tanpa selisih.",
        en: "Nata identifies whether payments were completed via cash drawer, dynamic QRIS, or bank transfer, ensuring month-end cash reconciliation matches bank feeds.",
      },
      highlight: {
        id: "Saldo fisik kasir dan rekening bank selalu tercermin akurat di Neraca.",
        en: "Cash-in-drawer and bank balances stay perfectly synchronized in the balance sheet.",
      },
      renderVisual: () => (
        <div className="space-y-1.5 text-xs">
          <div className="p-2 rounded-lg border bg-card flex justify-between">
            <span className="text-foreground">Struk Minimarket Modern</span>
            <Badge variant="outline" className="text-xs text-tone-biru">QRIS Dinamis</Badge>
          </div>
          <div className="p-2 rounded-lg border bg-card flex justify-between">
            <span className="text-foreground">Toko Plastik Makmur</span>
            <Badge variant="outline" className="text-xs text-tone-hijau">Kas Tunai</Badge>
          </div>
          <div className="p-2 rounded-lg border bg-card flex justify-between">
            <span className="text-foreground">Invoice Supplier Daging</span>
            <Badge variant="outline" className="text-xs text-primary">Transfer BCA</Badge>
          </div>
        </div>
      ),
    },
    {
      id: "slide_tax_impact",
      badge: {
        id: "Langkah 6: Terhubung ke Pajak PP 55",
        en: "Step 6: PP 55 Tax Linkage",
      },
      title: {
        id: "Otomatis Memperbarui Odometer Pajak",
        en: "Real-Time Tax Odometer Update",
      },
      description: {
        id: "Jika nota yang dicatat adalah bukti penerimaan penjualan (omzet), angkanya langsung masuk ke odometer kuota bebas pajak Rp 500 juta milik Mas Dimas tanpa rekap bulanan manual.",
        en: "If the recorded bill is sales revenue, it immediately advances Mas Dimas's Rp 500M tax exemption odometer with zero manual tallying.",
      },
      highlight: {
        id: "Perhitungan PPh Final akhir tahun menjadi 100% transparan dan siap lapor.",
        en: "Year-end tax filings become completely transparent and audit-ready.",
      },
      renderVisual: () => (
        <div className="rounded-xl border bg-card p-3 space-y-1.5 text-xs">
          <div className="text-muted-foreground text-xs">Dampak ke PPh Final:</div>
          <div className="font-semibold text-foreground">+ Rp 450.000 ke Omzet Berjalan</div>
          <div className="text-xs text-tone-hijau">Masih dalam kuota bebas pajak (PPh terutang: Rp 0)</div>
        </div>
      ),
    },
    {
      id: "slide_digital_archive",
      badge: {
        id: "Langkah 7: Arsip Bukti Sah",
        en: "Step 7: Certified Digital Archive",
      },
      title: {
        id: "Bukti Struk Tersimpan Aman Digital",
        en: "Secure Digital Archive Under ITE Law",
      },
      description: {
        id: "Foto struk disimpan dalam format digital terkompresi dan ditautkan ke ID transaksi. Saat kantor pajak atau analis bank meminta bukti pengeluaran, Anda cukup mengunduhnya dalam 1 klik.",
        en: "Receipt photos are compressed and linked to transaction IDs. When tax auditors or bank underwriters ask for proof of purchase, export them in 1 click.",
      },
      highlight: {
        id: "Tidak perlu lagi menyimpan kardus berisi ratusan struk kertas berdebu.",
        en: "No more shoe boxes stuffed with dusty paper receipts.",
      },
      renderVisual: () => (
        <div className="rounded-xl border bg-card p-3 text-center space-y-2 text-xs">
          <ShieldCheck className="size-8 mx-auto text-primary" />
          <div className="font-semibold text-foreground">Arsip Bukti Transaksi Terenkripsi</div>
          <div className="text-xs text-muted-foreground">Tersimpan lokal & aman di peramban Anda.</div>
        </div>
      ),
    },
    {
      id: "slide_verification_guardrail",
      badge: {
        id: "Langkah 8: Verifikasi Sebelum Kunci",
        en: "Step 8: Pre-Commit Review",
      },
      title: {
        id: "Tinjau Akurasi Sebelum Masuk Buku",
        en: "Confidence Guardrail & Review",
      },
      description: {
        id: "Nata menampilkan kartu pratinjau dengan skor keyakinan ekstraksi. Anda dapat memverifikasi nominal sebelum transaksi diposting permanen ke Laporan Laba Rugi.",
        en: "Nata displays a preview card with extraction confidence scores. You verify quantities and prices before transactions commit permanently.",
      },
      highlight: {
        id: "Mencegah kesalahan ketik kelebihan nol (e.g. 50.000 vs 500.000).",
        en: "Prevents accidental extra zeros (e.g. 50,000 vs 500,000).",
      },
      renderVisual: () => (
        <div className="rounded-xl border bg-card p-3 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground">Hasil Ekstraksi Struk</span>
            <span className="text-tone-hijau text-xs font-medium">Akurasi 99.4%</span>
          </div>
          <div className="p-2 rounded bg-muted/40 text-xs text-muted-foreground space-y-1">
            <div>Vendor: Toko ATK Sentosa Jaya</div>
            <div>Item: Kertas HVS A4 (2 Rim) - Rp 110.000</div>
            <div>Pembayaran: QRIS Dinamis</div>
          </div>
        </div>
      ),
    },
    {
      id: "slide_multimodal_action",
      badge: {
        id: "Langkah 9: Kebiasaan Positif",
        en: "Step 9: Immediate Habit",
      },
      title: {
        id: "Catat Seketika Saat Uang Bergerak",
        en: "Record Instantly as Money Moves",
      },
      description: {
        id: "Kunci pembukuan sukses bukan software mahal, melainkan mencatat seketika saat uang berpindah tangan. Buka menu Catat Cepat setiap kali Anda menerima nota belanja.",
        en: "The secret to healthy books isn't expensive software—it's logging expenses the instant money moves. Open Quick Record whenever you receive a receipt.",
      },
      highlight: {
        id: "Hanya butuh 3 detik per struk belanjaan untuk menjaga bisnis siap audit.",
        en: "Takes just 3 seconds per receipt to keep your enterprise audit-ready.",
      },
      renderVisual: () => (
        <div className="rounded-xl border bg-card p-4 text-center space-y-2 shadow-xs">
          <TrendingUp className="size-8 mx-auto text-tone-hijau" />
          <div className="font-semibold text-xs text-foreground">Pembukuan Rapih Dimulai Hari Ini</div>
          <div className="text-xs text-muted-foreground max-w-xs mx-auto">
            Hanya butuh 3 detik per struk belanjaan untuk menjaga bisnis Anda siap audit dan siap kredit bank.
          </div>
        </div>
      ),
    },
  ],
};

function createGenericWalkthroughDeck(lesson: AcademyLesson): WalkthroughDeck {
  const en = copyEn.academy.lessons[lesson.id as keyof typeof copyEn.academy.lessons];
  const id = copyId.academy.lessons[lesson.id as keyof typeof copyId.academy.lessons];

  const titleId = id?.title ?? "Panduan Platform Nata";
  const titleEn = en?.title ?? "Nata Platform Guide";
  const summaryId = id?.summary ?? "Pelajari standar operasional dan alur otomasi Nata.";
  const summaryEn = en?.summary ?? "Master Nata's operational standards and automated workflows.";
  const contentId = id?.content ?? summaryId;
  const contentEn = en?.content ?? summaryEn;
  const statute = lesson.statuteCitation ?? "SAK EMKM & Standar Regulasi Bisnis RI";

  return {
    lessonId: lesson.id,
    title: {
      id: titleId,
      en: titleEn,
    },
    subtitle: {
      id: summaryId,
      en: summaryEn,
    },
    slides: [
      {
        id: "slide_1_concept",
        badge: {
          id: "1. Konsep Dasar & Latar Belakang",
          en: "1. Core Grounding & Concept",
        },
        title: {
          id: titleId,
          en: titleEn,
        },
        description: {
          id: contentId,
          en: contentEn,
        },
        highlight: {
          id: `Landasan Pokok: ${statute}`,
          en: `Foundational Standard: ${statute}`,
        },
        renderVisual: () => (
          <div className="space-y-3 p-2">
            <div className="rounded-xl border bg-card p-4 text-center space-y-2 shadow-2xs">
              <FileCheck2 className="size-8 mx-auto text-primary" />
              <span className="text-xs md:text-sm font-semibold block text-foreground">{titleId}</span>
              <span className="text-xs text-muted-foreground block max-w-sm mx-auto leading-relaxed">
                {summaryId}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/30 font-mono text-xs text-muted-foreground text-center">
              § {statute}
            </div>
          </div>
        ),
      },
      {
        id: "slide_2_statute",
        badge: {
          id: "2. Kerangka Hukum & Regulasi RI",
          en: "2. Legal & Regulatory Framework",
        },
        title: {
          id: "Kepatuhan Hukum Terverifikasi",
          en: "Verified Statutory Compliance",
        },
        description: {
          id: `Modul ini mengacu langsung pada ${statute}. Memastikan setiap langkah pembukuan dan operasional usaha Anda memiliki dasar legalitas yang kuat di hadapan otoritas resmi.`,
          en: `This module adheres strictly to ${statute}, ensuring every operational and bookkeeping action holds verified legal authority before tax and banking regulators.`,
        },
        highlight: {
          id: "Mencegah surat teguran pajak (SP2DK) dan sanksi denda administratif.",
          en: "Protects against tax clarification notices (SP2DK) and administrative penalties.",
        },
        renderVisual: () => (
          <div className="rounded-xl border bg-card p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-tone-oranye font-medium border-b pb-1.5">
              <Scale className="size-4 shrink-0" />
              <span>Dasar Hukum Resmi Republik Indonesia</span>
            </div>
            <div className="p-2.5 rounded bg-muted/40 font-mono text-xs text-foreground leading-relaxed">
              {statute}
            </div>
            <div className="text-xs text-muted-foreground">
              ✓ Telah diselaraskan dengan pembaruan regulasi DJP dan OSS-RBA BKPM terbaru.
            </div>
          </div>
        ),
      },
      {
        id: "slide_3_scenario",
        badge: {
          id: "3. Penerapan Nyata UMKM",
          en: "3. Real-World MSME Scenario",
        },
        title: {
          id: "Implementasi pada Aktivitas Usaha Harian",
          en: "Daily Commercial Implementation",
        },
        description: {
          id: "Bagaimana standar ini bekerja saat toko membuka kasir di pagi hari, menerima pesanan pelanggan, membayar nota supplier, hingga merekonsiliasi penerimaan QRIS di malam hari.",
          en: "How this standard functions when opening cash drawers, receiving customer orders, settling supplier invoices, and reconciling QRIS payouts at closing.",
        },
        highlight: {
          id: "Mengubah kerumitan pasal hukum menjadi prosedur kerja harian yang ringkas.",
          en: "Translates complex statutory text into lightweight daily routines.",
        },
        renderVisual: () => (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl border bg-card text-center space-y-1.5 shadow-2xs">
              <Store className="size-6 mx-auto text-primary" />
              <div className="font-semibold text-foreground">Operasional Kasir</div>
              <div className="text-xs text-muted-foreground">Pencatatan nota seketika</div>
            </div>
            <div className="p-3 rounded-xl border bg-card text-center space-y-1.5 shadow-2xs">
              <TrendingUp className="size-6 mx-auto text-tone-hijau" />
              <div className="font-semibold text-foreground">Buku SAK EMKM</div>
              <div className="text-xs text-muted-foreground">Siap audit bank & kredit KUR</div>
            </div>
          </div>
        ),
      },
      {
        id: "slide_4_accounting_post",
        badge: {
          id: "4. Akuntansi SAK EMKM",
          en: "4. SAK EMKM Accounting",
        },
        title: {
          id: "Pencatatan Berpasangan Terkunci",
          en: "Locked Double-Entry Posting",
        },
        description: {
          id: "Setiap transaksi otomatis dialokasikan ke bagan akun standar SAK EMKM (Aset, Kewajiban, Ekuitas, Pendapatan, Beban). Tidak ada angka yang melayang tanpa pasangan jurnal seimbang.",
          en: "Transactions map automatically to standard SAK EMKM accounts (Assets, Liabilities, Equity, Revenue, Expenses) with guaranteed double-entry equilibrium.",
        },
        highlight: {
          id: "Prinsip keseimbangan neraca (Debit = Kredit) terjaga 100% tanpa selisih.",
          en: "Balance sheet equilibrium (Debit = Credit) preserved 100% with zero variance.",
        },
        renderVisual: () => (
          <div className="rounded-xl border bg-card p-3 space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b pb-1 font-sans text-muted-foreground text-xs">
              <span>Persamaan Dasar Akuntansi</span>
              <span>Status</span>
            </div>
            <div className="flex justify-between text-foreground"><span>Aset (Kas + Piutang + Stok)</span><span>100%</span></div>
            <div className="flex justify-between text-foreground"><span>Kewajiban + Ekuitas Modal</span><span>100%</span></div>
            <div className="pt-1 border-t flex justify-between font-bold text-tone-hijau"><span>Selisih Neraca</span><span>Rp 0 (Seimbang)</span></div>
          </div>
        ),
      },
      {
        id: "slide_5_pitfalls",
        badge: {
          id: "5. Jebakan & Kesalahan Umum",
          en: "5. Pitfalls to Avoid",
        },
        title: {
          id: "Kekeliruan Fatal yang Wajib Dihindari",
          en: "Critical Mistakes to Avoid",
        },
        description: {
          id: "Banyak pemilik bisnis terjebak mencatat pengeluaran di nota yang gampang hilang, lupa memisahkan uang pribadi, atau terlambat menyetor pajak hingga terbit surat denda bunga.",
          en: "Many founders postpone receipt entry until receipts fade, mix household cash with store revenue, or miss statutory deadlines triggering interest penalties.",
        },
        highlight: {
          id: "Otomasi sistem Nata menghilangkan 99% potensi kelalaian manusiawi.",
          en: "Nata's automated guardrails cut human negligence by 99%.",
        },
        renderVisual: () => (
          <div className="space-y-2 text-xs">
            <div className="rounded-lg border bg-destructive/10 border-destructive/20 p-2.5 text-foreground flex items-center gap-2">
              <AlertTriangle className="size-4 text-destructive shrink-0" />
              <span>Nota tercecer di laci dan luntur setelah beberapa minggu.</span>
            </div>
            <div className="rounded-lg border bg-destructive/10 border-destructive/20 p-2.5 text-foreground flex items-center gap-2">
              <AlertTriangle className="size-4 text-destructive shrink-0" />
              <span>Belanja pribadi tercampur kas toko, merusak margin laba.</span>
            </div>
            <div className="rounded-lg border bg-destructive/10 border-destructive/20 p-2.5 text-foreground flex items-center gap-2">
              <AlertTriangle className="size-4 text-destructive shrink-0" />
              <span>Terlewat bayar pajak tanggal 15 hingga kena sanksi bunga denda.</span>
            </div>
          </div>
        ),
      },
      {
        id: "slide_6_agents",
        badge: {
          id: "6. Otomasi Staf AI Nata",
          en: "6. Nata AI Staff Automation",
        },
        title: {
          id: "Dikerjakan Otomatis oleh 4 Agen Spesialis",
          en: "Automated by 4 AI Specialists",
        },
        description: {
          id: "Anda tidak perlu menghafal pasal hukum atau mendalami jurnal debet kredit. Mas Nata, Mbak Maya, Mas Dimas, dan Pak Arief berkolaborasi di latar belakang untuk membereskan pencatatan.",
          en: "Skip memorizing tax statutes or ledger debits. Mas Nata, Mbak Maya, Mas Dimas, and Pak Arief collaborate in the background to keep books pristine.",
        },
        highlight: {
          id: "Alur kerja atomik terisolasi: Akuntansi -> Pajak -> Legalitas Perizinan.",
          en: "Isolated atomic workflow: Accounting -> Taxation -> Legal Licensing.",
        },
        renderVisual: () => (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border bg-card text-center space-y-1">
              <AvatarMaya size={32} className="mx-auto" />
              <div className="font-semibold text-foreground">Mbak Maya</div>
              <div className="text-xs text-tone-biru">Jurnal SAK EMKM</div>
            </div>
            <div className="p-2.5 rounded-lg border bg-card text-center space-y-1">
              <AvatarDimas size={32} className="mx-auto" />
              <div className="font-semibold text-foreground">Mas Dimas</div>
              <div className="text-xs text-tone-oranye">Audit PPh Final 0,5%</div>
            </div>
          </div>
        ),
      },
      {
        id: "slide_7_bank_readiness",
        badge: {
          id: "7. Kesiapan Audit & Kredit KUR",
          en: "7. Audit & Bank KUR Readiness",
        },
        title: {
          id: "Membuka Akses Permodalan Perbankan",
          en: "Unlocking Bank Capital & Credit",
        },
        description: {
          id: "Pembukuan yang rapi sesuai SAK EMKM menjadi syarat mutlak lolos verifikasi kredit usaha bank (KUR BRI, Mandiri, BNI). Analis kredit langsung memvalidasi laporan keuangan Anda tanpa ragu.",
          en: "Pristine SAK EMKM records are mandatory for bank KUR credit approvals. Credit analysts immediately verify your financial standing with high confidence.",
        },
        highlight: {
          id: "Meningkatkan rasio persetujuan pinjaman modal kerja hingga 3x lipat.",
          en: "Boosts working capital loan approval odds by up to 3x.",
        },
        renderVisual: () => (
          <div className="rounded-xl border bg-tone-hijau-bg/40 border-tone-hijau/25 p-3 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-tone-hijau font-semibold">
              <CheckCircle2 className="size-4" />
              <span>Standar Laporan Diterima Perbankan Nasional</span>
            </div>
            <div className="text-xs text-foreground leading-relaxed">
              Laporan Posisi Keuangan, Laba Rugi, dan Catatan atas Laporan Keuangan (CALK) otomatis sinkron dan siap diekspor ke format Excel perbankan.
            </div>
          </div>
        ),
      },
      {
        id: "slide_8_financial_discipline",
        badge: {
          id: "8. Disiplin Finansial",
          en: "8. Financial Health",
        },
        title: {
          id: "Transparansi Arus Kas & Pertumbuhan Laba",
          en: "Cash Flow Visibility & Profit Growth",
        },
        description: {
          id: "Dengan pencatatan yang tertib, Anda tahu persis berapa margin kotor setiap produk, kapan kas toko menipis, dan berapa keuntungan bersih yang bisa ditarik secara aman sebagai dividen pribadi.",
          en: "Disciplined tracking provides exact gross margins per SKU, alerts on cash dips, and clarifies how much net profit can be safely withdrawn as personal drawings.",
        },
        highlight: {
          id: "Menghindari kebangkrutan tersembunyi akibat arus kas yang bocor.",
          en: "Prevents hidden insolvency resulting from unnoticed cash leaks.",
        },
        renderVisual: () => (
          <div className="space-y-1.5 text-xs">
            <div className="p-2 rounded-lg border bg-card flex justify-between">
              <span className="text-muted-foreground">Kesehatan Arus Kas:</span>
              <span className="font-semibold text-tone-hijau">Positif & Terverifikasi</span>
            </div>
            <div className="p-2 rounded-lg border bg-card flex justify-between">
              <span className="text-muted-foreground">Margin Operasional:</span>
              <span className="font-semibold text-foreground">Terukur Akurat</span>
            </div>
            <div className="p-2 rounded-lg border bg-card flex justify-between">
              <span className="text-muted-foreground">Status Pajak Tahun Berjalan:</span>
              <span className="font-semibold text-tone-oranye">Patuh PP 55/2022</span>
            </div>
          </div>
        ),
      },
      {
        id: "slide_9_action",
        badge: {
          id: "9. Langkah Aksi & Integrasi",
          en: "9. Key Action & Integration",
        },
        title: {
          id: "Terapkan Sekarang di Pembukuan Anda",
          en: "Apply Instantly in Your Ledger",
        },
        description: {
          id: "Fitur ini terintegrasi penuh ke dalam dashboard, laporan keuangan SAK EMKM, dan modul pajak Nata. Klik tombol aksi di kanan bawah untuk langsung membuka simulator atau modul terkait.",
          en: "This feature is fully wired into your live dashboard, SAK EMKM statements, and tax monitor. Click the action button at bottom-right to test this live.",
        },
        highlight: {
          id: "Mulai biasakan mencatat transaksi seketika saat uang berpindah tangan.",
          en: "Adopt the habit of recording transactions the moment funds exchange hands.",
        },
        renderVisual: () => (
          <div className="rounded-xl border bg-card p-4 text-center space-y-2 shadow-xs">
            <CheckCircle2 className="size-8 mx-auto text-tone-hijau" />
            <span className="text-xs font-semibold block text-foreground">Siap Diterapkan</span>
            <span className="text-xs text-muted-foreground block max-w-xs mx-auto leading-relaxed">
              Semua instrumen dan asisten AI Nata siap mengawal pembukuan dan kepatuhan usaha Anda.
            </span>
          </div>
        ),
      },
    ],
  };
}

function DefaultFallbackVisual({ isEn, lessonTitle }: { isEn: boolean; lessonTitle: string }) {
  return (
    <div className="text-center space-y-2 p-4">
      <Bot className="size-8 mx-auto text-primary" />
      <span className="text-xs font-semibold block text-foreground">{lessonTitle}</span>
      <span className="text-xs text-muted-foreground block">
        {isEn
          ? "Interactive visual walkthrough for this module is ready."
          : "Tur visual interaktif untuk modul ini sudah siap ditinjau."}
      </span>
    </div>
  );
}
