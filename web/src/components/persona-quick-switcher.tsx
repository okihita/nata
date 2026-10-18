"use client";

import { UserCheck } from "lucide-react";
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
import { DEMO_BUSINESS_PROFILES } from "@/lib/business";

export function PersonaQuickSwitcher() {
  const { business, switchBusiness } = useWorkspace();
  const { copy } = useLanguage();

  const isPersonaA = business?.id.includes("persona-a");
  const isPersonaB = business?.id.includes("persona-b");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs font-medium border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary shadow-2xs"
          aria-label="Switch Persona"
        >
          <UserCheck className="size-3.5" />
          <span className="hidden sm:inline">
            {isPersonaA ? "Persona A (Retail)" : isPersonaB ? "Persona B (F&B)" : copy.workspaceSwitcher.badgeCallout}
          </span>
          <span className="sm:hidden">Persona</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs">
          {copy.workspaceSwitcher.archetypeHeading}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => switchBusiness(DEMO_BUSINESS_PROFILES.persona_a)}
          className={`gap-2 cursor-pointer font-medium ${isPersonaA ? "bg-muted" : ""}`}
        >
          <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
          <div className="grid">
            <span className="text-xs">Persona A: Retail Toko</span>
            <span className="text-[10px] text-muted-foreground">
              {copy.workspaceSwitcher.personaRetailHint}
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchBusiness(DEMO_BUSINESS_PROFILES.persona_b)}
          className={`gap-2 cursor-pointer font-medium ${isPersonaB ? "bg-muted" : ""}`}
        >
          <span className="size-2 rounded-full bg-amber-500 shrink-0" />
          <div className="grid">
            <span className="text-xs">Persona B: PT Seduh Rasa</span>
            <span className="text-[10px] text-muted-foreground">
              {copy.workspaceSwitcher.personaFnbHint}
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
