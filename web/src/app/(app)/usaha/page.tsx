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

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, Store } from "lucide-react";
import Link from "next/link";

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

  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [type, setType] = useState<BusinessType>("warung");
  const [entity, setEntity] = useState<EntityType>("orang_pribadi");

  // Fill the form from the stored business once it has loaded.
  useEffect(() => {
    if (!business) return;
    setName(business.name);
    setOwnerName(business.ownerName);
    setType(business.type);
    setEntity(business.entity);
  }, [business]);

  const isOnboarding = ready && business == null;
  const canSubmit = name.trim().length > 0;

  function submit() {
    if (!canSubmit) return;
    if (isOnboarding) {
      createBusiness({ name, ownerName, type, entity });
      router.push("/catat");
      return;
    }
    updateBusiness({ name, ownerName, type, entity });
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
              <div id="entity-group" className="grid gap-2" role="radiogroup">
                {ENTITY_OPTIONS.map((option) => {
                  const active = entity === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
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
