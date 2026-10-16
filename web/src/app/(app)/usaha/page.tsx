"use client";

/**
 * Profil Usaha — tempat pemilik mengisi identitas usahanya.
 *
 * Halaman ini juga dipakai sebagai langkah pertama (onboarding) saat pemilik
 * baru belum punya usaha. Formulirnya mengisi tiga hal: nama usaha, nama
 * pemilik, dan **bentuk badan usaha**.
 *
 * Bentuk badan usaha adalah pilihan yang paling berkonsekuensi di halaman ini:
 * ia menentukan apakah pembebasan Rp 500 juta berlaku (Pasal 60 ayat (2)
 * PP 55/2022 — hanya orang pribadi). Karena itu tiap pilihan menampilkan
 * akibat pajaknya secara terbuka, bukan disembunyikan di balik istilah.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, Store } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { PageHeader } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/store";
import { clearRegulasi as clearRegulasiCache } from "@/lib/agent-regulasi";
import { copy } from "@/lib/copy";
import {
  BUSINESS_TYPES,
  ENTITY_OPTIONS,
  type BusinessType,
  type EntityType,
} from "@/lib/business";

export default function UsahaPage() {
  const router = useRouter();
  const { business, ready, createBusiness, updateBusiness } = useWorkspace();

  // Derive the form from the stored business during render, with a local
  // override once the owner edits a field. Same pattern as the Perizinan
  // description: no effect, so there is no extra render pass on mount and no
  // set-state-in-effect. (An effect that copied `business` into state ran a
  // second render and blanked the fields for one frame.)
  const [edited, setEdited] = useState<
    Partial<{
      name: string;
      ownerName: string;
      type: BusinessType;
      entity: EntityType;
    }>
  >({});

  const name = edited.name ?? business?.name ?? "";
  const ownerName = edited.ownerName ?? business?.ownerName ?? "";
  const type = edited.type ?? business?.type ?? "warung";
  const entity = edited.entity ?? business?.entity ?? "orang_pribadi";

  const setName = (value: string) => setEdited((s) => ({ ...s, name: value }));
  const setOwnerName = (value: string) => setEdited((s) => ({ ...s, ownerName: value }));
  const setType = (value: BusinessType) => setEdited((s) => ({ ...s, type: value }));
  const setEntity = (value: EntityType) => setEdited((s) => ({ ...s, entity: value }));

  const isOnboarding = ready && business == null;
  const canSubmit = name.trim().length > 0;

  function submit() {
    if (!canSubmit) return;
    if (isOnboarding) {
      createBusiness({ name, ownerName, type, entity });
      router.push("/catat");
      return;
    }

    // A KBLI is derived from what the business does, so it cannot survive a
    // change of type. Keeping it would leave a code that was verified for a
    // different activity — worse than no code, because it looks authoritative.
    const typeChanged = business != null && business.type !== type;
    updateBusiness({
      name,
      ownerName,
      type,
      entity,
      ...(typeChanged
        ? { kbliCode: undefined, kbliTitle: undefined, kbliHierarchy: undefined }
        : {}),
    });

    if (typeChanged && business?.kbliCode) {
      toast.info(copy.usaha.kbliInvalidated);
    }
    // The cached run on the Perizinan screen would otherwise outlive the code it
    // was verified for: `shownCode` falls back to that cache when the profile has
    // no code, so the stale value would reappear there as if still valid.
    if (typeChanged) clearRegulasiCache();
    router.push("/dasbor");
  }

  return (
    <>
      <PageHeader
        title={isOnboarding ? copy.onboarding.title : copy.nav.usaha}
        subtitle={isOnboarding ? copy.onboarding.subtitle : copy.usaha.subtitle}
      />

      <div className="grid gap-6 lg:max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="size-4 text-primary" />
              {copy.usaha.identity}
            </CardTitle>
            <CardDescription>{copy.usaha.identityHint}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="biz-name">{copy.usaha.nameLabel}</Label>
              <Input
                id="biz-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Warung Bu Siti"
                autoFocus={isOnboarding}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="biz-owner">{copy.usaha.ownerLabel}</Label>
              <Input
                id="biz-owner"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder={copy.usaha.ownerPlaceholder}
              />
            </div>

            <div className="grid gap-2">
              <Label>{copy.usaha.typeLabel}</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {BUSINESS_TYPES.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setType(option.id)}
                    aria-pressed={type === option.id}
                    className={cn(
                      "rounded-lg border p-3 text-left transition",
                      type === option.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50",
                    )}
                  >
                    <span className="block text-sm font-medium">{option.label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {option.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bentuk badan usaha — pilihan paling berkonsekuensi, jadi tiap
                kartu menyebut akibat pajaknya secara terbuka. */}
            <div className="grid gap-2">
              <Label htmlFor="entity-group">{copy.usaha.entityLabel}</Label>
              <p className="-mt-1 text-xs text-muted-foreground">
                {copy.usaha.entityHint}
              </p>
              <div
                id="entity-group"
                className="grid gap-2"
                role="radiogroup"
                aria-label={copy.usaha.entityLabel}
                onKeyDown={(e) => {
                  // ARIA radiogroups are expected to move with the arrow keys and
                  // hold a single tab stop. Without this, the group is three
                  // separate tab stops and arrows do nothing — it looks like a
                  // radiogroup to a screen reader but does not behave like one.
                  const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"];
                  if (!keys.includes(e.key)) return;
                  e.preventDefault();
                  const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
                  const idx = ENTITY_OPTIONS.findIndex((o) => o.id === entity);
                  const nextIdx =
                    (idx + step + ENTITY_OPTIONS.length) % ENTITY_OPTIONS.length;
                  const nextId = ENTITY_OPTIONS[nextIdx].id;
                  setEntity(nextId);
                  // Move focus with the selection, as a native radio group does.
                  document.getElementById(`entity-${nextId}`)?.focus();
                }}
              >
                {ENTITY_OPTIONS.map((option) => {
                  const active = entity === option.id;
                  return (
                    <button
                      key={option.id}
                      id={`entity-${option.id}`}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      tabIndex={active ? 0 : -1}
                      onClick={() => setEntity(option.id)}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3 text-left transition",
                        active ? "border-primary bg-primary/5" : "hover:bg-muted/50",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border",
                          active ? "border-primary bg-primary" : "border-input",
                        )}
                      >
                        {active && <Check className="size-3 text-primary-foreground" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">{option.label}</span>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-medium",
                              option.exemption
                                ? "bg-tone-hijau-bg text-tone-hijau"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {option.exemption
                              ? copy.usaha.entityExempt
                              : copy.usaha.entityTaxed}
                          </span>
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {option.hint}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {copy.usaha.entityCitation}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Kode KBLI yang sudah terverifikasi — atribut tetap usaha. */}
        {business && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4 text-primary" />
                {copy.usaha.kbliLabel}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {business.kbliCode ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-semibold tabular-nums tracking-tight">
                    {business.kbliCode}
                  </span>
                  <span className="text-sm">{business.kbliTitle}</span>
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-tone-hijau-bg text-tone-hijau text-[10px]"
                  >
                    {copy.perizinan.verified}
                  </Badge>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    {copy.usaha.kbliNone} · {copy.usaha.kbliNoneHint}
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/perizinan">{copy.nav.perizinan}</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-3">
          <Button onClick={submit} disabled={!canSubmit}>
            {isOnboarding ? copy.onboarding.submit : copy.common.save}
          </Button>
          {isOnboarding && (
            <p className="text-xs text-muted-foreground">{copy.onboarding.note}</p>
          )}
        </div>
      </div>
    </>
  );
}
