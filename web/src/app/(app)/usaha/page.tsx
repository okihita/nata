"use client";

/**
 * Profil Usaha — tempat pemilik mengisi identitas usahanya.
 *
 * Halaman ini juga dipakai sebagai langkah pertama (onboarding) saat pemilik
 * baru belum punya usaha. Satu formulir, tiga hal: nama usaha, nama pemilik,
 * dan jenis wajib pajak — yang terakhir menentukan apakah pembebasan Rp 500
 * juta berlaku (Pasal 60 ayat (2) PP 55/2022).
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
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
  TAXPAYER_OPTIONS,
  type BusinessType,
  type Taxpayer,
} from "@/lib/business";

export default function UsahaPage() {
  const router = useRouter();
  const { business, ready, createBusiness, updateBusiness } = useWorkspace();

  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [type, setType] = useState<BusinessType>("warung");
  const [taxpayer, setTaxpayer] = useState<Taxpayer>("orang_pribadi");

  // Fill the form from the stored business once it has loaded.
  useEffect(() => {
    if (!business) return;
    setName(business.name);
    setOwnerName(business.ownerName);
    setType(business.type);
    setTaxpayer(business.taxpayer);
  }, [business]);

  const isOnboarding = ready && business == null;
  const canSubmit = name.trim().length > 0;

  function submit() {
    if (!canSubmit) return;
    if (isOnboarding) {
      createBusiness({ name, ownerName, type, taxpayer });
      router.push("/catat");
      return;
    }
    updateBusiness({ name, ownerName, type, taxpayer });
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

            <div className="grid gap-2">
              <Label>{copy.usaha.taxpayerLabel}</Label>
              <div className="grid gap-2">
                {TAXPAYER_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTaxpayer(option.id)}
                    className={cn(
                      "rounded-lg border p-3 text-left transition",
                      taxpayer === option.id
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
          </CardContent>
        </Card>

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
