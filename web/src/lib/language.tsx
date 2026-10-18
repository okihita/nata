"use client";

import * as React from "react";
import { copyId } from "./copy-id";
import { copyEn } from "./copy-en";

export type Locale = "en" | "id";
export const LANGUAGE_STORAGE_KEY = "nata.lang.v1";

type DeepStringify<T> = {
  readonly [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T[K] extends readonly (infer U)[]
      ? readonly (U extends object ? DeepStringify<U> : string)[]
      : T[K] extends object
        ? DeepStringify<T[K]>
        : string;
};

export type TranslationDictionary = DeepStringify<typeof copyId>;

let currentLocale: Locale = "en";
let loaded = false;
const listeners = new Set<() => void>();

function emit(next: Locale): void {
  currentLocale = next;
  for (const listener of listeners) listener();
}

function ensureLoaded(): void {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (raw === "id" || raw === "en") {
      emit(raw);
      return;
    }
  } catch {
    /* localStorage inaccessible */
  }
  emit("en");
}

export function setLocale(locale: Locale): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }
  emit(locale);
}

function subscribe(onChange: () => void): () => void {
  ensureLoaded();
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): Locale {
  return currentLocale;
}

function getServerSnapshot(): Locale {
  return "en";
}

export function useLanguage(): {
  locale: Locale;
  setLocale: (next: Locale) => void;
  copy: TranslationDictionary;
} {
  const locale = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const copy = locale === "id" ? copyId : copyEn;

  return {
    locale,
    setLocale,
    copy,
  };
}
