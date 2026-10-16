"use client";

import { ChevronsUpDown, Plus, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copy } from "@/lib/copy";

/**
 * Workspace identity in the top bar. One real workspace today; the switcher
 * exists so the product reads as multi-business from the start (Nata is meant
 * for owners running more than one warung/toko).
 */
export function WorkspaceSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-2 data-[state=open]:bg-muted">
          <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
            <Store className="size-3.5" />
          </span>
          <span className="hidden text-left leading-tight sm:grid">
            <span className="text-sm font-medium">{copy.app.workspace}</span>
            <span className="text-[11px] text-muted-foreground">{copy.app.workspaceType}</span>
          </span>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Usaha Anda</DropdownMenuLabel>
        <DropdownMenuItem className="gap-2">
          <Store className="size-4" />
          <div className="grid">
            <span className="text-sm">{copy.app.workspace}</span>
            <span className="text-[11px] text-muted-foreground">{copy.app.workspaceType}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="gap-2 text-muted-foreground">
          <Plus className="size-4" />
          Tambah usaha lain
          <span className="ml-auto text-[10px]">{copy.nav.comingSoon}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
