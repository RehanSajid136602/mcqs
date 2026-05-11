"use client";

import { create } from "zustand";
import { storage } from "@/lib/storage";
import {
  computeSubjectAnalytics,
  computeGlobalAnalytics,
  computeStreak,
  isDataEmpty,
} from "@/lib/analytics";
import type {
  AttemptSummary,
  AttemptDetail,
  QuestionAttempt,
  SetProgress,
  StudySession,
  SubjectAnalytics,
  GlobalAnalytics,
  Subject,
} from "@/types";

interface QuizStore {
  attempts: AttemptSummary[];
  details: Record<string, AttemptDetail>;
  progress: Record<string, SetProgress>;
  currentSession: StudySession | null;
  currentStreak: number;
  bestStreak: number;
  globalAnalytics: GlobalAnalytics;
  subjectAnalytics: SubjectAnalytics[];
  isEmpty: boolean;
  subjects: Subject[];

  setSubjects: (subjects: Subject[]) => void;

  createAttempt: (setId: string, subjectId: string, chapterId: string) => string;
  finalizeAttempt: (
    attemptId: string,
    questions: QuestionAttempt[],
    subjectId: string,
    chapterId: string
  ) => void;

  refresh: () => void;
}

function load(): {
  attempts: AttemptSummary[];
  details: Record<string, AttemptDetail>;
  progress: Record<string, SetProgress>;
} {
  return {
    attempts: storage.get<AttemptSummary[]>("mcq_attempts", []),
    details: storage.get<Record<string, AttemptDetail>>("mcq_attempt_details", {}),
    progress: storage.get<Record<string, SetProgress>>("mcq_progress", {}),
  };
}

function persistAll(
  attempts: AttemptSummary[],
  details: Record<string, AttemptDetail>,
  progress: Record<string, SetProgress>
) {
  storage.set("mcq_attempts", attempts);
  storage.set("mcq_attempt_details", details);
  storage.set("mcq_progress", progress);
  storage.flushImmediate();
}

function recomputeAnalytics(
  attempts: AttemptSummary[],
  prevStreak: { currentStreak: number; bestStreak: number },
  subjectAnalytics: SubjectAnalytics[]
): {
  currentStreak: number;
  bestStreak: number;
  globalAnalytics: GlobalAnalytics;
  subjectAnalytics: SubjectAnalytics[];
  isEmpty: boolean;
} {
  const streak = computeStreak(attempts);
  const newCurrentStreak = Math.max(streak.currentStreak, prevStreak.currentStreak);
  const newBestStreak = Math.max(streak.bestStreak, prevStreak.bestStreak);

  const globalAnalytics = computeGlobalAnalytics(
    attempts,
    newCurrentStreak,
    newBestStreak,
    subjectAnalytics
  );

  return {
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    globalAnalytics,
    subjectAnalytics,
    isEmpty: isDataEmpty(attempts),
  };
}

export const useQuizStore = create<QuizStore>((set, get) => {
  const initial = load();

  const { currentStreak, bestStreak } = computeStreak(initial.attempts);

  return {
    attempts: initial.attempts,
    details: initial.details,
    progress: initial.progress,
    currentSession: null,
    currentStreak,
    bestStreak,
    globalAnalytics: {
      totalAttempts: 0,
      totalQuizzes: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      averageScore: 0,
      bestScore: 0,
      totalStudyMinutes: 0,
      weeklyQuizzes: 0,
      currentStreak,
      bestStreak,
      strongestSubjectId: null,
      weakestSubjectId: null,
      recentScoreDelta: 0,
      lastAttemptDate: "",
    },
    subjectAnalytics: [],
    isEmpty: true,
    subjects: [],

    setSubjects: (subjects: Subject[]) => {
      const state = get();
      const analytics = subjects.map((s) =>
        computeSubjectAnalytics(
          s.id,
          s.name,
          state.attempts,
          s.chapters.length
        )
      );

      const recomputed = recomputeAnalytics(
        state.attempts,
        { currentStreak: state.currentStreak, bestStreak: state.bestStreak },
        analytics
      );

      set({
        subjects,
        subjectAnalytics: analytics,
        currentStreak: recomputed.currentStreak,
        bestStreak: recomputed.bestStreak,
        globalAnalytics: recomputed.globalAnalytics,
        isEmpty: recomputed.isEmpty,
      });
    },

    createAttempt: (setId: string, subjectId: string, chapterId: string) => {
      const id = crypto.randomUUID();
      const newAttempt: AttemptSummary = {
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

      set((state) => {
        const attempts = [newAttempt, ...state.attempts];
        persistAll(attempts, state.details, state.progress);
        return { attempts };
      });

      return id;
    },

    finalizeAttempt: (
      attemptId: string,
      questions: QuestionAttempt[],
      subjectId: string,
      chapterId: string
    ) => {
      const now = new Date().toISOString();
      const total = questions.length;
      const score = questions.filter((q) => q.wasCorrect).length;
      const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

      set((state) => {
        const idx = state.attempts.findIndex((a) => a.id === attemptId);
        if (idx === -1) return state;

        const startedAt = new Date(state.attempts[idx].startedAt).getTime();
        const completedAt = new Date(now).getTime();
        const duration = Math.round((completedAt - startedAt) / 1000);

        const updatedAttempts = [...state.attempts];
        updatedAttempts[idx] = {
          ...updatedAttempts[idx],
          score,
          total,
          percentage,
          completedAt: now,
          duration,
        };

        const existing = state.progress[chapterId] ?? {
          highScore: 0,
          total: 0,
          attempts: 0,
          lastAttempt: "",
        };
        const updatedProgress = {
          ...state.progress,
          [chapterId]: {
            highScore: Math.max(existing.highScore, score),
            total,
            attempts: existing.attempts + 1,
            lastAttempt: now,
          },
        };

        const updatedDetails = {
          ...state.details,
          [attemptId]: { attemptId, questions },
        };

        persistAll(updatedAttempts, updatedDetails, updatedProgress);

        const analytics = state.subjects.map((s) =>
          computeSubjectAnalytics(
            s.id,
            s.name,
            updatedAttempts,
            s.chapters.length
          )
        );

        const recomputed = recomputeAnalytics(
          updatedAttempts,
          { currentStreak: state.currentStreak, bestStreak: state.bestStreak },
          analytics
        );

        return {
          attempts: updatedAttempts,
          details: updatedDetails,
          progress: updatedProgress,
          subjectAnalytics: recomputed.subjectAnalytics,
          currentStreak: recomputed.currentStreak,
          bestStreak: recomputed.bestStreak,
          globalAnalytics: recomputed.globalAnalytics,
          isEmpty: recomputed.isEmpty,
        };
      });
    },

    refresh: () => {
      const state = get();
      const fresh = load();

      const analytics = state.subjects.map((s) =>
        computeSubjectAnalytics(
          s.id,
          s.name,
          fresh.attempts,
          s.chapters.length
        )
      );

      const recomputed = recomputeAnalytics(
        fresh.attempts,
        { currentStreak: state.currentStreak, bestStreak: state.bestStreak },
        analytics
      );

      set({
        attempts: fresh.attempts,
        details: fresh.details,
        progress: fresh.progress,
        subjectAnalytics: recomputed.subjectAnalytics,
        currentStreak: recomputed.currentStreak,
        bestStreak: recomputed.bestStreak,
        globalAnalytics: recomputed.globalAnalytics,
        isEmpty: recomputed.isEmpty,
      });
    },
  };
});
