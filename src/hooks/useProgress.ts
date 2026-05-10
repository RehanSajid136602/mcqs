"use client";
import { useCallback, useSyncExternalStore } from "react";
import type { SetProgress } from "@/types";

const STORAGE_KEY = "mcq_progress";
const EMPTY_PROGRESS: Record<string, SetProgress> = {};

let cached: Record<string, SetProgress> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function readStore(): Record<string, SetProgress> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, SetProgress>;
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = () => {
    cached = null;
    notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Record<string, SetProgress> {
  if (cached === null) {
    cached = readStore();
  }
  return cached;
}

function getServerSnapshot(): Record<string, SetProgress> {
  return EMPTY_PROGRESS;
}

function setSnapshot(data: Record<string, SetProgress>) {
  cached = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  notify();
}

export function getAllProgress(): Record<string, SetProgress> {
  return getSnapshot();
}

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const saveProgress = useCallback((setId: string, score: number, total: number) => {
    const existing = getSnapshot();
    const current = existing[setId];
    const next = {
      ...existing,
      [setId]: {
        highScore: current ? Math.max(current.highScore, score) : score,
        total,
        attempts: (current?.attempts ?? 0) + 1,
        lastAttempt: new Date().toISOString(),
      },
    };
    setSnapshot(next);
  }, []);

  return { progress, saveProgress };
}
