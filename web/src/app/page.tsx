"use client";

/**
 * Halaman muka (landing) — /.
 *
 * Ini satu-satunya halaman yang dilihat orang sebelum punya usaha, jadi
 * tugasnya cuma satu: menjelaskan apa yang Nata lakukan, lalu mengantar ke
 * /usaha. Isinya sengaja disamakan dengan langkah onboarding supaya janji di
 * halaman ini persis sama dengan yang dialami pengguna baru.
 *
 * Bagian hero menampilkan *transformasinya*, bukan sekadar menceritakannya:
 * struk asli di kiri, jurnal hasilnya di kanan. Semua gambar dirakit dari kode
 * dan aset yang sudah ada di repo — tidak ada ilustrasi atau stok.
 */

import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  FileCheck,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Landmark,
  Bot,
  GraduationCap,
} from "lucide-react";

import { HeroProof } from "@/components/hero-proof";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/language";
import {
  AvatarMaya,
  AvatarDimas,
  AvatarArief,
  AvatarNata,
} from "@/components/agent-avatars";

export default function LandingPage() {
  const { copy } = useLanguage();
  const L = copy.landing;

  return (
    <div className="min-h-dvh bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
              ◈
            </span>
            <span className="text-sm font-semibold">{copy.app.name}</span>
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
              <a href="#tim-asisten" className="transition hover:text-foreground flex items-center gap-1.5">
                <Bot className="size-3.5 text-primary" />
                <span>{L.navAgents}</span>
              </a>
              <a href="#cara-kerja" className="transition hover:text-foreground">
                {L.navHow}
              </a>
              <a href="#kenapa" className="transition hover:text-foreground">
                {L.navWhy}
              </a>
              <Link href="/academy" className="transition hover:text-foreground flex items-center gap-1.5">
                <GraduationCap className="size-3.5 text-primary" />
                <span>{L.navAcademy}</span>
              </Link>
            </nav>
            <LanguageSwitcher />
            <Button asChild size="sm">
              <Link href="/onboarding">
                {L.navStart}
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero — the transformation, shown */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              {L.heroBadge}
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
              {L.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {L.heroBody}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/onboarding">
                  {L.heroCta}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#cara-kerja">{L.heroSecondary}</a>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{L.heroFootnote}</p>
          </div>

          <HeroProof />
        </div>
      </section>

      {/* Problem */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {L.problemTitle}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {L.problems.map((p) => (
              <Card key={p.title} className="bg-card">
                <CardContent className="pt-6">
                  <h3 className="text-sm font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Autonomous Bot Staff Showcase */}
      <section id="tim-asisten" className="scroll-mt-16 mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
              <Bot className="size-3.5" />
              <span>Tim Bisnis Otonom 24/7</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              {L.teamTitle}
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl text-sm sm:text-base">
              {L.teamSubtitle}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1.5 self-start sm:self-auto">
            <Link href="/agents">
              <span>Buka Ruang Kerja Bot</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {L.teamMembers.map((member, idx) => (
            <Card key={member.name} className="h-full bg-card hover:border-primary/40 transition-colors">
              <CardContent className="pt-6 flex flex-col h-full">
                <div className="flex items-center gap-3">
                  {idx === 0 && <AvatarMaya size={42} />}
                  {idx === 1 && <AvatarDimas size={42} />}
                  {idx === 2 && <AvatarArief size={42} />}
                  {idx === 3 && <AvatarNata size={42} />}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{member.name}</h3>
                    <p className="text-xs text-primary font-medium">{member.role}</p>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  {member.tagline}
                </p>

                <div className="mt-auto pt-4 border-t border-border/60">
                  <div className="flex items-start gap-1.5 text-xs text-foreground font-medium">
                    <Check className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{member.benefit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works — the same three steps as onboarding */}
      <section id="cara-kerja" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 sm:py-24">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{L.howTitle}</h2>
        <p className="mt-3 text-muted-foreground">{L.howBody}</p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {L.steps.map((s, i) => (
            <li key={s.title}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-sm font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      {/* Proof — the real product */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {L.proofTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">{L.proofBody}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {L.proofItems.map((item) => (
              <Card key={item.title} className="h-full bg-card">
                <CardContent className="pt-6">
                  <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    {item.icon === "scan" ? (
                      <ScanLine className="size-4" />
                    ) : item.icon === "book" ? (
                      <BookOpenCheck className="size-4" />
                    ) : item.icon === "tax" ? (
                      <Landmark className="size-4" />
                    ) : (
                      <ShieldCheck className="size-4" />
                    )}
                  </span>
                  <h3 className="mt-4 text-sm font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="kenapa" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 sm:py-24">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{L.whyTitle}</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {L.reasons.map((r) => (
            <div key={r.title} className="flex gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10">
                <Check className="size-3.5 text-primary" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {r.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Capability icon={<ScanLine className="size-4 text-primary" />} text={L.capabilities.receiptToJournal} />
          <Capability icon={<BookOpenCheck className="size-4 text-primary" />} text={L.capabilities.sakStatements} />
          <Capability
            icon={<ShieldCheck className="size-4 text-primary" />}
            text={L.capabilities.finalTaxArticles}
          />
          <Capability
            icon={<FileCheck className="size-4 text-primary" />}
            text={L.capabilities.verifiedKbli}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Card className="border-primary/20 bg-primary/[0.05]">
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {L.ctaTitle}
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">{L.ctaBody}</p>
            <Button asChild size="lg" className="mt-2">
              <Link href="/onboarding">
                {L.ctaButton}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            ◈ {copy.app.name} — {L.footerTagline}
          </span>
          <span>{copy.app.badge}</span>
        </div>
      </footer>
    </div>
  );
}

function Capability({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-sm">
      {icon}
      <span>{text}</span>
    </div>
  );
}
