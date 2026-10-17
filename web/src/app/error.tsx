"use client";

/**
 * Route-level error boundary.
 *
 * Without one, a thrown error in a screen unmounts the whole tree and the owner
 * sees a blank page — no explanation and no way back. That is a bad failure mode
 * for something a shop owner opens to check their books, and a worse one during
 * a live demo.
 *
 * The copy is deliberately plain and keeps the same reassurance as the agent
 * errors: nothing was half-written, and trying again is safe.
 */

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { copy } from "@/lib/copy";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the failure visible in the console for whoever is debugging; the
    // owner sees the friendly card below.
    console.error("Nata screen error:", error);
  }, [error]);

  return (
    <div className="grid min-h-[60vh] place-items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="size-4 text-tone-oranye" />
            {copy.errorScreen.title}
          </CardTitle>
          <CardDescription>{copy.errorScreen.body}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={reset} className="w-full">
            <RotateCcw className="mr-2 size-4" />
            {copy.errorScreen.retry}
          </Button>
          {error.digest && (
            <p className="text-center text-[11px] text-muted-foreground">
              {copy.errorScreen.reference}: <code>{error.digest}</code>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
