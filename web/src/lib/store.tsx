"use client";

/**
 * Identitas usaha + pembukuan (ledger) untuk seluruh aplikasi.
 *
 * Nilainya disimpan sebagai *external store* (bukan state React), lalu dibaca
 * komponen lewat `useSyncExternalStore`. Alasannya bukan gaya: datanya ada di
 * `localStorage`, dan `localStorage` memang penyimpanan eksternal. Pola ini
 * membuat:
 *
 *  - pembacaan awal terjadi di klien saja, dengan `getServerSnapshot` yang tetap
 *    sehingga render server dan render pertama klien tidak berbeda (tidak ada
 *    hydration mismatch);
 *  - tidak ada `setState` di dalam `useEffect`, jadi tidak ada render berantai
 *    saat halaman pertama dimuat;
 *  - pemanggil di luar React (mis. dari handler di modul lain) tetap bisa
 *    membaca dan mengubah data.
 *
 * Bentuk datanya sengaja tidak bergantung pada React, supaya penggantian ke
 * Firebase Auth + Firestore nanti hanya menyentuh lapisan penyimpanan.
 */

import { useSyncExternalStore } from "react";

import {
  clearBusiness,
  loadBusiness,
  newBusinessId,
  saveBusiness,
  type Business,
} from "./business";
import {
  addEntry as addEntryToState,
  clearLedger,
  loadLedger,
  newId,
  saveLedger,
  seedEntries,
  type JournalEntry,
  type JournalLine,
} from "./ledger";
import { clearTax } from "./agent-tax";
import { clearRegulasi, clearRegulasiSession } from "./agent-regulasi";

export interface WorkspaceSnapshot {
  /** Null until the owner has set up a business. */
  business: Business | null;
  entries: JournalEntry[];
  /** False until localStorage has been read — screens show a skeleton. */
  ready: boolean;
}

const EMPTY: WorkspaceSnapshot = { business: null, entries: [], ready: false };

/**
 * Server snapshot. Must be referentially stable, or React re-renders forever.
 * `ready: false` keeps prerendered HTML and the first client paint identical.
 */
const SERVER_SNAPSHOT: WorkspaceSnapshot = { business: null, entries: [], ready: false };

let snapshot: WorkspaceSnapshot = EMPTY;
let loaded = false;

const listeners = new Set<() => void>();

function emit(next: WorkspaceSnapshot): void {
  snapshot = next;
  for (const listener of listeners) listener();
}

/** Read localStorage once, on the client, on first subscribe. */
function ensureLoaded(): void {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const business = loadBusiness();
  emit({
    business,
    entries: business ? loadLedger(business.id).entries : [],
    ready: true,
  });
}

/** Test/dev affordance: forget the in-memory cache so the next read reloads. */
export function invalidateWorkspace(): void {
  loaded = false;
  emit(EMPTY);
}

// ── Actions ─────────────────────────────────────────────────────────────────

function persist(entries: JournalEntry[], business: Business | null): void {
  if (business) saveLedger({ entries }, business.id);
  emit({ ...snapshot, entries, ready: true });
}

export function createBusiness(input: {
  name: string;
  ownerName: string;
  type: Business["type"];
  entity: Business["entity"];
}): Business {
  const biz: Business = {
    id: newBusinessId(),
    name: input.name.trim(),
    ownerName: input.ownerName.trim(),
    type: input.type,
    entity: input.entity,
    createdAt: new Date().toISOString(),
  };
  saveBusiness(biz);
  // A brand-new business starts with an empty journal.
  saveLedger({ entries: [] }, biz.id);
  emit({ business: biz, entries: [], ready: true });
  return biz;
}

export function updateBusiness(patch: Partial<Omit<Business, "id" | "createdAt">>): void {
  const current = snapshot.business;
  if (!current) return;
  const next = { ...current, ...patch };
  saveBusiness(next);
  emit({ ...snapshot, business: next });
}

export function addEntry(input: {
  date: string;
  description: string;
  lines: JournalLine[];
  source?: JournalEntry["source"];
  receiptName?: string;
}): JournalEntry {
  const entry: JournalEntry = {
    id: newId(),
    date: input.date,
    description: input.description,
    lines: input.lines.map((line) => ({
      account: line.account,
      debit: line.debit || 0,
      credit: line.credit || 0,
    })),
    source: input.source ?? "manual",
    receiptName: input.receiptName,
    createdAt: new Date().toISOString(),
  };
  const next = addEntryToState({ entries: snapshot.entries }, entry);
  persist(next.entries, snapshot.business);
  return entry;
}

/** Explicitly load the demo cafe books (demo affordance, never automatic). */
export function loadDemo(): void {
  persist(seedEntries(), snapshot.business);
}

/** Empty the current business's journal. */
export function clearAll(): void {
  persist([], snapshot.business);
}

/** Forget everything — business, its books, and any cached agent output. */
export function reset(): void {
  // Remove the business's own ledger key too. Each business is namespaced
  // (`nata.ledger.v3.<businessId>`), so clearing the business alone left its
  // journal orphaned in localStorage forever.
  const doomed = snapshot.business?.id;
  clearBusiness();
  if (doomed) clearLedger(doomed);
  // Agent caches are keyed to the business that produced them. Leaving them
  // behind would let a new business inherit a previous one's tax assessment or
  // KBLI code — and resume an ADK session that belongs to someone else's books.
  clearTax();
  clearRegulasi();
  clearRegulasiSession();
  loaded = true; // deliberate: do not re-read the storage we just cleared
  emit({ business: null, entries: [], ready: true });
}

// ── React binding ───────────────────────────────────────────────────────────

function subscribe(onChange: () => void): () => void {
  ensureLoaded();
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): WorkspaceSnapshot {
  return snapshot;
}

function getServerSnapshot(): WorkspaceSnapshot {
  return SERVER_SNAPSHOT;
}

export interface Workspace extends WorkspaceSnapshot {
  createBusiness: typeof createBusiness;
  updateBusiness: typeof updateBusiness;
  addEntry: typeof addEntry;
  loadDemo: typeof loadDemo;
  clearAll: typeof clearAll;
  reset: typeof reset;
}

export function useWorkspace(): Workspace {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    ...snap,
    createBusiness,
    updateBusiness,
    addEntry,
    loadDemo,
    clearAll,
    reset,
  };
}
