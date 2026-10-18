"use client";

/**
 * Not-found page.
 *
 * Without one, a mistyped URL shows Next's bare default page — off-brand, and
 * with no way back into the app. Anyone following an old or truncated link
 * should land somewhere that explains itself and offers a route home.
 *
 * Deliberately outside the `(app)` shell, because a wrong URL may well be a
 * visitor who has never had a business — the dashboard chrome would be empty
 * for them.
 */

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { copy } from "@/lib/copy";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Compass className="size-6" />
          </span>
          <div className="space-y-1.5">
            <h1 className="text-lg font-semibold">{copy.notFound.title}</h1>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
              {copy.notFound.body}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild>
              <Link href="/dashboard">
                {copy.notFound.toApp}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">{copy.notFound.toLanding}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
