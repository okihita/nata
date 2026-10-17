"use client";

import Link from "next/link";
import { ChevronsUpDown, Settings, Store } from "lucide-react";

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
import { copy } from "@/lib/copy";
import { TYPE_LABEL, ENTITY_LABEL, DEMO_BUSINESS_PROFILES } from "@/lib/business";

/**
 * Identitas usaha di bilah atas. Membaca usaha yang sedang dipakai dari store —
 * nama yang tampil adalah nama yang diisi pemilik saat mendaftar, bukan teks
 * bawaan. Satu usaha per pemilik hari ini; penukar ini siap untuk beberapa
 * usaha (banyak pemilik warung punya lebih dari satu).
 */
export function WorkspaceSwitcher() {
  const { business, switchBusiness } = useWorkspace();

  const name = business?.name ?? copy.app.name;
  const subtitle = business
    ? `${TYPE_LABEL[business.type]} · ${ENTITY_LABEL[business.entity]}`
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
            <span className="hidden truncate text-[11px] text-muted-foreground sm:block">
              {subtitle}
            </span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Usaha Aktif</DropdownMenuLabel>
        <DropdownMenuItem className="gap-2 bg-muted/50 font-medium">
          <Store className="size-4 text-primary" />
          <div className="grid">
            <span className="text-sm">{name}</span>
            <span className="text-[11px] text-muted-foreground">{subtitle}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Ganti Profil Demo
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => switchBusiness(DEMO_BUSINESS_PROFILES.persona_a)}
          className="gap-2 cursor-pointer"
        >
          <span className="size-2 rounded-full bg-emerald-500" />
          <div className="grid">
            <span className="text-xs font-medium">Persona A: Rona Kirana</span>
            <span className="text-[10px] text-muted-foreground">Retail Kosmetik (Shopee/Tokped)</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchBusiness(DEMO_BUSINESS_PROFILES.persona_b)}
          className="gap-2 cursor-pointer"
        >
          <span className="size-2 rounded-full bg-amber-500" />
          <div className="grid">
            <span className="text-xs font-medium">Persona B: PT Seduh Rasa</span>
            <span className="text-[10px] text-muted-foreground">F&B Kedai Kopi Multi-Outlet</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="gap-2">
          <Link href="/usaha">
            <Settings className="size-4" />
            {copy.nav.usaha}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
