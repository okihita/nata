"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  BookOpen,
  Clock,
  Scale,
  Compass,
  ExternalLink,
} from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/copy";
import { useWorkspace } from "@/lib/store";
import {
  ACADEMY_LESSONS,
  MYTH_FACTS,
  type AcademyTrack,
} from "@/lib/academy";

export default function AcademyPage() {
  const { copy } = useLanguage();
  const { business } = useWorkspace();

  const [activeTrack, setActiveTrack] = useState<AcademyTrack>("business");
  const [selectedPersona, setSelectedPersona] = useState<"all" | "persona_a" | "persona_b">("all");
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Auto-detect recommended persona if not explicitly filtered
  const activePersonaId = business?.id.includes("persona-b")
    ? "persona_b"
    : business?.id.includes("persona-a")
      ? "persona_a"
      : undefined;

  const filteredLessons = useMemo(() => {
    return ACADEMY_LESSONS.filter((item) => {
      if (item.track !== activeTrack) return false;
      if (selectedPersona === "all") return true;
      return item.targetPersona === "all" || item.targetPersona === selectedPersona;
    });
  }, [activeTrack, selectedPersona]);

  const activeLesson = useMemo(() => {
    if (!activeLessonId) return null;
    return ACADEMY_LESSONS.find((l) => l.id === activeLessonId) ?? null;
  }, [activeLessonId]);

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
              {activePersonaId && (
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {activePersonaId === "persona_a" ? "Persona A: Retail" : "Persona B: F&B PT"}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{copy.academy.filterHint}</p>
          </div>

          {/* Quick Persona Curriculum Switcher Filter */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border bg-background/80 p-1">
            <Button
              variant={selectedPersona === "all" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedPersona("all")}
            >
              {copy.academy.personaFilter.all}
            </Button>
            <Button
              variant={selectedPersona === "persona_a" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedPersona("persona_a")}
            >
              {copy.academy.personaFilter.persona_a}
            </Button>
            <Button
              variant={selectedPersona === "persona_b" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedPersona("persona_b")}
            >
              {copy.academy.personaFilter.persona_b}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Track Tabs */}
      <Tabs
        value={activeTrack}
        onValueChange={(val) => setActiveTrack(val as AcademyTrack)}
        className="space-y-6"
      >
        <TabsList className="grid h-10 w-full grid-cols-2 max-w-md">
          <TabsTrigger value="business" className="gap-2 text-xs font-medium">
            <Scale className="size-4" />
            {copy.academy.tracks.business}
          </TabsTrigger>
          <TabsTrigger value="platform" className="gap-2 text-xs font-medium">
            <Compass className="size-4" />
            {copy.academy.tracks.platform}
          </TabsTrigger>
        </TabsList>

        <div className="space-y-6">
          <div className="text-xs text-muted-foreground">
            {activeTrack === "business"
              ? copy.academy.tracks.businessDesc
              : copy.academy.tracks.platformDesc}
          </div>

          {/* Lesson Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.map((lesson) => {
              const lessonCopy = copy.academy.lessons[lesson.id as keyof typeof copy.academy.lessons];
              if (!lessonCopy) return null;

              const isRecommended =
                activePersonaId && lesson.targetPersona === activePersonaId;

              return (
                <Card
                  key={lesson.id}
                  className={`flex flex-col justify-between transition-all hover:border-primary/50 hover:shadow-xs ${
                    isRecommended ? "border-primary/40 bg-primary/[0.02]" : ""
                  }`}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {copy.academy.categories[lesson.category]}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Clock className="size-3" />
                        <span>
                          {lesson.estimatedMinutes} {copy.academy.minRead}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="pt-2 text-sm leading-snug font-semibold">
                      {lessonCopy.title}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {lessonCopy.summary}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4 pt-2 space-y-3">
                    {lesson.statuteCitation && (
                      <div className="rounded border bg-muted/30 px-2 py-1 text-[11px] text-muted-foreground font-mono truncate">
                        § {lesson.statuteCitation}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs cursor-pointer"
                        onClick={() => setActiveLessonId(lesson.id)}
                      >
                        <BookOpen className="mr-1.5 size-3.5" />
                        {copy.common.loading ? "Baca Panduan" : "Baca Panduan"}
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
      </Tabs>

      {/* Reader Modal / Expandable View */}
      {activeLesson && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4"
        >
          <Card className="max-w-xl w-full max-h-[85vh] flex flex-col shadow-xl border-primary/20">
            <CardHeader className="border-b p-4">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="text-[11px]">
                  {copy.academy.categories[activeLesson.category]} ·{" "}
                  {copy.academy.difficultyLabels[activeLesson.difficulty]}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setActiveLessonId(null)}
                >
                  ✕
                </Button>
              </div>
              <CardTitle className="pt-2 text-base font-semibold">
                {copy.academy.lessons[activeLesson.id as keyof typeof copy.academy.lessons]?.title}
              </CardTitle>
              {activeLesson.statuteCitation && (
                <CardDescription className="font-mono text-xs text-primary">
                  {copy.academy.statuteGrounded}: {activeLesson.statuteCitation}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="overflow-y-auto p-5 text-sm leading-relaxed space-y-4">
              <p className="text-foreground/90">
                {
                  copy.academy.lessons[activeLesson.id as keyof typeof copy.academy.lessons]
                    ?.content
                }
              </p>
              <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">💡 Ringkasan Praktis Nata:</p>
                <p>
                  {
                    copy.academy.lessons[activeLesson.id as keyof typeof copy.academy.lessons]
                      ?.summary
                  }
                </p>
              </div>
            </CardContent>
            <div className="border-t p-4 flex items-center justify-between bg-muted/10">
              {activeLesson.actionLink ? (
                <Button asChild size="sm" className="gap-1.5 text-xs">
                  <Link href={activeLesson.actionLink.href}>
                    {copy.academy.actionButtons[activeLesson.actionLink.labelKey]}
                    <ExternalLink className="size-3.5" />
                  </Link>
                </Button>
              ) : (
                <div />
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setActiveLessonId(null)}
              >
                {copy.common.close}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 10/10 Interactive Section: Myth vs. Fact Flashcards */}
      <div className="mt-12 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold tracking-tight">
            {copy.academy.mythsSectionTitle}
          </h3>
          <p className="text-xs text-muted-foreground">
            {copy.academy.mythsSectionSubtitle}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {MYTH_FACTS.map((mf) => {
            const item = copy.academy.myths[mf.id as keyof typeof copy.academy.myths];
            if (!item) return null;

            return (
              <Card key={mf.id} className="border-border/80 bg-card p-4 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-tone-oranye">
                    ⚠️ {copy.academy.mythLabel}
                  </span>
                  <p className="text-xs font-medium text-foreground/85">&ldquo;{item.myth}&rdquo;</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-tone-hijau">
                    ✓ {copy.academy.factLabel}
                  </span>
                  <p className="text-xs text-muted-foreground">{item.fact}</p>
                </div>
                <div className="rounded bg-muted/40 p-2 text-[10px] font-mono text-muted-foreground border">
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
