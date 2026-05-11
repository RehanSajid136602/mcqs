"use client";

import { useMemo } from "react";
import type { AttemptSummary } from "@/types";

const ATTEMPTS_KEY = "mcq_attempts";

function getAttempts(): AttemptSummary[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AttemptSummary[];
  } catch {
    return [];
  }
}

/** Get a date string in YYYY-MM-DD format from an ISO timestamp */
function toDateKey(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function useStreak(): { currentStreak: number; bestStreak: number } {
  return useMemo(() => {
    const attempts = getAttempts();
    if (attempts.length === 0) return { currentStreak: 0, bestStreak: 0 };

    // Collect unique dates where at least one attempt was completed
    const completedDates = new Set<string>();
    for (const a of attempts) {
      if (a.completedAt) {
        completedDates.add(toDateKey(a.completedAt));
      }
    }

    if (completedDates.size === 0) return { currentStreak: 0, bestStreak: 0 };

    // Sort dates descending (newest first)
    const sorted = Array.from(completedDates).sort().reverse();

    // Calculate current streak from today backwards
    const today = toDateKey(new Date().toISOString());
    let currentStreak = 0;

    // Check if today or yesterday has activity to start counting
    const yesterday = toDateKey(
      new Date(Date.now() - 86400000).toISOString()
    );

    if (sorted[0] === today || sorted[0] === yesterday) {
      // Start from the most recent date and count backwards
      let checkDate = new Date(sorted[0] + "T00:00:00Z");
      for (const dateStr of sorted) {
        const expected = toDateKey(checkDate.toISOString());
        if (dateStr === expected) {
          currentStreak++;
          // Move to previous day
          checkDate = new Date(checkDate.getTime() - 86400000);
        } else if (dateStr < expected) {
          break;
        }
        // If dateStr > expected, skip (shouldn't happen with sorted desc)
      }
    }

    // Calculate best streak
    const ascDates = Array.from(completedDates).sort();
    let bestStreak = 1;
    let runStreak = 1;

    for (let i = 1; i < ascDates.length; i++) {
      const prev = new Date(ascDates[i - 1] + "T00:00:00Z");
      const curr = new Date(ascDates[i] + "T00:00:00Z");
      const diffDays = Math.round(
        (curr.getTime() - prev.getTime()) / 86400000
      );

      if (diffDays === 1) {
        runStreak++;
        bestStreak = Math.max(bestStreak, runStreak);
      } else {
        runStreak = 1;
      }
    }

    // If only one day, bestStreak is 1
    if (ascDates.length === 1) bestStreak = 1;

    return { currentStreak, bestStreak };
  }, []);
}