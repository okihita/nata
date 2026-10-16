"use client";

import { BookOpen } from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GROUP_LABEL, NORMAL_SIDE, codeOf, type AccountGroup } from "@/lib/sak-emkm";
import { trialBalance } from "@/lib/ledger";
import { useLedger } from "@/lib/store";
import { copy } from "@/lib/copy";
import { idrFull } from "@/lib/format";

const GROUPS: AccountGroup[] = ["aset", "liabilitas", "ekuitas", "pendapatan", "beban"];

export default function AkunPage() {
  const { entries, ready } = useLedger();
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

  return (
    <>
      <PageHeader title={copy.akun.title} subtitle={copy.akun.subtitle} />

      <div className="space-y-6">
        {GROUPS.map((group) => {
          const rows = byGroup.get(group) ?? [];
          const total = groupTotal(group);
          const side = NORMAL_SIDE[group];
          return (
            <Card key={group}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{GROUP_LABEL[group]}</CardTitle>
                    <CardDescription>
                      {side === "debit" ? copy.akun.normalDebit : copy.akun.normalCredit}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="tabular-nums">
                    {idrFull(total)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {rows.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    {copy.common.empty}
                  </p>
                ) : (
                  <ul className="divide-y">
                    {rows.map((row) => {
                      const code = codeOf(row.account) ?? "—";
                      return (
                        <li key={row.account} className="flex items-center gap-3 py-2.5">
                          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                            <BookOpen className="size-3.5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{row.account}</p>
                            <p className="text-xs text-muted-foreground">
                              {code} · {copy.akun.used}
                            </p>
                          </div>
                          <span className="shrink-0 text-sm font-medium tabular-nums">
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
        })}
      </div>
    </>
  );
}
