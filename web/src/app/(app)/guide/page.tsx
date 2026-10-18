"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  ExternalLink,
  Play,
} from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/copy";
import { ACADEMY_LESSONS, type AcademyLesson } from "@/lib/academy";
import { AcademyWalkthroughDeckModal } from "@/components/academy-walkthrough-deck";

export default function GuidePage() {
  const { copy } = useLanguage();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeDeckLesson, setActiveDeckLesson] = useState<AcademyLesson | null>(null);

  const platformLessons = useMemo(() => {
    return ACADEMY_LESSONS.filter((item) => item.track === "platform");
  }, []);

  const activeLesson = useMemo(() => {
    if (!activeLessonId) return null;
    return platformLessons.find((l) => l.id === activeLessonId) ?? null;
  }, [activeLessonId, platformLessons]);

  return (
    <>
      <PageHeader
        title={copy.nav.platformGuide}
        subtitle={copy.academy.tracks.platformDesc}
      />

      {/* Guide Lessons Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platformLessons.map((lesson) => {
          const lessonCopy = copy.academy.lessons[lesson.id as keyof typeof copy.academy.lessons];
          if (!lessonCopy) return null;

          return (
            <Card
              key={lesson.id}
              className="flex flex-col justify-between transition-all hover:border-primary/50 hover:shadow-xs"
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>
                      {lesson.estimatedMinutes} {copy.academy.minRead}
                    </span>
                  </div>
                </div>
                <CardTitle className="pt-1 text-sm leading-snug font-semibold">
                  {lessonCopy.title}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground leading-normal">
                  {lessonCopy.summary}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-2 space-y-3">
                {lesson.statuteCitation && (
                  <div className="rounded border bg-muted/30 px-2 py-1 text-xs text-muted-foreground font-mono truncate">
                    {lesson.statuteCitation}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs cursor-pointer font-medium"
                      onClick={() => setActiveDeckLesson(lesson)}
                    >
                      <Play className="mr-1.5 size-3.5 fill-primary text-primary" />
                      {copy.academy.actionButtons.viewWalkthrough}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => setActiveLessonId(lesson.id)}
                    >
                      <BookOpen className="mr-1.5 size-3.5" />
                      {copy.academy.actionButtons.readLesson}
                    </Button>
                  </div>

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

      {/* Lightbox Walkthrough Deck Modal */}
      <AcademyWalkthroughDeckModal
        lesson={activeDeckLesson}
        open={Boolean(activeDeckLesson)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setActiveDeckLesson(null);
        }}
      />

      {/* Reader Modal */}
      {activeLesson && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4 cursor-pointer"
          onClick={() => setActiveLessonId(null)}
        >
          <Card
            className="max-w-xl w-full max-h-[85vh] flex flex-col shadow-xl border-primary/20 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="border-b p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>
                    {activeLesson.estimatedMinutes} {copy.academy.minRead}
                  </span>
                </div>
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
            </CardHeader>
            <CardContent className="overflow-y-auto p-5 text-sm leading-relaxed space-y-4">
              <p className="text-foreground/90">
                {
                  copy.academy.lessons[activeLesson.id as keyof typeof copy.academy.lessons]
                    ?.content
                }
              </p>
              <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">💡 Ringkasan:</p>
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
    </>
  );
}
