"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
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
  const [activeDeckLesson, setActiveDeckLesson] = useState<AcademyLesson | null>(null);

  const platformLessons = useMemo(() => {
    return ACADEMY_LESSONS.filter((item) => item.track === "platform");
  }, []);

  return (
    <>
      <PageHeader
        title={copy.nav.platformGuide}
        subtitle={copy.academy.tracks.platformDesc}
      />

      {/* Guide Lessons Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

      {/* Lightbox Walkthrough Deck Modal */}
      <AcademyWalkthroughDeckModal
        lesson={activeDeckLesson}
        open={Boolean(activeDeckLesson)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setActiveDeckLesson(null);
        }}
      />
    </>
  );
}
