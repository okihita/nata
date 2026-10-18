"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  Scale,
  Building2,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/copy";
import { MYTH_FACTS } from "@/lib/academy";

export default function FunFactsPage() {
  const { copy } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "tax" | "accounting" | "legal" | "operations"
  >("all");

  const categoryIcons = {
    tax: Scale,
    accounting: Building2,
    legal: ShieldCheck,
    operations: Users,
  };

  const filteredMyths = useMemo(() => {
    return MYTH_FACTS.filter((mf) => {
      if (selectedCategory !== "all" && mf.category !== selectedCategory) {
        return false;
      }

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const item = copy.academy.myths[mf.id as keyof typeof copy.academy.myths];
      if (!item) return false;

      return (
        item.myth.toLowerCase().includes(q) ||
        item.fact.toLowerCase().includes(q) ||
        item.statuteText.toLowerCase().includes(q) ||
        mf.statute.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery, copy]);

  return (
    <>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2 h-8 text-xs text-muted-foreground hover:text-foreground">
          <Link href="/academy" className="inline-flex items-center gap-1.5">
            <ArrowLeft className="size-3.5" />
            <span>{copy.academy.funFactsPage.backToAcademy.replace(/^[←\s]+/, "")}</span>
          </Link>
        </Button>
      </div>

      <PageHeader
        title={copy.academy.funFactsPage.title}
        subtitle={copy.academy.funFactsPage.subtitle}
      />

      {/* Hero Stats Card */}
      <div className="mb-8 rounded-2xl border bg-gradient-to-r from-tone-biru-bg/70 via-background to-tone-hijau-bg/60 p-6 shadow-xs">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 max-w-xl">
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="mr-1.5 size-3.5" />
              {copy.academy.funFactsPage.badge}
            </Badge>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {copy.academy.funFactsPage.title}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {copy.academy.funFactsPage.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border bg-background/90 p-3 text-center shadow-2xs">
              <div className="text-xl font-bold text-primary font-mono">{MYTH_FACTS.length}+</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {copy.academy.funFactsPage.stats.totalVerified}
              </div>
            </div>
            <div className="rounded-xl border bg-background/90 p-3 text-center shadow-2xs">
              <div className="text-xl font-bold text-tone-hijau font-mono">100%</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {copy.academy.funFactsPage.stats.groundedInLaw}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-xl border bg-background/90 p-3 text-center shadow-2xs">
              <div className="text-xl font-bold text-foreground font-mono">SAK EMKM</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {copy.academy.funFactsPage.stats.freeForMSMEs}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={copy.academy.funFactsPage.searchPlaceholder}
            className="pl-9 text-xs h-9 bg-background"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border bg-muted/40 p-1">
          <Button
            variant={selectedCategory === "all" ? "default" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setSelectedCategory("all")}
          >
            {copy.academy.funFactsPage.filterAll}
          </Button>
          <Button
            variant={selectedCategory === "tax" ? "default" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setSelectedCategory("tax")}
          >
            {copy.academy.funFactsPage.filterTax}
          </Button>
          <Button
            variant={selectedCategory === "accounting" ? "default" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setSelectedCategory("accounting")}
          >
            {copy.academy.funFactsPage.filterAccounting}
          </Button>
          <Button
            variant={selectedCategory === "legal" ? "default" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setSelectedCategory("legal")}
          >
            {copy.academy.funFactsPage.filterLegal}
          </Button>
          <Button
            variant={selectedCategory === "operations" ? "default" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setSelectedCategory("operations")}
          >
            {copy.academy.funFactsPage.filterOperations}
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      {filteredMyths.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="text-sm font-semibold">{copy.academy.funFactsPage.noResultsTitle}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {copy.academy.funFactsPage.noResultsDesc}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 text-xs"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            Reset Filter
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMyths.map((mf) => {
            const item = copy.academy.myths[mf.id as keyof typeof copy.academy.myths];
            if (!item) return null;

            const IconComp = categoryIcons[mf.category] ?? Scale;

            return (
              <Card
                key={mf.id}
                className="flex flex-col justify-between border-border/80 bg-card p-4 space-y-3 transition-all hover:border-primary/40 hover:shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs capitalize gap-1 font-normal">
                      <IconComp className="size-3 text-muted-foreground" />
                      {mf.category}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">
                      #{mf.id.replace("myth_", "")}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-tone-oranye">
                      <span>!</span> {copy.academy.mythLabel}
                    </span>
                    <p className="text-xs font-medium text-foreground/90 leading-snug">
                      &ldquo;{item.myth}&rdquo;
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-tone-hijau">
                      <span>✓</span> {copy.academy.factLabel}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.fact}</p>
                  </div>
                </div>

                <div className="rounded bg-muted/40 p-2.5 text-xs font-mono text-muted-foreground border mt-2">
                  {item.statuteText}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Footer Banner */}
      <div className="mt-12 rounded-xl border bg-muted/30 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-foreground">
            Ingin mempraktikkan pembukuan berstandar resmi?
          </p>
          <p className="text-xs text-muted-foreground">
            Jelajahi panduan langkah demi langkah dan simulasi otonom Nata di Kuliah Bisnis.
          </p>
        </div>
        <Button asChild size="sm" className="text-xs">
          <Link href="/academy">
            <GraduationCap className="mr-1.5 size-3.5" />
            {copy.academy.funFactsPage.browseLessonsCta}
          </Link>
        </Button>
      </div>
    </>
  );
}
