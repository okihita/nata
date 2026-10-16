# Research notes — UI/UX + accounting engine selection

Two research passes fed the dashboard build. Recorded here so the decisions are
auditable rather than folklore.

---

## 1. Indonesian SME accounting/ERP — how the incumbents build UI/UX

### Landscape

| Tier | Products | Audience | Form factor |
| --- | --- | --- | --- |
| Enterprise-lite | Mekari Jurnal, Accurate Online, MASERP, Ukirama, Krishand | Accounting staff, 10–500 employees | Desktop web (mobile secondary) |
| SMB self-serve | Kledo, Zahir Online | Owner-operators who "aren't from an accounting background" | Desktop + mobile apps |
| Micro/UMKM | BukuWarung, BukuKas (closed 2023) | Warung, toko kelontong, kafe, online sellers | **Android-first**, one hand |

The split matters: the enterprise tier sells *completeness*; the UMKM tier sells
*"you don't need to understand accounting."* Nata deliberately sits in the second
lane while borrowing credibility signals (Pasal citations, Coretax hooks) from the
first.

### Sidebar vocabulary used by incumbents

Consensus nouns across Mekari Jurnal, Accurate, Zahir and Kledo:

```
Dasbor · Penjualan · Pembelian · Kas & Bank · Persediaan
Piutang & Utang · Pajak · Laporan · Pengaturan
```

Adopted: **colour-coded menu groups** (Accurate colour-codes menu *types*),
**Pajak as a top-level item** rather than buried under Laporan.

### What we copied

- **Colour-coded navigation groups**, one semantic tone per group.
- **Mobile-first reach** — BukuWarung/BukuKas are Android-first because most of
  this audience is. Desktop keeps the full sidebar; phones get a **bottom tab
  bar** covering the demo path.
- **A "Perlu tindakan" panel.** Incumbents' empty states are weak; a panel that
  says nothing needs doing *is itself information*.
- **Plain-language microcopy.** "struk", "pembukuan", "bayar nanti", "uang masuk".

### What we avoided (anti-patterns)

- Chart-of-accounts and debit/credit language on the dashboard.
- Deep nested menus.
- Formal register ("Anda" everywhere as a cold formality). We use "Anda" once per
  screen at most, and prefer direct phrasing.

---

## 2. Open-source double-entry engines — evaluation

**Headline finding: no open-source engine supports SAK EMKM.** Every candidate is
IFRS/GAAP-oriented, with English account taxonomies. The closest open *chart of
accounts* is a converted ERPNext tree — and it uses legacy Dutch-colonial labels
(Aktiva/Passiva), which are **not** SAK EMKM terms.

### Candidates evaluated

| Name | Language | License | Notes |
| --- | --- | --- | --- |
| python-accounting (`ekmungai`) | Python | **MIT** | IFRS-oriented; account/journal/trial-balance model. |
| django-hordak | Python | **MIT** | Minimal, clean: Account + Leg + balanced Transaction. |
| medici (`flash-oss`) | **TypeScript** | **MIT** | Double-entry ledger on MongoDB; good fit if a TS ledger is wanted. |
| django-ledger | Python | **GPL-3.0** | Full subsystem, but copyleft. |
| beancount v3 | Python | **GPL-2.0** | Strong validation, but plain-text DSL — wrong shape for a web app. |

### Decision

**Build the ledger in-repo, dependency-free.** Rationale:

1. **None of them speak SAK EMKM.** Adopting one means mapping our chart of
   accounts onto a foreign taxonomy — more work than the ~200 lines of domain
   logic in `web/src/lib/ledger.ts`, and it puts an unfamiliar vocabulary between
   the code and the standard we must cite to judges.
2. **Licence risk.** The mature options (django-ledger, beancount) are GPL. This
   is a hosted product; MIT/Apache is the safe default. `medici` and
   `python-accounting` are MIT but Python/Mongo-shaped.
3. **Our guardrail is already the thing that matters.** The valuable invariant is
   exact debit == credit plus Aset = Liabilitas + Ekuitas — which we enforce
   ourselves in `commit_journal_entry` (Python) and mirror in the derived
   statements (TypeScript).

This remains revisitable: if a TS ledger is ever wanted, **medici** (MIT) is the
best candidate.

### Statutory constants encoded

- **PPh Final UMKM — 0,5%** of *gross turnover* (not profit), per PP 55/2022.
- **Rp 500 million** annual turnover exemption, **individual taxpayers only**
  (not PT Perorangan).
- Annual ceiling **Rp 4,8 billion**.

---

## 3. SAK EMKM — what the standard actually prescribes

**Corrected an assumption during research: SAK EMKM prescribes exactly THREE
statement components, not five.**

| Statement | Indonesian name | Status |
| --- | --- | --- |
| Statement of financial position | **Laporan Posisi Keuangan** | implemented |
| Statement of profit or loss | **Laporan Laba Rugi** | implemented |
| Notes to the financial statements | **Catatan atas Laporan Keuangan (CALK)** | implemented |

A cash-flow statement would be **over-engineering relative to the standard** —
SAK EMKM does not require one for micro/small entities.

### Validation rules worth enforcing

- **R1 — balanced entry.** Sum of debits == sum of credits, exactly. This is the
  single guardrail worth enforcing exhaustively, because it *is* double-entry.
- **R9 — period close.** Current-period profit must fold into equity as *Laba
  Tahun Berjalan* before asserting `Aset = Liabilitas + Ekuitas`. The strict
  three-term equation only holds after close, never mid-period. Implemented in
  `balanceSheet()`.

### Account groups

SAK EMKM's five-class vocabulary, used as our chart-of-accounts backbone:

```
Aset · Liabilitas · Ekuitas · Pendapatan · Beban
```

Our chart holds 38 accounts. Contra accounts (*Prive* in Ekuitas, *Akumulasi
Penyusutan* in Aset, *Retur dan Diskon Penjualan* in Pendapatan) invert their
group's normal side and are flagged as such in `sak-emkm.ts`.

### Terminology corrections applied

- **Beban**, not *Biaya* — *biaya* was the pre-2015 term; SAK EMKM bab 5.2 says
  *beban*.
- **Pendapatan Penjualan**, not *Pemasukan*.
- **Laporan Posisi Keuangan** in report titles (not *Neraca*, which is the
  colloquial synonym).
- **Prive** for owner withdrawals; **Akumulasi Penyusutan** (one *m*, two *s*).

### On the open question of a SAK EMKM chart of accounts

The standard **does not prescribe one**, so every "SAK EMKM COA" in the wild is
supplementary practice rather than citable standard. The closest open-source
artefact (ERPNext's verified Indonesian COA) mislabels the five groups using
legacy Dutch-era terms (*Aktiva / Passiva / Modal*). Ours is grounded in the
standard's named positions and group names, and is documented as such —
useful and defensible, but not a citation from the standard text.
