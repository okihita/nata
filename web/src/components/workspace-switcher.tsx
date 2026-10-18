"use client";

import Link from "next/link";
import { ChevronsUpDown, Compass, Settings, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspace } from "@/lib/store";
import { useLanguage } from "@/lib/copy";
import { TYPE_LABEL, ENTITY_LABEL, DEMO_BUSINESS_PROFILES } from "@/lib/business";

/**
 * Identitas usaha di bilah atas. Membaca usaha yang sedang dipakai dari store —
 * nama yang tampil adalah nama yang diisi pemilik saat mendaftar, bukan teks
 * bawaan. Satu usaha per pemilik hari ini; penukar ini siap untuk beberapa
 * usaha (banyak pemilik warung punya lebih dari satu).
 */
export function WorkspaceSwitcher() {
  const { business, switchBusiness } = useWorkspace();
  const { copy } = useLanguage();

  const typeLabel = business ? (copy.typeLabels?.[business.type] ?? TYPE_LABEL[business.type]) : "";
  const entityLabel = business ? (copy.entityLabels?.[business.entity] ?? ENTITY_LABEL[business.entity]) : "";

  const name = business?.name ?? copy.app.name;
  const subtitle = business
    ? `${typeLabel} · ${entityLabel}`
    : copy.app.workspaceType;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 min-w-0 gap-2 px-2 data-[state=open]:bg-muted"
        >
          <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
            <Store className="size-3.5" />
          </span>
          {/*
            The name is shown at every width. Hiding it below `sm` left a phone
            user with only a store icon — no way to tell which business they were
            in, which is exactly the case the switcher exists for. The subtitle
            (type · entity) stays desktop-only, and truncation keeps it from
            crowding the sidebar trigger on a narrow bar.
          */}
          <span className="grid min-w-0 text-left leading-tight">
            <span className="truncate text-sm font-medium">{name}</span>
            <span className="hidden truncate text-xs text-muted-foreground sm:block">
              {subtitle}
            </span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-xs font-semibold">{copy.workspaceSwitcher.activeLabel}</DropdownMenuLabel>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-medium text-primary">
            {business?.id.startsWith("biz-persona-") ? copy.workspaceSwitcher.archetypeBadge : copy.workspaceSwitcher.guestBadge}
          </span>
        </div>
        <DropdownMenuItem className="gap-2 bg-muted/40 font-medium">
          <Store className="size-4 text-primary shrink-0" />
          <div className="grid min-w-0">
            <span className="truncate text-xs font-semibold">{name}</span>
            <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {copy.workspaceSwitcher.archetypeHeading}
          </p>
        </div>
        <DropdownMenuItem
          onClick={() => switchBusiness(DEMO_BUSINESS_PROFILES.persona_a)}
          className="gap-2 cursor-pointer"
        >
          <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
          <div className="grid">
            <span className="text-xs font-medium">Persona A: Rona Kirana Beauty</span>
            <span className="text-xs text-muted-foreground">{copy.workspaceSwitcher.personaRetailHint}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchBusiness(DEMO_BUSINESS_PROFILES.persona_b)}
          className="gap-2 cursor-pointer"
        >
          <span className="size-2 rounded-full bg-amber-500 shrink-0" />
          <div className="grid">
            <span className="text-xs font-medium">Persona B: PT Seduh Rasa</span>
            <span className="text-xs text-muted-foreground">{copy.workspaceSwitcher.personaFnbHint}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {copy.workspaceSwitcher.syncHeading}
          </p>
        </div>
        <DropdownMenuItem asChild className="gap-2">
          <Link href="/business">
            <Settings className="size-4 text-muted-foreground" />
            <div className="grid">
              <span className="text-xs font-medium">{copy.workspaceSwitcher.createNew}</span>
              <span className="text-xs text-muted-foreground">{copy.workspaceSwitcher.createNewHint}</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="gap-2">
          <Link href="/onboarding">
            <Compass className="size-4 text-muted-foreground" />
            <div className="grid">
              <span className="text-xs font-medium">{copy.workspaceSwitcher.returnToOnboarding}</span>
              <span className="text-xs text-muted-foreground">{copy.workspaceSwitcher.returnToOnboardingHint}</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => alert(copy.workspaceSwitcher.cloudAlert)}
          className="gap-2 cursor-pointer text-primary focus:text-primary"
        >
          <span className="grid size-4 place-items-center rounded bg-primary text-xs font-bold text-primary-foreground">
            ↑
          </span>
          <div className="grid">
            <span className="text-xs font-medium">{copy.workspaceSwitcher.cloudSave}</span>
            <span className="text-xs text-muted-foreground">{copy.workspaceSwitcher.cloudSaveHint}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
