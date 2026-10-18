"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Coffee, Sparkles, PlusCircle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/language";
import { useWorkspace } from "@/lib/store";
import { DEMO_BUSINESS_PROFILES } from "@/lib/business";

export default function OnboardingPage() {
  const router = useRouter();
  const { copy } = useLanguage();
  const { switchBusiness } = useWorkspace();
  const O = copy.onboarding;

  const handleSelectPersona = (persona: "persona_a" | "persona_b") => {
    switchBusiness(DEMO_BUSINESS_PROFILES[persona]);
    router.push("/dashboard");
  };

  const handleCreateCustom = () => {
    router.push("/business");
  };

  const handleSkip = () => {
    switchBusiness(DEMO_BUSINESS_PROFILES.persona_a);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b bg-background/95">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
              ◈
            </span>
            <span className="text-sm font-semibold">{copy.app.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={handleSkip}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              {O.skipToDemo}
            </button>
          </div>
        </div>
      </header>

      {/* Main Choice Body */}
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground mb-4">
            <Sparkles className="size-3.5 text-primary" />
            <span>{O.badge}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {O.selectorTitle}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {O.selectorSubtitle}
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: Retail & E-Commerce (Persona A) */}
          <Card className="flex flex-col justify-between border-primary/30 relative bg-card shadow-sm hover:border-primary transition">
            <div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="default" className="text-[11px] font-medium">
                    {O.cards.retail.badge}
                  </Badge>
                  <ShoppingBag className="size-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">{O.cards.retail.title}</CardTitle>
                <CardDescription className="text-xs text-foreground/80 font-medium mt-1">
                  {O.cards.retail.archetype}
                </CardDescription>
                <p className="text-[11px] text-muted-foreground">{O.cards.retail.entity}</p>
              </CardHeader>
              <CardContent className="pt-2">
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {O.cards.retail.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>
            <div className="p-4 pt-0">
              <Button
                onClick={() => handleSelectPersona("persona_a")}
                className="w-full justify-center text-xs font-semibold"
                size="default"
              >
                {O.cards.retail.cta}
              </Button>
            </div>
          </Card>

          {/* Card 2: F&B Cafe & Multi-Outlet (Persona B) */}
          <Card className="flex flex-col justify-between border-border relative bg-card shadow-sm hover:border-primary transition">
            <div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="secondary" className="text-[11px] font-medium">
                    {O.cards.fnb.badge}
                  </Badge>
                  <Coffee className="size-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg font-semibold">{O.cards.fnb.title}</CardTitle>
                <CardDescription className="text-xs text-foreground/80 font-medium mt-1">
                  {O.cards.fnb.archetype}
                </CardDescription>
                <p className="text-[11px] text-muted-foreground">{O.cards.fnb.entity}</p>
              </CardHeader>
              <CardContent className="pt-2">
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {O.cards.fnb.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>
            <div className="p-4 pt-0">
              <Button
                variant="outline"
                onClick={() => handleSelectPersona("persona_b")}
                className="w-full justify-center text-xs font-semibold"
                size="default"
              >
                {O.cards.fnb.cta}
              </Button>
            </div>
          </Card>

          {/* Card 3: Custom Business (From Scratch) */}
          <Card className="flex flex-col justify-between border-border relative bg-card shadow-sm hover:border-primary transition">
            <div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-[11px] font-medium text-muted-foreground">
                    {O.cards.scratch.badge}
                  </Badge>
                  <PlusCircle className="size-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg font-semibold">{O.cards.scratch.title}</CardTitle>
                <CardDescription className="text-xs text-foreground/80 font-medium mt-1">
                  {O.cards.scratch.archetype}
                </CardDescription>
                <p className="text-[11px] text-muted-foreground">{O.cards.scratch.entity}</p>
              </CardHeader>
              <CardContent className="pt-2">
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {O.cards.scratch.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>
            <div className="p-4 pt-0">
              <Button
                variant="outline"
                onClick={handleCreateCustom}
                className="w-full justify-center text-xs font-semibold"
                size="default"
              >
                {O.cards.scratch.cta}
              </Button>
            </div>
          </Card>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          {O.footnote}
        </p>
      </main>

      {/* Clean Footer */}
      <footer className="border-t py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition">
            ← {O.backToHome}
          </Link>
          <span>◈ {copy.app.name} — {copy.landing.footerTagline}</span>
        </div>
      </footer>
    </div>
  );
}
