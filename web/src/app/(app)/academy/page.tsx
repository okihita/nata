"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  Clock,
  Sparkles,
  Play,
} from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/copy";
import {
  ACADEMY_LESSONS,
  MYTH_FACTS,
  type AcademyLesson,
} from "@/lib/academy";
import { AcademyWalkthroughDeckModal } from "@/components/academy-walkthrough-deck";

export default function AcademyPage() {
  const { copy } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "accounting_101" | "tax_compliance" | "licensing_legal" | "operations_team"
  >("all");
  const [activeDeckLesson, setActiveDeckLesson] = useState<AcademyLesson | null>(null);

  // Filter lessons specifically for the Business track (Kuliah Bisnis)
  const businessLessons = useMemo(() => {
    return ACADEMY_LESSONS.filter((item) => {
      if (item.track !== "business") return false;
      if (selectedCategory === "all") return true;
      return item.category === selectedCategory;
    });
  }, [selectedCategory]);

  return (
    <>
      <PageHeader
        title={copy.academy.title}
        subtitle={copy.academy.subtitle}
      />

      {/* Hero / Value Banner */}
      <div className="mb-6 rounded-xl border bg-gradient-to-r from-tone-biru-bg/60 via-background to-tone-hijau-bg/50 p-5 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                <GraduationCap className="mr-1 size-3.5" />
                {copy.academy.badge}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{copy.academy.filterHint}</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border bg-background/80 p-1">
            <Button
              variant={selectedCategory === "all" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedCategory("all")}
            >
              {copy.academy.categoryFilter.all}
            </Button>
            <Button
              variant={selectedCategory === "accounting_101" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedCategory("accounting_101")}
            >
              {copy.academy.categoryFilter.accounting_101}
            </Button>
            <Button
              variant={selectedCategory === "tax_compliance" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedCategory("tax_compliance")}
            >
              {copy.academy.categoryFilter.tax_compliance}
            </Button>
            <Button
              variant={selectedCategory === "licensing_legal" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedCategory("licensing_legal")}
            >
              {copy.academy.categoryFilter.licensing_legal}
            </Button>
            <Button
              variant={selectedCategory === "operations_team" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedCategory("operations_team")}
            >
              {copy.academy.categoryFilter.operations_team}
            </Button>
          </div>
        </div>
      </div>

      {/* Lesson Cards Grid */}
      <div className="space-y-4">
        <div className="text-xs text-muted-foreground">
          {copy.academy.tracks.businessDesc}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {businessLessons.map((lesson) => {
            const lessonCopy = copy.academy.lessons[lesson.id as keyof typeof copy.academy.lessons];
            if (!lessonCopy) return null;

            return (
              <Card
                key={lesson.id}
                className="flex flex-col justify-between transition-all hover:border-primary/50 hover:shadow-xs"
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs">
                      {copy.academy.categories[lesson.category]}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      <span>
                        {lesson.estimatedMinutes} {copy.academy.minRead}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="pt-2 text-sm leading-snug font-semibold">
                    {lessonCopy.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-normal">
                    {lessonCopy.summary}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 pt-2">
                  <div className="flex items-center justify-between pt-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs cursor-pointer font-medium"
                      onClick={() => setActiveDeckLesson(lesson)}
                    >
                      <Play className="mr-1.5 size-3.5 fill-primary text-primary" />
                      {copy.academy.actionButtons.viewWalkthrough}
                    </Button>

                    {lesson.actionLink && (
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-primary hover:text-primary"
                      >
                        <Link href={lesson.actionLink.href}>
                          {copy.academy.actionButtons[lesson.actionLink.labelKey]}
                          <ArrowRight className="ml-1 size-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Lightbox Walkthrough Deck Modal */}
      <AcademyWalkthroughDeckModal
        lesson={activeDeckLesson}
        open={Boolean(activeDeckLesson)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setActiveDeckLesson(null);
        }}
      />

      {/* Fun Facts / Myth vs. Fact Section (Blog Landing Style) */}
      <div className="mt-12 space-y-5 rounded-2xl border bg-gradient-to-b from-muted/20 to-background p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="size-3.5" />
              </span>
              <h3 className="text-base font-semibold tracking-tight">
                {copy.academy.mythsSectionTitle}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              {copy.academy.mythsSectionSubtitle}
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="self-start sm:self-auto gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Link href="/academy/fun-facts">
              {copy.academy.viewMoreMyths}
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MYTH_FACTS.slice(0, 3).map((mf) => {
            const item = copy.academy.myths[mf.id as keyof typeof copy.academy.myths];
            if (!item) return null;

            return (
              <Card
                key={mf.id}
                className="flex flex-col justify-between border-border/80 bg-card p-4 space-y-3 transition-all hover:border-primary/40 hover:shadow-xs"
              >
                <div className="space-y-3">
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
                <div className="rounded bg-muted/40 p-2 text-xs font-mono text-muted-foreground border mt-2">
                  {item.statuteText}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
