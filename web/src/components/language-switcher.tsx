"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/language";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 px-2 text-xs font-semibold tracking-wider text-muted-foreground hover:text-foreground"
          aria-label="Change Language"
        >
          <Languages className="size-3.5" />
          <span className="font-mono uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs">Language / Bahasa</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setLocale("en")}
          className="gap-2 cursor-pointer font-medium"
        >
          <span
            className={`size-2 rounded-full ${
              locale === "en" ? "bg-primary" : "bg-transparent border border-muted-foreground"
            }`}
          />
          <div className="grid">
            <span className="text-xs">English (Default)</span>
            <span className="text-[10px] text-muted-foreground">For Juries & Evaluation</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale("id")}
          className="gap-2 cursor-pointer font-medium"
        >
          <span
            className={`size-2 rounded-full ${
              locale === "id" ? "bg-primary" : "bg-transparent border border-muted-foreground"
            }`}
          />
          <div className="grid">
            <span className="text-xs">Bahasa Indonesia</span>
            <span className="text-[10px] text-muted-foreground">Untuk Pelaku UMKM</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
