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
import { useLanguage } from "@/lib/copy";
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

  const deck = getDeckForLesson(lesson.id);
  const slides = deck.slides;
  const activeSlide = slides[currentSlideIndex] ?? null;

  const totalSlides = slides.length;

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
      {/* 16:9 Aspect Ratio Presentation Stage */}
      <div className="relative w-full aspect-video flex flex-col bg-background select-none overflow-hidden">
        {/* Presentation Slide Header / Ribbon */}
        <div className="px-6 py-3.5 border-b bg-muted/20 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-10">
            <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Sparkles className="size-4" />
            </span>
            <DialogTitle className="text-sm font-semibold text-foreground truncate">
              {deck.title[isEn ? "en" : "id"]}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground hidden md:inline truncate m-0">
              · {deck.subtitle[isEn ? "en" : "id"]}
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0 pr-6">
            <Badge variant="outline" className="text-xs font-mono bg-muted/50 border-border/70 px-2.5 py-0.5">
              {currentSlideIndex + 1} / {totalSlides}
            </Badge>
          </div>
        </div>

        {/* Slide Canvas: 2-Column Split (Left: Narrative & Key Takeaways, Right: Live Visual Stage) */}
        <div className="flex-1 p-6 md:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center overflow-y-auto md:overflow-hidden">
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
              {slides.map((_, idx) => (
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

function getDeckForLesson(lessonId: string): WalkthroughDeck {
  switch (lessonId) {
    case "plat_agents":
      return AGENTS_WALKTHROUGH_DECK;
    case "plat_multimodal":
      return MULTIMODAL_WALKTHROUGH_DECK;
    default:
      return createGenericWalkthroughDeck(lessonId);
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
  ],
};

/**
 * Generic Fallback Deck for other lessons
 */
function createGenericWalkthroughDeck(lessonId: string): WalkthroughDeck {
  return {
    lessonId,
    title: {
      id: "Panduan Fitur & Alur Kerja Nata",
      en: "Feature Walkthrough & Workflow Guide",
    },
    subtitle: {
      id: "Langkah demi langkah memahami kemampuan platform Nata",
      en: "Step-by-step walkthrough of Nata platform capabilities",
    },
    slides: [
      {
        id: "slide_1",
        badge: {
          id: "Langkah 1: Inisiasi",
          en: "Step 1: Initiation",
        },
        title: {
          id: "Pahami Dasar & Aturan Kepatuhan",
          en: "Understand the Statutory Grounding",
        },
        description: {
          id: "Nata dibangun berbasis standar baku Indonesia: SAK EMKM untuk akuntansi, PP 55/2022 untuk perpajakan, dan OSS-RBA untuk legalitas perizinan.",
          en: "Nata is grounded in Indonesian statutory standards: SAK EMKM for bookkeeping, PP 55/2022 for taxation, and OSS-RBA for licensing.",
        },
        renderVisual: () => (
          <div className="rounded-lg border bg-card p-4 text-center space-y-2">
            <FileCheck2 className="size-8 mx-auto text-primary" />
            <span className="text-xs font-semibold block text-foreground">Standar Baku Kepatuhan</span>
            <span className="text-xs text-muted-foreground block">
              Menjaga usaha dari salah hitung pajak dan risiko audit
            </span>
          </div>
        ),
      },
      {
        id: "slide_2",
        badge: {
          id: "Langkah 2: Eksekusi",
          en: "Step 2: Execution",
        },
        title: {
          id: "Otomasi Tanpa Hambatan",
          en: "Seamless Automation",
        },
        description: {
          id: "Gunakan fitur langsung dari menu navigasi. Semua hasil kalkulasi diperbarui seketika dan tersinkronisasi di dashboard.",
          en: "Execute features directly from the navigation menu. Calculations sync immediately across the entire dashboard.",
        },
        renderVisual: () => (
          <div className="rounded-lg border bg-card p-4 text-center space-y-2">
            <TrendingUp className="size-8 mx-auto text-tone-hijau" />
            <span className="text-xs font-semibold block text-foreground">Sinkronisasi Real-Time</span>
            <span className="text-xs text-muted-foreground block">
              Laporan laba rugi dan posisi keuangan selalu terkini
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
