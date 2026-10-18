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
          {/* Tenancy Mode Badge */}
          <span className="hidden items-center rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground md:inline-flex">
            {business?.id.startsWith("biz-persona-") ? "DEMO LOKAL" : "TAMU TRANSIEN"}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-xs font-semibold">Usaha Aktif</DropdownMenuLabel>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] font-medium text-primary">
            {business?.id.startsWith("biz-persona-") ? "Arketipe Hackathon" : "Lokal / Tamu"}
          </span>
        </div>
        <DropdownMenuItem className="gap-2 bg-muted/40 font-medium">
          <Store className="size-4 text-primary shrink-0" />
          <div className="grid min-w-0">
            <span className="truncate text-xs font-semibold">{name}</span>
            <span className="truncate text-[10px] text-muted-foreground">{subtitle}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-1">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Pilih Arketipe Instan (Juri & Bot)
          </p>
        </div>
        <DropdownMenuItem
          onClick={() => switchBusiness(DEMO_BUSINESS_PROFILES.persona_a)}
          className="gap-2 cursor-pointer"
        >
          <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
          <div className="grid">
            <span className="text-xs font-medium">Persona A: Rona Kirana Beauty</span>
            <span className="text-[10px] text-muted-foreground">Retail & E-Commerce (Shopee/TikTok)</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchBusiness(DEMO_BUSINESS_PROFILES.persona_b)}
          className="gap-2 cursor-pointer"
        >
          <span className="size-2 rounded-full bg-amber-500 shrink-0" />
          <div className="grid">
            <span className="text-xs font-medium">Persona B: PT Seduh Rasa</span>
            <span className="text-[10px] text-muted-foreground">F&B Multi-Outlet (POS & Resto)</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-1">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Penyimpanan & Sinkronisasi
          </p>
        </div>
        <DropdownMenuItem asChild className="gap-2">
          <Link href="/usaha">
            <Settings className="size-4 text-muted-foreground" />
            <div className="grid">
              <span className="text-xs font-medium">Buat Usaha Baru (Transien)</span>
              <span className="text-[10px] text-muted-foreground">Uji coba formulir onboarding sendiri</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => alert("Fitur Cloud Profile: Siap disinkronkan ke Firebase Firestore saat produksi.")}
          className="gap-2 cursor-pointer text-primary focus:text-primary"
        >
          <span className="grid size-4 place-items-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
            ↑
          </span>
          <div className="grid">
            <span className="text-xs font-medium">Simpan Usaha ke Cloud</span>
            <span className="text-[10px] text-muted-foreground">Permanenkan data ke Firebase Multi-Tenant</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
