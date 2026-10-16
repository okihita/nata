"use client";

import { ComingSoon } from "@/components/coming-soon";
import { copy } from "@/lib/copy";

export default function PengaturanPage() {
  return <ComingSoon title={copy.comingSoon.pengaturan} body={copy.comingSoon.pengaturanBody} />;
}
