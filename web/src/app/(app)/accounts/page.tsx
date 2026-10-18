"use client";

import { BookOpen, ScanLine } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/app-sidebar";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NORMAL_SIDE, codeOf, type AccountGroup } from "@/lib/sak-emkm";
import { trialBalance } from "@/lib/ledger";
import { useWorkspace } from "@/lib/store";
import { useLanguage } from "@/lib/copy";
import { idrFull } from "@/lib/format";

const GROUPS: AccountGroup[] = ["aset", "liabilitas", "ekuitas", "pendapatan", "beban"];

export default function AkunPage() {
  const { copy } = useLanguage();
  const { entries, ready } = useWorkspace();
  const balances = trialBalance(entries);

  // Group the *used* accounts by their SAK EMKM class, in the canonical order.
  const byGroup = new Map<AccountGroup, { account: string; amount: number }[]>();
  for (const group of GROUPS) byGroup.set(group, []);
  for (const row of balances) {
    if (!row.group) continue;
    // `natural` reads positive on the account's own side, so credit-normal
    // accounts (Modal, Pendapatan) don't render as negative numbers.
    byGroup.get(row.group)?.push({ account: row.account, amount: row.natural });
  }

  /**
   * Group total, oriented to the group's normal side. Contra accounts
   * (Prive, Akumulasi Penyusutan) carry a raw balance opposite their group,
   * so they subtract naturally — the group foot must match the balance sheet.
   */
  const groupTotal = (group: AccountGroup) => {
    const side = NORMAL_SIDE[group];
    return balances
      .filter((b) => b.group === group)
      .reduce((sum, b) => sum + (side === "debit" ? b.balance : -b.balance), 0);
  };

  if (!ready) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  // With no entries, every group is empty and five empty cards say nothing.
  if (entries.length === 0) {
    return (
      <>
        <PageHeader title={copy.akun.title} subtitle={copy.akun.subtitle} />
        <Card>
          <CardContent>
            <EmptyState
              icon={<BookOpen className="size-6" />}
              title={copy.akun.emptyTitle}
              body={copy.akun.emptyBody}
              actions={
                <Button asChild size="sm">
                  <Link href="/record">
                    <ScanLine className="mr-2 size-4" />
                    {copy.dashboard.actionScan}
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      </>
    );
  }

  const totalUsedAccounts = balances.filter((b) => b.group).length;

  const renderGroupCard = (group: AccountGroup) => {
    const rows = byGroup.get(group) ?? [];
    const total = groupTotal(group);
    const side = NORMAL_SIDE[group];

    return (
      <Card key={group} className="border-border/60 shadow-none">
        <CardHeader className="py-4 px-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold">{copy.akun[group]}</CardTitle>
              <CardDescription className="text-xs">
                {side === "debit" ? copy.akun.normalDebit : copy.akun.normalCredit}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="tabular-nums font-mono text-xs">
              {idrFull(total)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-4 pt-0">
          {rows.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">
              {copy.common.empty}
            </p>
          ) : (
            <ul className="divide-y divide-border/40">
              {rows.map((row) => {
                const code = codeOf(row.account) ?? "—";
                return (
                  <li key={row.account} className="flex items-center gap-3 py-2.5">
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                      <BookOpen className="size-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium leading-snug">{row.account}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {code} · {copy.akun.used}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium tabular-nums font-mono">
                      {idrFull(row.amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <PageHeader
        title={copy.akun.title}
        subtitle={copy.akun.subtitle}
        badge={copy.akun.activeAccountsCount(totalUsedAccounts)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Financial Position (Neraca / Real Accounts) */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              {copy.akun.positionTitle}
            </h2>
            <p className="text-xs text-muted-foreground">
              {copy.akun.positionSubtitle}
            </p>
          </div>
          <div className="space-y-4">
            {renderGroupCard("aset")}
            {renderGroupCard("liabilitas")}
            {renderGroupCard("ekuitas")}
          </div>
        </section>

        {/* Right Column: Financial Performance (Laba Rugi / Nominal Accounts) */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              {copy.akun.performanceTitle}
            </h2>
            <p className="text-xs text-muted-foreground">
              {copy.akun.performanceSubtitle}
            </p>
          </div>
          <div className="space-y-4">
            {renderGroupCard("pendapatan")}
            {renderGroupCard("beban")}
          </div>
        </section>
      </div>
    </>
  );
}
