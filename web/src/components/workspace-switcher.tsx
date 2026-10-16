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
import { TYPE_LABEL, TAXPAYER_LABEL } from "@/lib/business";

/**
 * Identitas usaha di bilah atas. Membaca usaha yang sedang dipakai dari store —
 * nama yang tampil adalah nama yang diisi pemilik saat mendaftar, bukan teks
 * bawaan. Satu usaha per pemilik hari ini; penukar ini siap untuk beberapa
 * usaha (banyak pemilik warung punya lebih dari satu).
 */
export function WorkspaceSwitcher() {
  const { business } = useWorkspace();

  const name = business?.name ?? copy.app.name;
  const subtitle = business
    ? `${TYPE_LABEL[business.type]} · ${TAXPAYER_LABEL[business.taxpayer]}`
    : copy.app.workspaceType;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-2 data-[state=open]:bg-muted">
          <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
            <Store className="size-3.5" />
          </span>
          <span className="hidden text-left leading-tight sm:grid">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-[11px] text-muted-foreground">{subtitle}</span>
          </span>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Usaha Anda</DropdownMenuLabel>
        <DropdownMenuItem className="gap-2">
          <Store className="size-4" />
          <div className="grid">
            <span className="text-sm">{name}</span>
            <span className="text-[11px] text-muted-foreground">{subtitle}</span>
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
