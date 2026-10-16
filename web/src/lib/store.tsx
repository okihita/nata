"use client";

/**
 * Ledger state for the whole app.
 *
 * One provider at the shell level owns the journal; every screen reads derived
 * figures (laba rugi, posisi keuangan, pajak) from here so nothing on screen can
 * disagree with the journal itself. Persistence is localStorage, seeded with a
 * month of demo activity on first run.
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
  addEntry as addEntryToState,
  loadLedger,
  newId,
  saveLedger,
  seedEntries,
  type JournalEntry,
  type JournalLine,
  type LedgerState,
} from "./ledger";

const SEEDED_KEY = "nata.seeded.v3";
const STORAGE_KEY_VERSION = "nata.ledger.v3";

interface LedgerContextValue {
  entries: JournalEntry[];
  ready: boolean;
  addEntry: (input: {
    date: string;
    description: string;
    lines: JournalLine[];
    source?: JournalEntry["source"];
    receiptName?: string;
  }) => JournalEntry;
  resetToDemo: () => void;
  clearAll: () => void;
}

const LedgerContext = createContext<LedgerContextValue | null>(null);

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LedgerState>({ entries: [] });
  const [ready, setReady] = useState(false);

  // Load once on mount. On a brand-new browser, seed a month of demo data so
  // the dashboard and statements show a real shape.
  useEffect(() => {
    const loaded = loadLedger();
    const alreadySeeded = window.localStorage.getItem(SEEDED_KEY) === "1";
    if (loaded.entries.length === 0 && !alreadySeeded) {
      const seeded = seedEntries();
      setState({ entries: seeded });
      saveLedger({ entries: seeded });
      window.localStorage.setItem(SEEDED_KEY, "1");
    } else {
      setState(loaded);
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: LedgerState) => {
    setState(next);
    saveLedger(next);
  }, []);

  const addEntry = useCallback<LedgerContextValue["addEntry"]>(
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
        saveLedger(next);
        return next;
      });
      return entry;
    },
    [],
  );

  const resetToDemo = useCallback(() => {
    const seeded = seedEntries();
    persist({ entries: seeded });
    window.localStorage.setItem(SEEDED_KEY, "1");
  }, [persist]);

  const clearAll = useCallback(() => {
    persist({ entries: [] });
  }, [persist]);

  const value = useMemo<LedgerContextValue>(
    () => ({ entries: state.entries, ready, addEntry, resetToDemo, clearAll }),
    [state.entries, ready, addEntry, resetToDemo, clearAll],
  );

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

export function useLedger(): LedgerContextValue {
  const ctx = useContext(LedgerContext);
  if (!ctx) throw new Error("useLedger must be used inside <LedgerProvider>");
  return ctx;
}
