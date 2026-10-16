"use client";

import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { copy } from "@/lib/copy";

/**
 * Shared placeholder for menu items that are mapped out but not implemented
 * yet (Profil Usaha, Pengaturan). Keeping the route real — rather than hiding
 * the menu item — makes the product's intended scope legible.
 */
export function ComingSoon({ title, body }: { title: string; body: string }) {
  return (
    <>
      <PageHeader title={title} subtitle={copy.nav.comingSoon} />
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-20 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-muted">
            <Construction className="size-6 text-muted-foreground" />
          </span>
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold">{copy.common.comingSoonTitle}</h2>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">{body}</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="size-4" />
              {copy.common.backToDashboard}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
