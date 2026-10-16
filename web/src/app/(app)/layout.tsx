import { AppSidebar } from "@/components/app-sidebar";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { OnboardingGate } from "@/components/onboarding-gate";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";

/**
 * Application shell: persistent sidebar + scrollable content area.
 *
 * On phones the sidebar collapses into a bottom tab bar, so the receipt →
 * ledger → tax path works one-handed.
 *
 * `OnboardingGate` sits inside the shell: a visitor with no business yet is
 * sent to Profil Usaha to declare one before any bookkeeping screen renders.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <WorkspaceSwitcher />
        </header>
        <div className="flex-1 p-4 pb-24 sm:p-6 md:pb-8 lg:p-8">
          <OnboardingGate>{children}</OnboardingGate>
        </div>
      </SidebarInset>
      <MobileTabBar />
    </SidebarProvider>
  );
}
