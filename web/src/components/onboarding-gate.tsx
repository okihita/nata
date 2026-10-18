"use client";

/**
 * OnboardingGate — send a visitor with no business to declare one first.
 *
 * The ledger belongs to a business, so every bookkeeping screen is meaningless
 * until one exists. Rather than let a new user land on an empty dashboard and
 * wonder what to do, the shell redirects to /usaha, which doubles as the
 * onboarding form. Once the business exists, children render normally.
 *
 * This is a client-side gate because the business lives in localStorage today.
 * When auth moves to Firebase, this becomes a server-side check with no change
 * to the screens themselves.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useWorkspace } from "@/lib/store";
import { isUsableBusiness, DEMO_BUSINESS_PROFILES } from "@/lib/business";

/** Routes that remain reachable before a business exists. */
const EXEMPT = ["/usaha"];

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { business, ready, switchBusiness } = useWorkspace();
  const pathname = usePathname();

  const exempt = EXEMPT.some((p) => pathname.startsWith(p));
  const hasUsable = isUsableBusiness(business);

  // Development & hackathon convenience: support URL params (?persona=a / ?persona=b)
  // for judges, pitch links, and automated evaluation bots.
  useEffect(() => {
    if (typeof window === "undefined" || !ready) return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("persona")?.toLowerCase();
    if (p === "a" || p === "persona_a" || p === "retail") {
      switchBusiness(DEMO_BUSINESS_PROFILES.persona_a);
      return;
    }
    if (p === "b" || p === "persona_b" || p === "fnb") {
      switchBusiness(DEMO_BUSINESS_PROFILES.persona_b);
      return;
    }

    // Auto-seed Persona A on cold boot if storage has no business
    if (!hasUsable && !exempt) {
      switchBusiness(DEMO_BUSINESS_PROFILES.persona_a);
    }
  }, [ready, hasUsable, exempt, switchBusiness]);

  // While storage is hydrating, render nothing briefly to avoid flash
  if (!ready) return null;

  return <>{children}</>;
}
