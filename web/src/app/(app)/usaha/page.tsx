"use client";

import { ComingSoon } from "@/components/coming-soon";
import { copy } from "@/lib/copy";

export default function UsahaPage() {
  return <ComingSoon title={copy.comingSoon.usaha} body={copy.comingSoon.usahaBody} />;
}
