"use client";
import { useCallback, useSyncExternalStore } from "react";
import type { AttemptSummary, AttemptDetail, QuestionAttempt } from "@/types";

const ATTEMPTS_KEY = "mcq_attempts";
const DETAILS_KEY = "mcq_attempt_details";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getAttempts(): AttemptSummary[] {
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS_KEY) ?? "[]") as AttemptSummary[];
  } catch {
    return [] as AttemptSummary[];
  }
}

function getDetails(): Record<string, AttemptDetail> {
  try {
    return JSON.parse(localStorage.getItem(DETAILS_KEY) ?? "{}") as Record<string, AttemptDetail>;
  } catch {
    return {} as Record<string, AttemptDetail>;
  }
}

function setAttempts(data: AttemptSummary[]) {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data));
}

function setDetails(data: Record<string, AttemptDetail>) {
  localStorage.setItem(DETAILS_KEY, JSON.stringify(data));
}

export function createAttempt(
  setId: string,
  subjectId: string,
  chapterId: string
): string {
  const id = crypto.randomUUID();
  const summary: AttemptSummary = {
    id,
    setId,
    subjectId,
    chapterId,
    score: 0,
    total: 0,
    percentage: 0,
    startedAt: new Date().toISOString(),
    completedAt: "",
    duration: 0,
  };
  const attempts = getAttempts();
  attempts.unshift(summary);
  setAttempts(attempts);
  return id;
}

export function finalizeAttempt(
  attemptId: string,
  questions: QuestionAttempt[]
) {
  const now = new Date().toISOString();
  const attempts = getAttempts();
  const idx = attempts.findIndex((a) => a.id === attemptId);
  if (idx === -1) return;

  const total = questions.length;
  const score = questions.filter((q) => q.wasCorrect).length;
  const startedAt = new Date(attempts[idx].startedAt).getTime();
  const completedAt = new Date(now).getTime();

  attempts[idx] = {
    ...attempts[idx],
    score,
    total,
    percentage: total > 0 ? Math.round((score / total) * 100) : 0,
    completedAt: now,
    duration: Math.round((completedAt - startedAt) / 1000),
  };
  setAttempts(attempts);

  const details = getDetails();
  details[attemptId] = { attemptId, questions };
  setDetails(details);
}

export function getAttemptsForSet(setId: string): AttemptSummary[] {
  return getAttempts().filter((a) => a.setId === setId);
}

export function getAttemptDetail(attemptId: string): AttemptDetail | null {
  return getDetails()[attemptId] ?? null;
}

export function getAllAttempts(): AttemptSummary[] {
  return getAttempts();
}

export function useAttemptHistory() {
  const attempts = useSyncExternalStore(subscribe, getAttempts, () => []);

  return {
    attempts,
    createAttempt,
    finalizeAttempt,
    getAttemptsForSet,
    getAttemptDetail,
    getAllAttempts,
  };
}
