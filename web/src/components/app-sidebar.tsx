"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bot,
  Clock,
  FileBarChart,
  Landmark,
  LayoutDashboard,
  ReceiptText,
  ScanLine,
  Settings,
  ShieldCheck,
  Store,
  GraduationCap,
  Compass,
  Archive,
  type LucideIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { NAV, TONE_DOT } from "@/lib/nav";
import { useLanguage } from "@/lib/copy";
import { GeminiLogo } from "@/components/gemini-logo";

export const ICONS: Record<string, LucideIcon> = {
  Bot,
  LayoutDashboard,
  Clock,
  ScanLine,
  ReceiptText,
  BookOpen,
  FileBarChart,
  Landmark,
  ShieldCheck,
  Store,
  Settings,
  GraduationCap,
  Compass,
  Archive,
};

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { copy } = useLanguage();

  return (
    <Sidebar collapsible="icon">
      {/* Merek */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" onClick={() => setOpenMobile(false)}>
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                  ◈
                </span>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold">{copy.app.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {copy.app.tagline}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV.map((group) => (
          <SidebarGroup key={group.key}>
            <SidebarGroupLabel className="gap-1.5">
              <span className={`size-1.5 rounded-full ${TONE_DOT[group.tone]}`} />
              {copy.nav.groupLabels?.[group.key] ?? group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = ICONS[item.icon] ?? LayoutDashboard;
                  const itemPath = item.href.split("?")[0];
                  const active = pathname === itemPath;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={copy.nav[item.key]}
                        className={active ? "" : "text-muted-foreground"}
                      >
                        <Link href={item.href} onClick={() => setOpenMobile(false)}>
                          <Icon className={active ? "text-primary" : ""} />
                          <span>{copy.nav[item.key]}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="group/gemini flex items-center gap-2.5 rounded-xl border border-border/80 bg-gradient-to-r from-muted/50 via-background to-muted/30 p-2.5 text-xs text-foreground shadow-2xs transition-all hover:border-primary/40 group-data-[collapsible=icon]:hidden">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background shadow-2xs border border-border/50">
                <GeminiLogo className="size-4" />
              </div>
              <div className="grid leading-tight">
                <span className="text-[11px] font-semibold text-foreground tracking-tight">Google Gemini</span>
                <span className="text-[10px] text-muted-foreground">on Google Cloud</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

/** Consistent page header used by every screen. */
export function PageHeader({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </div>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
