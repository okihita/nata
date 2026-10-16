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
import { usePathname, useRouter } from "next/navigation";

import { useWorkspace } from "@/lib/store";

/** Routes that remain reachable before a business exists. */
const EXEMPT = ["/usaha"];

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { business, ready } = useWorkspace();
  const router = useRouter();
  const pathname = usePathname();

  const exempt = EXEMPT.some((p) => pathname.startsWith(p));
  const needsOnboarding = ready && business == null && !exempt;

  useEffect(() => {
    if (needsOnboarding) router.replace("/usaha");
  }, [needsOnboarding, router]);

  // Before storage is read, render nothing rather than flashing an empty state.
  if (!ready) return null;

  // While the redirect is in flight, keep the screen blank to avoid a flash of
  // a dashboard belonging to nobody.
  if (needsOnboarding) return null;

  return <>{children}</>;
}
