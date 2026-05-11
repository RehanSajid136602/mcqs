import type { AttemptSummary, SubjectAnalytics, GlobalAnalytics, DailyLog } from "@/types";

function toDateKey(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export function computeSubjectAnalytics(
  subjectId: string,
  subjectName: string,
  attempts: AttemptSummary[],
  totalChapters: number
): SubjectAnalytics {
  const subjectAttempts = attempts.filter(
    (a) => a.subjectId === subjectId && a.total > 0
  );

  if (subjectAttempts.length === 0) {
    return {
      subjectId,
      subjectName,
      totalAttempts: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      averageScore: 0,
      bestScore: 0,
      lastAttemptDate: "",
      chaptersCompleted: 0,
      totalChapters,
      totalStudyMinutes: 0,
    };
  }

  const totalCorrect = subjectAttempts.reduce((s, a) => s + a.score, 0);
  const totalQuestions = subjectAttempts.reduce((s, a) => s + a.total, 0);
  const bestScore = Math.max(...subjectAttempts.map((a) => a.percentage));
  const averageScore = Math.round(
    subjectAttempts.reduce((s, a) => s + a.percentage, 0) / subjectAttempts.length
  );
  const totalStudyMinutes = Math.round(
    subjectAttempts.reduce((s, a) => s + (a.duration || 0), 0) / 60
  );

  const sorted = [...subjectAttempts].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const completedChapters = new Set(
    subjectAttempts.map((a) => a.chapterId)
  ).size;

  return {
    subjectId,
    subjectName,
    totalAttempts: subjectAttempts.length,
    totalCorrect,
    totalQuestions,
    averageScore,
    bestScore,
    lastAttemptDate: sorted[0]?.completedAt ?? "",
    chaptersCompleted: completedChapters,
    totalChapters,
    totalStudyMinutes,
  };
}

export function computeGlobalAnalytics(
  attempts: AttemptSummary[],
  currentStreak: number,
  bestStreak: number,
  subjectAnalytics: SubjectAnalytics[]
): GlobalAnalytics {
  const completed = attempts.filter((a) => a.total > 0);

  if (completed.length === 0) {
    return {
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
    };
  }

  const totalCorrect = completed.reduce((s, a) => s + a.score, 0);
  const totalQuestions = completed.reduce((s, a) => s + a.total, 0);
  const bestScore = Math.max(...completed.map((a) => a.percentage));
  const averageScore = Math.round(
    completed.reduce((s, a) => s + a.percentage, 0) / completed.length
  );
  const totalStudyMinutes = Math.round(
    completed.reduce((s, a) => s + (a.duration || 0), 0) / 60
  );

  const now = Date.now();
  const weekAgo = now - 7 * 86400000;
  const weeklyQuizzes = completed.filter(
    (a) => new Date(a.completedAt).getTime() >= weekAgo
  ).length;

  const sorted = [...completed].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const recent = sorted.slice(0, 5);
  const older = sorted.slice(5, 10);
  const recentAvg =
    recent.length > 0
      ? Math.round(
          recent.reduce((s, a) => s + a.percentage, 0) / recent.length
        )
      : 0;
  const olderAvg =
    older.length > 0
      ? Math.round(
          older.reduce((s, a) => s + a.percentage, 0) / older.length
        )
      : recentAvg;
  const recentScoreDelta = recentAvg - olderAvg;

  const scored = subjectAnalytics.filter((s) => s.totalAttempts > 0);
  const strongest = scored.length > 0
    ? scored.reduce((best, s) => (s.averageScore > best.averageScore ? s : best))
    : null;
  const weakest = scored.length > 0
    ? scored.reduce((worst, s) => (s.averageScore < worst.averageScore ? s : worst))
    : null;

  return {
    totalAttempts: completed.length,
    totalQuizzes: completed.length,
    totalCorrect,
    totalQuestions,
    averageScore,
    bestScore,
    totalStudyMinutes,
    weeklyQuizzes,
    currentStreak,
    bestStreak,
    strongestSubjectId: strongest?.subjectId ?? null,
    weakestSubjectId: weakest?.subjectId ?? null,
    recentScoreDelta,
    lastAttemptDate: sorted[0]?.completedAt ?? "",
  };
}

export function computeStreak(attempts: AttemptSummary[]): {
  currentStreak: number;
  bestStreak: number;
} {
  if (attempts.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const completedDates = new Set<string>();
  for (const a of attempts) {
    if (a.completedAt) {
      completedDates.add(toDateKey(a.completedAt));
    }
  }

  if (completedDates.size === 0) return { currentStreak: 0, bestStreak: 0 };

  const sorted = Array.from(completedDates).sort().reverse();

  const today = toDateKey(new Date().toISOString());
  const yesterday = toDateKey(new Date(Date.now() - 86400000).toISOString());

  let currentStreak = 0;
  if (sorted[0] === today || sorted[0] === yesterday) {
    let checkDate = new Date(sorted[0] + "T00:00:00Z");
    for (const dateStr of sorted) {
      const expected = toDateKey(checkDate.toISOString());
      if (dateStr === expected) {
        currentStreak++;
        checkDate = new Date(checkDate.getTime() - 86400000);
      } else if (dateStr < expected) {
        break;
      }
    }
  }

  const ascDates = Array.from(completedDates).sort();
  let bestStreak = ascDates.length > 0 ? 1 : 0;
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

  return { currentStreak, bestStreak };
}

export function computeDailyLogs(attempts: AttemptSummary[]): DailyLog[] {
  const map = new Map<string, {
    totalAttempts: number;
    totalCorrect: number;
    totalQuestions: number;
    activeMinutes: number;
    subjects: Set<string>;
  }>();

  for (const a of attempts) {
    if (!a.completedAt) continue;
    const date = toDateKey(a.completedAt);
    if (!date) continue;

    const entry = map.get(date) ?? {
      totalAttempts: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      activeMinutes: 0,
      subjects: new Set(),
    };

    entry.totalAttempts++;
    entry.totalCorrect += a.score;
    entry.totalQuestions += a.total;
    entry.activeMinutes += Math.round((a.duration || 0) / 60);
    entry.subjects.add(a.subjectId);

    map.set(date, entry);
  }

  return Array.from(map.entries())
    .map(([date, data]) => ({
      date,
      totalAttempts: data.totalAttempts,
      totalCorrect: data.totalCorrect,
      totalQuestions: data.totalQuestions,
      activeMinutes: data.activeMinutes,
      subjects: Array.from(data.subjects),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function isDataEmpty(attempts: AttemptSummary[]): boolean {
  return attempts.every((a) => a.total === 0 || !a.completedAt);
}
