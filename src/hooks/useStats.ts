"use client";
import { useState, useCallback } from "react";
import type { SetStats, AttemptSummary } from "@/types";

const STATS_KEY = "mcq_stats";

function getStats(): Record<string, SetStats> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function setStats(data: Record<string, SetStats>) {
  localStorage.setItem(STATS_KEY, JSON.stringify(data));
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

  setStats(result);
  return result;
}

export function useStats() {
  const [stats, setStatsState] = useState<Record<string, SetStats>>({});

  const refresh = useCallback(() => {
    setStatsState(getStats());
  }, []);

  return {
    stats,
    refresh,
    recalculateStats,
  };
}
