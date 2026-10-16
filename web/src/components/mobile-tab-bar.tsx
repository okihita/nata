"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ICONS } from "@/components/app-sidebar";
import { LayoutDashboard } from "lucide-react";
import { MOBILE_NAV } from "@/lib/nav";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

/**
 * Bottom tab bar for phones.
 *
 * The UMKM tools this audience actually uses (BukuWarung, BukuKas) are
 * Android-first, so the demo path — foto struk → pembukuan → pajak — has to be
 * reachable one-handed. Desktop keeps the full sidebar; ≤md gets these five.
 */
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1">
        {MOBILE_NAV.map((item) => {
          const Icon = ICONS[item.icon] ?? LayoutDashboard;
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 px-1 py-2.5 text-[11px] transition",
                  active ? "font-medium text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                <span className="truncate">{copy.nav[item.key]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
