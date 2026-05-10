"use client";
import { useCallback, useSyncExternalStore } from "react";
import type { SetStats, AttemptSummary } from "@/types";

const STATS_KEY = "mcq_stats";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): Record<string, SetStats> {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function getServerSnapshot() {
  return {};
}

export function recalculateStats(attempts: AttemptSummary[]) {
  const statsMap: Record<string, { correct: number; total: number; percentages: number[]; dates: string[] }> = {};

  for (const a of attempts) {
    if (!statsMap[a.setId]) {
      statsMap[a.setId] = { correct: 0, total: 0, percentages: [], dates: [] };
    }
    statsMap[a.setId].correct += a.score;
    statsMap[a.setId].total += a.total;
    statsMap[a.setId].percentages.push(a.percentage);
    statsMap[a.setId].dates.push(a.completedAt);
  }

  const result: Record<string, SetStats> = {};
  for (const [setId, data] of Object.entries(statsMap)) {
    const bestPct = Math.max(...data.percentages);
    const avgPct = Math.round(
      data.percentages.reduce((s, p) => s + p, 0) / data.percentages.length
    );
    const lastDate = data.dates.sort().reverse()[0] ?? "";

    result[setId] = {
      setId,
      totalAttempts: data.percentages.length,
      bestPercentage: bestPct,
      averagePercentage: avgPct,
      totalCorrect: data.correct,
      totalAnswered: data.total,
      lastAttemptDate: lastDate,
    };
  }

  localStorage.setItem(STATS_KEY, JSON.stringify(result));
  return result;
}

export function useStats() {
  const stats = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const refresh = useCallback(() => {}, []);

  return {
    stats,
    refresh,
    recalculateStats,
  };
}
