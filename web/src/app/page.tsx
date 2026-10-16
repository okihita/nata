"use client";

/**
 * Halaman muka (landing) — /.
 *
 * Ini satu-satunya halaman yang dilihat orang sebelum punya usaha, jadi
 * tugasnya cuma satu: menjelaskan apa yang Nata lakukan, lalu mengantar ke
 * /usaha. Isinya sengaja disamakan dengan langkah onboarding supaya janji di
 * halaman ini persis sama dengan yang dialami pengguna baru.
 */

import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { copy } from "@/lib/copy";

export default function LandingPage() {
  const L = copy.landing;

  return (
    <div className="min-h-dvh bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
              ◈
            </span>
            <span className="text-sm font-semibold">{copy.app.name}</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <a href="#cara-kerja" className="hover:text-foreground">
              {L.navHow}
            </a>
            <a href="#kenapa" className="hover:text-foreground">
              {L.navWhy}
            </a>
          </nav>
          <Button asChild size="sm">
            <Link href="/usaha">
              {L.navStart}
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-14 sm:pt-24 sm:pb-20">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          {L.heroBadge}
        </div>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {L.heroTitle}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {L.heroBody}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link href="/usaha">
              {L.heroCta}
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#cara-kerja">{L.heroSecondary}</a>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{L.heroFootnote}</p>
      </section>

      {/* Problem */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            {L.problemTitle}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {L.problems.map((p) => (
              <Card key={p.title}>
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

      {/* How it works */}
      <section id="cara-kerja" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-14 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{L.howTitle}</h2>
        <p className="mt-3 text-muted-foreground">{L.howBody}</p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {L.steps.map((s, i) => (
            <li key={s.title}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      {/* Why */}
      <section id="kenapa" className="scroll-mt-16 border-t bg-muted/20">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{L.whyTitle}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
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

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <Capability icon={<ScanLine className="size-4 text-primary" />} text="Foto struk → jurnal" />
            <Capability icon={<BookOpenCheck className="size-4 text-primary" />} text="Laporan SAK EMKM" />
            <Capability icon={<ShieldCheck className="size-4 text-primary" />} text="PPh Final + Pasal" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {L.ctaTitle}
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">{L.ctaBody}</p>
            <Button asChild size="lg" className="mt-2">
              <Link href="/usaha">
                {L.ctaButton}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-8 text-xs text-muted-foreground">
          <span>◈ {copy.app.name} — {L.footerTagline}</span>
          <span>{copy.app.badge}</span>
        </div>
      </footer>
    </div>
  );
}

function Capability({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2.5 text-sm">
      {icon}
      <span>{text}</span>
    </div>
  );
}
