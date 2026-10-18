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
  Edit3,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  const isOnboarding = ready && business == null;
  const [isEditing, setIsEditing] = useState(isOnboarding);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const canSubmit = name.trim().length > 0;

  // Track differences between current business state and edited values
  const diffs: { label: string; before: string; after: string }[] = [];
  if (business) {
    if (name.trim() !== business.name) {
      diffs.push({ label: copy.usaha.nameLabel, before: business.name, after: name.trim() });
    }
    if (ownerName.trim() !== (business.ownerName ?? "")) {
      diffs.push({ label: copy.usaha.ownerLabel, before: business.ownerName || "-", after: ownerName.trim() || "-" });
    }
    if (address.trim() !== (business.address ?? "")) {
      diffs.push({ label: copy.usaha.addressLabel, before: business.address || "-", after: address.trim() || "-" });
    }
    if (type !== business.type) {
      diffs.push({
        label: copy.usaha.typeLabel,
        before: copy.typeLabels?.[business.type] ?? business.type,
        after: copy.typeLabels?.[type] ?? type,
      });
    }
    if (entity !== business.entity) {
      diffs.push({
        label: copy.usaha.entityLabel,
        before: copy.entityLabels?.[business.entity] ?? business.entity,
        after: copy.entityLabels?.[entity] ?? entity,
      });
    }
    if (npwp.trim() !== (business.npwp ?? "")) {
      diffs.push({ label: copy.usaha.npwpLabel, before: business.npwp || "-", after: npwp.trim() || "-" });
    }
    if (nib.trim() !== (business.nib ?? "")) {
      diffs.push({ label: copy.usaha.nibLabel, before: business.nib || "-", after: nib.trim() || "-" });
    }
  }

  function handleSaveClick() {
    if (!canSubmit) return;
    if (isOnboarding) {
      createBusiness({ name, ownerName, type, entity, address, npwp, nib });
      router.push("/record");
      return;
    }
    if (diffs.length === 0) {
      setIsEditing(false);
      setEdited({});
      return;
    }
    setShowConfirm(true);
  }

  function confirmSave() {
    setShowConfirm(false);
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
    setIsEditing(false);
    setEdited({});
  }

  function cancelEditing() {
    setIsEditing(false);
    setEdited({});
  }

  const legalDocs = business?.legalDocuments ?? [];

  return (
    <>
      <PageHeader
        title={isOnboarding ? copy.onboarding.title : copy.nav.usaha}
        subtitle={isOnboarding ? copy.onboarding.subtitle : copy.usaha.subtitle}
      >
        {!isOnboarding && !isEditing && (
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            size="sm"
            variant="outline"
            className="gap-1.5"
          >
            <Edit3 className="size-3.5" />
            {copy.usaha.editButton}
          </Button>
        )}
      </PageHeader>

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
                  disabled={!isEditing}
                  autoFocus={isOnboarding}
                  className="bg-background disabled:opacity-85 disabled:cursor-not-allowed"
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
                    disabled={!isEditing}
                    className="bg-background disabled:opacity-85 disabled:cursor-not-allowed"
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
                    disabled={!isEditing}
                    className="bg-background disabled:opacity-85 disabled:cursor-not-allowed"
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
                      disabled={!isEditing}
                      onClick={() => setType(option.id)}
                      aria-pressed={type === option.id}
                      className={cn(
                        "rounded-lg border p-2.5 text-left transition",
                        isEditing ? "cursor-pointer" : "cursor-not-allowed opacity-85",
                        type === option.id
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "hover:bg-muted/50 border-border bg-card",
                      )}
                    >
                      <span className="block text-xs font-semibold">
                        {copy.typeLabels?.[option.id] ?? option.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
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
                  <span className="text-xs text-muted-foreground font-mono">PP 55/2022</span>
                </div>
                <div
                  id="entity-group"
                  className="grid grid-cols-1 md:grid-cols-3 gap-2.5"
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
                        disabled={!isEditing}
                        aria-checked={active}
                        tabIndex={active ? 0 : -1}
                        onClick={() => setEntity(option.id)}
                        className={cn(
                          "flex flex-col justify-between rounded-lg border p-3 text-left transition relative",
                          isEditing ? "cursor-pointer" : "cursor-not-allowed opacity-85",
                          active
                            ? "border-primary bg-primary/10 shadow-xs"
                            : "hover:bg-muted/50 border-border bg-card",
                        )}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold line-clamp-1">
                              {copy.entityLabels?.[option.id] ?? option.label}
                            </span>
                            <span
                              className={cn(
                                "grid size-3.5 shrink-0 place-items-center rounded-full border",
                                active ? "border-primary bg-primary" : "border-input",
                              )}
                            >
                              {active && <Check className="size-2.5 text-primary-foreground" />}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                            {copy.usaha.entityHints?.[option.id] ?? option.hint}
                          </p>
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-border/50">
                          <span
                            className={cn(
                              "inline-block rounded px-1.5 py-0.5 text-xs font-medium tracking-wide uppercase",
                              option.exemption
                                ? "bg-tone-hijau-bg text-tone-hijau"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {option.exemption
                              ? copy.usaha.entityExempt
                              : copy.usaha.entityTaxed}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              {isEditing && (
                <div className="flex items-center gap-3 pt-3 border-t">
                  <Button onClick={handleSaveClick} disabled={!canSubmit} size="default">
                    {isOnboarding ? copy.onboarding.submit : copy.usaha.saveChanges}
                  </Button>
                  {!isOnboarding && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={cancelEditing}
                      size="default"
                    >
                      {copy.usaha.cancelEdit}
                    </Button>
                  )}
                  {isOnboarding && (
                    <p className="text-xs text-muted-foreground">{copy.onboarding.note}</p>
                  )}
                </div>
              )}
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
                <div>
                  <Label htmlFor="biz-npwp" className="text-xs font-semibold">
                    {copy.usaha.npwpLabel}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {copy.usaha.npwpMeaning}
                  </p>
                </div>
                <Input
                  id="biz-npwp"
                  value={npwp}
                  onChange={(e) => setNpwp(e.target.value)}
                  placeholder={copy.usaha.npwpPlaceholder}
                  disabled={!isEditing}
                  className="font-mono text-xs bg-background disabled:opacity-85 disabled:cursor-not-allowed"
                />
              </div>

              {/* NIB OSS */}
              <div className="grid gap-1.5">
                <div>
                  <Label htmlFor="biz-nib" className="text-xs font-semibold">
                    {copy.usaha.nibLabel}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {copy.usaha.nibMeaning}
                  </p>
                </div>
                <Input
                  id="biz-nib"
                  value={nib}
                  onChange={(e) => setNib(e.target.value)}
                  placeholder={copy.usaha.nibPlaceholder}
                  disabled={!isEditing}
                  className="font-mono text-xs bg-background disabled:opacity-85 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground leading-normal">
                  {copy.usaha.nibExplainer}
                </p>
              </div>

              {/* Verified KBLI Badge */}
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-primary" />
                    <span className="text-xs font-semibold">{copy.usaha.kbliLabel}</span>
                  </div>
                  {business?.kbliCode ? (
                    <Badge variant="secondary" className="bg-tone-hijau-bg text-tone-hijau text-xs">
                      {copy.perizinan.verified}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
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
                      <p className="text-xs text-muted-foreground">
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
                <div className="relative pl-7 space-y-4">
                  {/* Single continuous vertical rail line connecting all nodes uninterrupted */}
                  <div className="absolute left-[11px] top-3.5 bottom-5 w-0.5 bg-border pointer-events-none" />

                  {legalDocs.map((doc) => (
                    <div key={doc.id} className="relative group">
                      {/* Node Circle positioned exactly on the vertical axis (axis is at left: 11px + 1px center = 12px) */}
                      {/* size-4 is 16px wide, so left is 12px - 8px = 4px inside the pl-7 container -> left: -24px relative to entry */}
                      <div className="absolute -left-[24px] top-3 z-10 size-4 rounded-full border-2 border-primary bg-background flex items-center justify-center ring-4 ring-background">
                        <div className="size-1.5 rounded-full bg-primary" />
                      </div>

                      {/* Card Content */}
                      <div className="rounded-lg border border-border bg-card p-3 shadow-2xs space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <FileText className="size-3.5 text-primary shrink-0" />
                            <h4 className="text-xs font-semibold text-foreground leading-tight truncate">
                              {doc.type}
                            </h4>
                          </div>
                          <Badge
                            variant={doc.status === "verified" ? "default" : "secondary"}
                            className="text-xs uppercase font-mono px-1.5 py-0 shrink-0"
                          >
                            {doc.status === "verified"
                              ? copy.usaha.statusVerified
                              : doc.status === "active"
                                ? copy.usaha.statusActive
                                : copy.usaha.statusInReview}
                          </Badge>
                        </div>

                        <div className="font-mono text-xs text-foreground/90 font-medium">
                          {doc.number}
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60 gap-1">
                          <span className="flex items-center gap-1 truncate">
                            <Building2 className="size-3 shrink-0" />
                            <span className="truncate">{doc.issuer}</span>
                          </span>
                          <span className="font-mono shrink-0">
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

      {/* ── Before vs After Confirmation Dialog ─────────────────────────── */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-md sm:max-w-lg bg-card border-border">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base font-semibold">
              {copy.usaha.confirmTitle}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {copy.usaha.confirmDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 my-2 max-h-[60vh] overflow-y-auto pr-1">
            {diffs.map((diff) => (
              <div
                key={diff.label}
                className="rounded-lg border border-border bg-muted/30 p-2.5 space-y-1.5 text-xs"
              >
                <span className="font-semibold text-muted-foreground block text-xs">
                  {diff.label}
                </span>
                <div className="grid grid-cols-2 gap-2 items-center">
                  <div className="rounded border border-border/70 bg-background/60 p-2 text-foreground/80">
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                      {copy.usaha.beforeLabel}
                    </span>
                    <span className="line-clamp-2 break-all">{diff.before}</span>
                  </div>
                  <div className="rounded border border-primary/40 bg-primary/5 p-2 text-foreground font-medium">
                    <span className="block text-xs uppercase tracking-wider text-primary font-semibold mb-0.5">
                      {copy.usaha.afterLabel}
                    </span>
                    <span className="line-clamp-2 break-all">{diff.after}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(false)}
            >
              {copy.usaha.cancelEdit}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={confirmSave}
              className="gap-1.5"
            >
              <Check className="size-3.5" />
              {copy.usaha.confirmAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
