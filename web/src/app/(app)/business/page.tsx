"use client";

/**
 * Profil Usaha — Two-Column High-Density Architecture.
 *
 * Left column: Macro business profile (name, owner, type, domicile address, tax entity).
 * Right column: Technicalities & legal compliance (NPWP, NIB OSS, KBLI, Kemenkumham,
 * and chronological statutory compliance timeline).
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Calendar,
  Check,
  FileCheck2,
  FileText,
  MapPin,
  Scale,
  ShieldCheck,
  Store,
} from "lucide-react";
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
import { useLanguage } from "@/lib/copy";
import {
  BUSINESS_TYPES,
  ENTITY_OPTIONS,
  type BusinessType,
  type EntityType,
} from "@/lib/business";

export default function UsahaPage() {
  const router = useRouter();
  const { business, ready, createBusiness, updateBusiness } = useWorkspace();
  const { copy } = useLanguage();

  const [edited, setEdited] = useState<
    Partial<{
      name: string;
      ownerName: string;
      type: BusinessType;
      entity: EntityType;
      address: string;
      npwp: string;
      nib: string;
    }>
  >({});

  const name = edited.name ?? business?.name ?? "";
  const ownerName = edited.ownerName ?? business?.ownerName ?? "";
  const type = edited.type ?? business?.type ?? "warung";
  const entity = edited.entity ?? business?.entity ?? "orang_pribadi";
  const address = edited.address ?? business?.address ?? "";
  const npwp = edited.npwp ?? business?.npwp ?? "";
  const nib = edited.nib ?? business?.nib ?? "";

  const setName = (value: string) => setEdited((s) => ({ ...s, name: value }));
  const setOwnerName = (value: string) => setEdited((s) => ({ ...s, ownerName: value }));
  const setType = (value: BusinessType) => setEdited((s) => ({ ...s, type: value }));
  const setEntity = (value: EntityType) => setEdited((s) => ({ ...s, entity: value }));
  const setAddress = (value: string) => setEdited((s) => ({ ...s, address: value }));
  const setNpwp = (value: string) => setEdited((s) => ({ ...s, npwp: value }));
  const setNib = (value: string) => setEdited((s) => ({ ...s, nib: value }));

  const isOnboarding = ready && business == null;
  const canSubmit = name.trim().length > 0;

  function submit() {
    if (!canSubmit) return;
    if (isOnboarding) {
      createBusiness({ name, ownerName, type, entity, address, npwp, nib });
      router.push("/record");
      return;
    }

    const typeChanged = business != null && business.type !== type;
    updateBusiness({
      name,
      ownerName,
      type,
      entity,
      address,
      npwp,
      nib,
      ...(typeChanged
        ? { kbliCode: undefined, kbliTitle: undefined, kbliHierarchy: undefined }
        : {}),
    });

    if (typeChanged && business?.kbliCode) {
      toast.info(copy.usaha.kbliInvalidated);
    }
    if (typeChanged) clearRegulasiCache();
    toast.success(copy.common.save);
    router.push("/dashboard");
  }

  const legalDocs = business?.legalDocuments ?? [];

  return (
    <>
      <PageHeader
        title={isOnboarding ? copy.onboarding.title : copy.nav.usaha}
        subtitle={isOnboarding ? copy.onboarding.subtitle : copy.usaha.subtitle}
      />

      <div className="grid gap-6 lg:grid-cols-12 items-start pb-12">
        {/* ── Left Column: Macro Business Profile (Span 7) ──────────────────── */}
        <div className="space-y-6 lg:col-span-7">
          <Card className="border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Store className="size-5 text-primary" />
                <CardTitle className="text-base font-semibold">
                  {copy.usaha.macroHeading}
                </CardTitle>
              </div>
              <CardDescription>{copy.usaha.macroSubtitle}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="biz-name" className="text-xs font-semibold">
                  {copy.usaha.nameLabel} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="biz-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="PT Seduh Rasa Nusantara"
                  autoFocus={isOnboarding}
                  className="bg-background"
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="biz-owner" className="text-xs font-semibold">
                    {copy.usaha.ownerLabel}
                  </Label>
                  <Input
                    id="biz-owner"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder={copy.usaha.ownerPlaceholder}
                    className="bg-background"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="biz-address" className="text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      {copy.usaha.addressLabel}
                    </span>
                  </Label>
                  <Input
                    id="biz-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={copy.usaha.addressPlaceholder}
                    className="bg-background"
                  />
                </div>
              </div>

              {/* Business Sector / Type */}
              <div className="grid gap-2">
                <Label className="text-xs font-semibold">{copy.usaha.typeLabel}</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {BUSINESS_TYPES.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setType(option.id)}
                      aria-pressed={type === option.id}
                      className={cn(
                        "rounded-lg border p-2.5 text-left transition cursor-pointer",
                        type === option.id
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "hover:bg-muted/50 border-border bg-card",
                      )}
                    >
                      <span className="block text-xs font-semibold">
                        {copy.typeLabels?.[option.id] ?? option.label}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        {copy.typeHints?.[option.id] ?? option.hint}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Legal Entity Classification */}
              <div className="grid gap-2 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="entity-group" className="text-xs font-semibold">
                    {copy.usaha.entityLabel}
                  </Label>
                  <span className="text-[10px] text-muted-foreground font-mono">PP 55/2022</span>
                </div>
                <p className="-mt-1 text-[11px] text-muted-foreground leading-normal">
                  {copy.usaha.entityHint}
                </p>
                <div
                  id="entity-group"
                  className="grid gap-2"
                  role="radiogroup"
                  aria-label={copy.usaha.entityLabel}
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
                          "flex items-start gap-3 rounded-lg border p-3 text-left transition cursor-pointer",
                          active
                            ? "border-primary bg-primary/10 shadow-xs"
                            : "hover:bg-muted/50 border-border bg-card",
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
                            <span className="text-xs font-semibold">
                              {copy.entityLabels?.[option.id] ?? option.label}
                            </span>
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
                          <span className="mt-1 block text-[11px] text-muted-foreground">
                            {copy.usaha.entityHints?.[option.id] ?? option.hint}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground pt-1">
                  {copy.usaha.entityCitation}
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t">
                <Button onClick={submit} disabled={!canSubmit} size="default">
                  {isOnboarding ? copy.onboarding.submit : copy.common.save}
                </Button>
                {isOnboarding && (
                  <p className="text-xs text-muted-foreground">{copy.onboarding.note}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column: Technicalities, Legalities & Timeline (Span 5) ─── */}
        <div className="space-y-6 lg:col-span-5">
          {/* Statutory Identifiers Card */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Scale className="size-5 text-primary" />
                <CardTitle className="text-base font-semibold">
                  {copy.usaha.techHeading}
                </CardTitle>
              </div>
              <CardDescription>{copy.usaha.techSubtitle}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {/* NPWP */}
              <div className="grid gap-1.5">
                <Label htmlFor="biz-npwp" className="text-xs font-semibold">
                  {copy.usaha.npwpLabel}
                </Label>
                <Input
                  id="biz-npwp"
                  value={npwp}
                  onChange={(e) => setNpwp(e.target.value)}
                  placeholder={copy.usaha.npwpPlaceholder}
                  className="font-mono text-xs bg-background"
                />
              </div>

              {/* NIB OSS */}
              <div className="grid gap-1.5">
                <Label htmlFor="biz-nib" className="text-xs font-semibold">
                  {copy.usaha.nibLabel}
                </Label>
                <Input
                  id="biz-nib"
                  value={nib}
                  onChange={(e) => setNib(e.target.value)}
                  placeholder={copy.usaha.nibPlaceholder}
                  className="font-mono text-xs bg-background"
                />
              </div>

              {/* Verified KBLI Badge */}
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-primary" />
                    <span className="text-xs font-semibold">{copy.usaha.kbliLabel}</span>
                  </div>
                  {business?.kbliCode ? (
                    <Badge variant="secondary" className="bg-tone-hijau-bg text-tone-hijau text-[10px]">
                      {copy.perizinan.verified}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      {copy.usaha.kbliNone}
                    </Badge>
                  )}
                </div>
                {business?.kbliCode ? (
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-base font-bold text-foreground">
                        {business.kbliCode}
                      </span>
                      <span className="text-xs font-medium text-foreground line-clamp-1">
                        {business.kbliTitle}
                      </span>
                    </div>
                    {business.kbliHierarchy && (
                      <p className="text-[10px] text-muted-foreground">
                        {business.kbliHierarchy.map((h) => h.title).join(" → ")}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <p className="text-xs text-muted-foreground">{copy.usaha.kbliNoneHint}</p>
                    <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                      <Link href="/licensing">{copy.nav.perizinan}</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Legal Compliance & Timeline Card */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                <CardTitle className="text-base font-semibold">
                  {copy.usaha.timelineTitle}
                </CardTitle>
              </div>
              <CardDescription>{copy.usaha.timelineSubtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              {legalDocs.length > 0 ? (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                  {legalDocs.map((doc) => (
                    <div key={doc.id} className="relative group">
                      {/* Timeline dot */}
                      <span className="absolute -left-[29px] top-1 grid size-4 place-items-center rounded-full bg-background border-2 border-primary">
                        <span className="size-1.5 rounded-full bg-primary" />
                      </span>

                      {/* Timeline content */}
                      <div className="rounded-lg border border-border bg-card p-3 shadow-2xs space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <FileText className="size-3.5 text-primary shrink-0" />
                            <h4 className="text-xs font-semibold text-foreground leading-tight">
                              {doc.type}
                            </h4>
                          </div>
                          <Badge
                            variant={doc.status === "verified" ? "default" : "secondary"}
                            className="text-[9px] uppercase font-mono px-1.5 py-0"
                          >
                            {doc.status === "verified"
                              ? copy.usaha.statusVerified
                              : doc.status === "active"
                                ? copy.usaha.statusActive
                                : copy.usaha.statusInReview}
                          </Badge>
                        </div>

                        <div className="font-mono text-[11px] text-foreground/90 font-medium">
                          {doc.number}
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/60">
                          <span className="flex items-center gap-1">
                            <Building2 className="size-3" />
                            {doc.issuer}
                          </span>
                          <span className="font-mono">
                            {doc.issueDate}
                            {doc.validUntil ? ` s.d. ${doc.validUntil}` : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg bg-muted/20">
                  <FileCheck2 className="size-8 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground max-w-xs">
                    {copy.usaha.emptyDocs}
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-4 text-xs">
                    <Link href="/onboarding">{copy.workspaceSwitcher.returnToOnboarding}</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
