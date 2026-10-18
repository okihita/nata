"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FileBarChart,
  Landmark,
  LayoutDashboard,
  ReceiptText,
  ScanLine,
  Settings,
  ShieldCheck,
  Store,
  Sparkles,
  GraduationCap,
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

export const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  ScanLine,
  ReceiptText,
  BookOpen,
  FileBarChart,
  Landmark,
  ShieldCheck,
  Store,
  Settings,
  GraduationCap,
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
                  const active = pathname.startsWith(item.href);
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
            <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-2.5 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
              <Sparkles className="size-3.5 shrink-0 text-primary" />
              <span className="leading-snug">{copy.app.badge}</span>
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
