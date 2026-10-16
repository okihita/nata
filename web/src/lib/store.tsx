"use client";

/**
 * Identitas usaha + pembukuan (ledger) untuk seluruh aplikasi.
 *
 * Dua hal yang dimiliki provider ini:
 *  1. `business` — usaha mana yang sedang dipakai (nama, jenis, jenis pajak).
 *  2. `entries` — jurnal usaha itu, disimpan per-usaha lewat namespace.
 *
 * Sebelumnya jurnal disemai otomatis dengan data contoh sebuah kafe. Sekarang
 * tidak: usaha baru mulai dari pembukuan kosong, dan pemilik mengisi usahanya
 * sendiri lewat /usaha. Data contoh tetap tersedia sebagai aksi eksplisit
 * (`loadDemo`) supaya demo tetap mudah, tapi tidak pernah muncul sendiri.
 *
 * Bentuk data sengaja tidak bergantung pada React, supaya penggantian ke
 * Firebase Auth + Firestore nanti hanya menyentuh lapisan penyimpanan.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  BUSINESS_STORAGE_KEY,
  clearBusiness,
  loadBusiness,
  newBusinessId,
  saveBusiness,
  type Business,
} from "./business";
import {
  addEntry as addEntryToState,
  loadLedger,
  newId,
  saveLedger,
  seedEntries,
  type JournalEntry,
  type JournalLine,
  type LedgerState,
} from "./ledger";

interface WorkspaceContextValue {
  /** Null until the owner has set up a business. */
  business: Business | null;
  entries: JournalEntry[];
  /** False until localStorage has been read — screens show a skeleton. */
  ready: boolean;
  /** Create the business (onboarding). */
  createBusiness: (input: {
    name: string;
    ownerName: string;
    type: Business["type"];
    taxpayer: Business["taxpayer"];
  }) => Business;
  /** Edit the business (Profil Usaha). */
  updateBusiness: (patch: Partial<Omit<Business, "id" | "createdAt">>) => void;
  addEntry: (input: {
    date: string;
    description: string;
    lines: JournalLine[];
    source?: JournalEntry["source"];
    receiptName?: string;
  }) => JournalEntry;
  /** Explicitly load the demo café books (demo affordance, never automatic). */
  loadDemo: () => void;
  /** Empty the current business's journal. */
  clearAll: () => void;
  /** Forget everything — business and its books. */
  reset: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [state, setState] = useState<LedgerState>({ entries: [] });
  const [ready, setReady] = useState(false);

  // Load once on mount: the business identity and its journal.
  useEffect(() => {
    const biz = loadBusiness();
    setBusiness(biz);
    setState(biz ? loadLedger(biz.id) : { entries: [] });
    setReady(true);
  }, []);

  const persistLedger = useCallback(
    (next: LedgerState, forBusiness: Business | null) => {
      setState(next);
      if (forBusiness) saveLedger(next, forBusiness.id);
    },
    [],
  );

  const createBusiness = useCallback<WorkspaceContextValue["createBusiness"]>(
    (input) => {
      const biz: Business = {
        id: newBusinessId(),
        name: input.name.trim(),
        ownerName: input.ownerName.trim(),
        type: input.type,
        taxpayer: input.taxpayer,
        createdAt: new Date().toISOString(),
      };
      saveBusiness(biz);
      setBusiness(biz);
      // A brand-new business starts with an empty journal.
      persistLedger({ entries: [] }, biz);
      return biz;
    },
    [persistLedger],
  );

  const updateBusiness = useCallback<WorkspaceContextValue["updateBusiness"]>(
    (patch) => {
      setBusiness((current) => {
        if (!current) return current;
        const next = { ...current, ...patch };
        saveBusiness(next);
        return next;
      });
    },
    [],
  );

  const addEntry = useCallback<WorkspaceContextValue["addEntry"]>(
    (input) => {
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
      setState((current) => {
        const next = addEntryToState(current, entry);
        if (business) saveLedger(next, business.id);
        return next;
      });
      return entry;
    },
    [business],
  );

  const loadDemo = useCallback(() => {
    const seeded = seedEntries();
    persistLedger({ entries: seeded }, business);
  }, [business, persistLedger]);

  const clearAll = useCallback(() => {
    persistLedger({ entries: [] }, business);
  }, [business, persistLedger]);

  const reset = useCallback(() => {
    clearBusiness();
    setBusiness(null);
    setState({ entries: [] });
  }, []);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      business,
      entries: state.entries,
      ready,
      createBusiness,
      updateBusiness,
      addEntry,
      loadDemo,
      clearAll,
      reset,
    }),
    [
      business,
      state.entries,
      ready,
      createBusiness,
      updateBusiness,
      addEntry,
      loadDemo,
      clearAll,
      reset,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return ctx;
}

export { BUSINESS_STORAGE_KEY };
