"use client";

/**
 * HeroProof — the hero's visual: a real receipt becoming a real journal entry.
 *
 * The page's whole claim is a transformation ("foto struk → pembukuan rapi"),
 * so the hero shows the transformation rather than describing it. Both halves
 * are the product's actual output: the image is a sample receipt that ships in
 * `public/samples/`, and the posting below it is the double-entry the guardrail
 * would accept for that receipt (Rp 100.000 of office supplies, paid cash:
 * Beban Perlengkapan / Kas).
 *
 * Deliberately code-native — no illustration asset, no image generation. It
 * inherits the brand palette, stays sharp at any DPI, and costs a few KB.
 */

import { ArrowRight, Check } from "lucide-react";

const LINES = [
  { account: "Beban Perlengkapan", debit: "100.000", credit: "—" },
  { account: "Kas", debit: "—", credit: "100.000" },
];

export function HeroProof() {
  return (
    <div className="relative">
      {/* soft amber wash behind the pair */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[2rem] bg-primary/[0.06] blur-2xl"
      />

      <div className="relative grid items-center gap-4 sm:grid-cols-[1fr_auto_1.25fr]">
        {/* ── the input: a real receipt ─────────────────────────────────── */}
        <figure className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-1.5 border-b bg-muted/40 px-3 py-2">
            <span className="size-2 rounded-full bg-primary/30" />
            <span className="text-[11px] text-muted-foreground">struk.jpg</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/samples/atk.png"
            alt="Contoh foto struk dari Toko ATK Sentosa"
            className="block max-h-[260px] w-full object-cover object-top"
            loading="eager"
          />
        </figure>

        {/* ── the transformation ────────────────────────────────────────── */}
        <div className="flex items-center justify-center sm:flex-col">
          <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <ArrowRight className="size-4 rotate-90 sm:rotate-0" />
          </span>
        </div>

        {/* ── the output: the posting it becomes ────────────────────────── */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2">
            <Check className="size-3.5 text-tone-hijau" />
            <span className="text-[11px] font-medium">Jurnal tersimpan</span>
            <span className="ml-auto rounded-full bg-tone-hijau-bg px-2 py-0.5 text-[10px] font-medium text-tone-hijau">
              Seimbang
            </span>
          </div>

          <div className="p-3">
            <p className="text-[11px] text-muted-foreground">
              Pembelian perlengkapan tunai 100.000 (toko ATK)
            </p>

            <table className="mt-2 w-full text-[11px]">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="pb-1 text-left font-medium">Akun</th>
                  <th className="pb-1 text-right font-medium">Debit</th>
                  <th className="pb-1 text-right font-medium">Kredit</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {LINES.map((line) => (
                  <tr key={line.account} className="border-t">
                    <td className="py-1.5 text-left">{line.account}</td>
                    <td className="py-1.5 text-right">{line.debit}</td>
                    <td className="py-1.5 text-right">{line.credit}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/50 px-2.5 py-1.5 text-[10px]">
              <span className="text-muted-foreground">Aset = Liabilitas + Ekuitas</span>
              <span className="font-medium text-tone-hijau">✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
