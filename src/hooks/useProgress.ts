"use client";
import { useState, useCallback } from "react";
import type { SetProgress } from "@/types";

const STORAGE_KEY = "mcq_progress";

function getStorage(): Record<string, SetProgress> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function setStorage(data: Record<string, SetProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getProgress(setId: string): SetProgress | null {
  return getStorage()[setId] ?? null;
}

export function saveProgress(setId: string, score: number, total: number) {
  const existing = getStorage();
  const current = existing[setId];
  existing[setId] = {
    highScore: current ? Math.max(current.highScore, score) : score,
    total,
    attempts: (current?.attempts ?? 0) + 1,
    lastAttempt: new Date().toISOString(),
  };
  setStorage(existing);
}

export function getAllProgress(): Record<string, SetProgress> {
  return getStorage();
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, SetProgress>>({});

  const refresh = useCallback(() => {
    setProgress(getStorage());
  }, []);

  return { progress, refresh, getProgress, saveProgress, getAllProgress };
}