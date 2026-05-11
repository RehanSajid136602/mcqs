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

export interface RecentActivityItem {
  subjectId: string;
  quizId: string;
  chapterName: string;
  setNumber: string;
  percentage: number;
  timestamp: string;
  totalQuestions: number;
}

function formatTimeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return "just now";

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function useRecentActivity(limit = 4): RecentActivityItem[] {
  return useMemo(() => {
    const attempts = getAttempts();
    if (attempts.length === 0) return [];

    const completed = attempts
      .filter((a) => a.completedAt && a.total > 0)
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() -
          new Date(a.completedAt).getTime()
      )
      .slice(0, limit);

    return completed.map((a) => ({
      subjectId: a.subjectId,
      quizId: a.setId,
      chapterName: a.chapterId,
      setNumber: a.setId,
      percentage: a.percentage,
      timestamp: a.completedAt,
      totalQuestions: a.total,
    }));
  }, [limit]);
}

export { formatTimeAgo };