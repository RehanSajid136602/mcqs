"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  Calendar,
  BarChart3,
  BookOpen,
  TrendingUp,
  Star,
  Flame,
} from "lucide-react";
import type { Subject, AttemptSummary, SetProgress } from "@/types";
import { useQuizStore } from "@/lib/store";
import StatCard from "./StatCard";

interface ProfileClientProps {
  subjects: Subject[];
}

interface SetInfo {
  subject: Subject;
  chapter: { id: string; name: string };
  set: { id: string; label: string };
}

interface SetAggregate {
  setId: string;
  info: SetInfo | null;
  attempts: number;
  totalCorrect: number;
  totalQuestions: number;
  bestPercentage: number;
  avgPercentage: number;
  lastAttemptDate: string;
  progress: SetProgress | null;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatDate(iso: string): string {
  if (!iso) return "--";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function scoreColor(pct: number): string {
  if (pct >= 80) return "text-[var(--success)]";
  if (pct >= 50) return "text-[var(--accent)]";
  return "text-[var(--danger)]";
}

function scoreBg(pct: number): string {
  if (pct >= 80) return "bg-[rgba(16,185,129,0.1)]";
  if (pct >= 50) return "bg-[rgba(245,197,24,0.1)]";
  return "bg-[rgba(239,68,68,0.1)]";
}

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  },
};

function ProgressRing({
  percentage,
  size = 56,
  strokeWidth = 4,
  color,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--border)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1], delay: 0.3 }}
      />
    </svg>
  );
}

function ProgressBar({ percentage, color }: { percentage: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-[var(--border)] overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
      />
    </div>
  );
}

export default function ProfileClient({ subjects }: ProfileClientProps) {
  const router = useRouter();
  const attempts = useQuizStore((s) => s.attempts);
  const progress = useQuizStore((s) => s.progress);
  const subjectAnalytics = useQuizStore((s) => s.subjectAnalytics);
  const globalAnalytics = useQuizStore((s) => s.globalAnalytics);
  const isEmpty = useQuizStore((s) => s.isEmpty);
  const setSubjects = useQuizStore((s) => s.setSubjects);

  useEffect(() => {
    setSubjects(subjects);
  }, [subjects, setSubjects]);

  const setMap = useMemo(() => {
    const sMap = new Map<string, SetInfo>();
    for (const subject of subjects) {
      for (const chapter of subject.chapters) {
        for (const set of chapter.sets) {
          sMap.set(set.id, { subject, chapter, set });
        }
      }
    }
    return sMap;
  }, [subjects]);

  const recentAttempts = useMemo(() => {
    return [...attempts]
      .filter((a) => a.completedAt)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 10);
  }, [attempts]);

  const { weakChapters, strongChapters } = useMemo(() => {
    const chapterMap = new Map<
      string,
      { name: string; subjectName: string; totalCorrect: number; totalQuestions: number; attempts: number }
    >();
    for (const a of attempts) {
      const info = setMap.get(a.setId);
      if (!info) continue;
      const key = `${info.subject.id}-${info.chapter.id}`;
      if (!chapterMap.has(key)) {
        chapterMap.set(key, {
          name: info.chapter.name,
          subjectName: info.subject.name,
          totalCorrect: 0,
          totalQuestions: 0,
          attempts: 0,
        });
      }
      const ch = chapterMap.get(key)!;
      ch.totalCorrect += a.score;
      ch.totalQuestions += a.total;
      ch.attempts += 1;
    }
    const chapters = [...chapterMap.entries()]
      .map(([id, data]) => ({
        id,
        ...data,
        avgPct: data.totalQuestions > 0 ? Math.round((data.totalCorrect / data.totalQuestions) * 100) : 0,
      }))
      .filter((c) => c.attempts >= 1)
      .sort((a, b) => a.avgPct - b.avgPct);
    return {
      weakChapters: chapters.slice(0, 3),
      strongChapters: [...chapters].reverse().slice(0, 3),
    };
  }, [attempts, setMap]);

  const setAggregates = useMemo(() => {
    const setAttemptsById = new Map<string, AttemptSummary[]>();
    for (const a of attempts) {
      if (!setAttemptsById.has(a.setId)) setAttemptsById.set(a.setId, []);
      setAttemptsById.get(a.setId)!.push(a);
    }
    const sets: SetAggregate[] = [];
    for (const [setId, sAttempts] of setAttemptsById) {
      const totalCorrectSet = sAttempts.reduce((s, a) => s + a.score, 0);
      const totalQuestionsSet = sAttempts.reduce((s, a) => s + a.total, 0);
      const bestPct = Math.max(...sAttempts.map((a) => a.percentage));
      const avgPct =
        totalQuestionsSet > 0 ? Math.round((totalCorrectSet / totalQuestionsSet) * 100) : 0;
      const lastDate =
        sAttempts
          .filter((a) => a.completedAt)
          .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0]
          ?.completedAt ?? "";
      sets.push({
        setId,
        info: setMap.get(setId) ?? null,
        attempts: sAttempts.length,
        totalCorrect: totalCorrectSet,
        totalQuestions: totalQuestionsSet,
        bestPercentage: bestPct,
        avgPercentage: avgPct,
        lastAttemptDate: lastDate,
        progress: progress[setId] ?? null,
      });
    }
    sets.sort(
      (a, b) => new Date(b.lastAttemptDate).getTime() - new Date(a.lastAttemptDate).getTime()
    );
    return sets;
  }, [attempts, progress, setMap]);

  const studyHours = Math.round(globalAnalytics.totalStudyMinutes / 60);

  return (
    <div className="min-h-[100dvh] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="flex items-center justify-between mb-10"
        >
          <button
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 rounded-xl px-3 py-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] transition-all duration-300"
          >
            <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2.5 rounded-full bg-[var(--bg-card)] border border-[var(--border)] px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-sm font-medium text-[var(--text-secondary)]">Profile</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(245,197,24,0.1)]">
              <BarChart3 size={20} className="text-[var(--accent)]" strokeWidth={2} />
            </div>
            <span className="rounded-full bg-[rgba(245,197,24,0.1)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--accent)]">
              Analytics
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] tracking-tight leading-none mb-3">
            Your Profile
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl">
            Track your progress, identify strengths, and discover where to focus next.
          </p>
        </motion.div>

        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="relative mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                <TrendingUp size={32} className="text-[var(--text-muted)]" />
              </div>
              <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[var(--accent)] animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-2">No attempts yet</h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-sm text-center">
              Complete your first quiz to see your analytics.
            </p>
            <button
              onClick={() => router.push("/")}
              className="group flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--bg)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,197,24,0.3)] active:scale-[0.98]"
            >
              Explore Subjects
              <ArrowLeft size={16} className="rotate-180 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
            >
              <motion.div variants={fadeUp}>
                <StatCard
                  icon={BookOpen}
                  iconColor="gold"
                  value={String(globalAnalytics.totalQuizzes)}
                  label="Total Quizzes"
                  trend={globalAnalytics.averageScore}
                  trendLabel="avg score"
                />
              </motion.div>
              <motion.div variants={fadeUp}>
                <StatCard
                  icon={Target}
                  iconColor="blue"
                  value={`${globalAnalytics.averageScore}%`}
                  label="Average Score"
                  trend={globalAnalytics.recentScoreDelta}
                  trendLabel="recent"
                />
              </motion.div>
              <motion.div variants={fadeUp}>
                <StatCard
                  icon={Clock}
                  iconColor="green"
                  value={`${studyHours}h`}
                  label="Study Time"
                  trend={globalAnalytics.weeklyQuizzes}
                  trendLabel="this week"
                />
              </motion.div>
              <motion.div variants={fadeUp}>
                <StatCard
                  icon={Flame}
                  iconColor="purple"
                  value={String(globalAnalytics.bestStreak)}
                  label="Best Streak"
                  trend={globalAnalytics.currentStreak}
                  trendLabel="current"
                />
              </motion.div>
            </motion.div>

            {subjectAnalytics.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.3 }}
                className="mb-10"
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(139,92,246,0.1)]">
                    <BookOpen size={16} className="text-[var(--purple)]" strokeWidth={2} />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text)] tracking-tight">
                    Subject Breakdown
                  </h2>
                </div>
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {subjectAnalytics.map((sa) => {
                    const ringColor =
                      sa.averageScore >= 80
                        ? "var(--success)"
                        : sa.averageScore >= 50
                          ? "var(--accent)"
                          : "var(--danger)";
                    const wrong = sa.totalQuestions - sa.totalCorrect;
                    return (
                      <motion.div
                        key={sa.subjectId}
                        variants={fadeUp}
                        className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]"
                      >
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-[var(--text)] truncate">
                              {sa.subjectName}
                            </h3>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">
                              {sa.chaptersCompleted}/{sa.totalChapters} chapters
                            </p>
                          </div>
                          <div className="relative shrink-0 ml-3">
                            <ProgressRing
                              percentage={sa.averageScore}
                              size={48}
                              strokeWidth={3.5}
                              color={ringColor}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--text)]">
                              {sa.averageScore}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="rounded-lg bg-[rgba(16,185,129,0.08)] px-2 py-1.5 text-center">
                            <div className="text-xs font-bold text-[var(--success)]">
                              {sa.totalAttempts}
                            </div>
                            <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                              Attempts
                            </div>
                          </div>
                          <div className="rounded-lg bg-[rgba(239,68,68,0.08)] px-2 py-1.5 text-center">
                            <div className="text-xs font-bold text-[var(--danger)]">
                              {wrong}
                            </div>
                            <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                              Wrong
                            </div>
                          </div>
                          <div className="rounded-lg bg-[rgba(245,197,24,0.08)] px-2 py-1.5 text-center">
                            <div className="text-xs font-bold text-[var(--accent)]">
                              {sa.bestScore}%
                            </div>
                            <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                              Best
                            </div>
                          </div>
                        </div>
                        <ProgressBar percentage={sa.averageScore} color={ringColor} />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.section>
            )}

            {(weakChapters.length > 0 || strongChapters.length > 0) && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.35 }}
                className="mb-10"
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(245,197,24,0.1)]">
                    <TrendingUp size={16} className="text-[var(--accent)]" strokeWidth={2} />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text)] tracking-tight">
                    Performance Insights
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {strongChapters.length > 0 && (
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(16,185,129,0.1)]">
                          <Star size={14} className="text-[var(--success)]" strokeWidth={2} />
                        </div>
                        <h3 className="text-sm font-semibold text-[var(--success)] uppercase tracking-wider">
                          Strong Chapters
                        </h3>
                      </div>
                      <div className="space-y-2.5">
                        {strongChapters.map((ch) => (
                          <div
                            key={ch.id}
                            className="flex items-center justify-between rounded-xl bg-[rgba(16,185,129,0.05)] px-3.5 py-2.5"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-[var(--text)] truncate">
                                {ch.name}
                              </div>
                              <div className="text-[11px] text-[var(--text-muted)]">
                                {ch.subjectName}
                              </div>
                            </div>
                            <span className="ml-3 rounded-full bg-[rgba(16,185,129,0.15)] px-2.5 py-0.5 text-xs font-bold text-[var(--success)]">
                              {ch.avgPct}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {weakChapters.length > 0 && (
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(239,68,68,0.1)]">
                          <Target size={14} className="text-[var(--danger)]" strokeWidth={2} />
                        </div>
                        <h3 className="text-sm font-semibold text-[var(--danger)] uppercase tracking-wider">
                          Needs Improvement
                        </h3>
                      </div>
                      <div className="space-y-2.5">
                        {weakChapters.map((ch) => (
                          <div
                            key={ch.id}
                            className="flex items-center justify-between rounded-xl bg-[rgba(239,68,68,0.05)] px-3.5 py-2.5"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-[var(--text)] truncate">
                                {ch.name}
                              </div>
                              <div className="text-[11px] text-[var(--text-muted)]">
                                {ch.subjectName}
                              </div>
                            </div>
                            <span className="ml-3 rounded-full bg-[rgba(239,68,68,0.15)] px-2.5 py-0.5 text-xs font-bold text-[var(--danger)]">
                              {ch.avgPct}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {recentAttempts.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.4 }}
                className="mb-10"
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(59,130,246,0.1)]">
                    <Clock size={16} className="text-[var(--blue)]" strokeWidth={2} />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text)] tracking-tight">
                    Recent Attempts
                  </h2>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                  <div className="hidden sm:grid sm:grid-cols-[1fr_100px_80px_80px_60px] gap-3 px-5 py-3 border-b border-[var(--border)] text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                    <span>Quiz</span>
                    <span>Date</span>
                    <span>Duration</span>
                    <span>Score</span>
                    <span className="text-right">Review</span>
                  </div>
                  <motion.div variants={stagger} initial="hidden" animate="show">
                    {recentAttempts.map((attempt) => {
                      const info = setMap.get(attempt.setId);
                      const title = info
                        ? `${info.subject.name} / ${info.chapter.name.replace("Chapter ", "Ch. ")} / ${info.set.label}`
                        : attempt.setId;
                      const pct = attempt.percentage;
                      return (
                        <motion.button
                          key={attempt.id}
                          variants={fadeIn}
                          onClick={() => router.push(`/review/${attempt.id}`)}
                          className="w-full text-left group border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-card-hover)] transition-colors duration-200"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_80px_80px_60px] gap-1 sm:gap-3 px-5 py-3.5 items-center">
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-[var(--text)] truncate group-hover:text-[var(--accent)] transition-colors duration-200">
                                {title}
                              </div>
                              <div className="flex items-center gap-3 mt-0.5 sm:hidden text-[11px] text-[var(--text-muted)]">
                                <span className="flex items-center gap-1">
                                  <Calendar size={10} />
                                  {formatDate(attempt.completedAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={10} />
                                  {formatDuration(attempt.duration)}
                                </span>
                              </div>
                            </div>
                            <div className="hidden sm:block text-xs text-[var(--text-muted)]">
                              {formatDate(attempt.completedAt)}
                            </div>
                            <div className="hidden sm:block text-xs text-[var(--text-muted)]">
                              {formatDuration(attempt.duration)}
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${scoreColor(pct)} ${scoreBg(pct)}`}
                              >
                                {pct}%
                              </span>
                              <span className="text-[11px] text-[var(--text-muted)] hidden sm:inline">
                                {attempt.score}/{attempt.total}
                              </span>
                            </div>
                            <div className="hidden sm:flex justify-end">
                              <span className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-200 text-xs font-medium">
                                View
                              </span>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>
              </motion.section>
            )}

            {setAggregates.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.45 }}
                className="mb-10"
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(20,184,166,0.1)]">
                    <BarChart3 size={16} className="text-[var(--teal)]" strokeWidth={2} />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text)] tracking-tight">
                    Set Performance
                  </h2>
                </div>
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {setAggregates.map((sa) => {
                    const info = sa.info;
                    const title = info
                      ? `${info.subject.name} / ${info.chapter.name.replace("Chapter ", "Ch. ")} / ${info.set.label}`
                      : sa.setId;
                    const wrong = sa.totalQuestions - sa.totalCorrect;
                    const barColor =
                      sa.avgPercentage >= 80
                        ? "var(--success)"
                        : sa.avgPercentage >= 50
                          ? "var(--accent)"
                          : "var(--danger)";
                    return (
                      <motion.div
                        key={sa.setId}
                        variants={fadeUp}
                        className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 sm:p-5 transition-all duration-300 hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-[var(--text)] truncate">
                              {title}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-[11px] text-[var(--text-muted)]">
                              <span className="flex items-center gap-1">
                                <Calendar size={11} />
                                {formatDate(sa.lastAttemptDate)}
                              </span>
                              <span>
                                {sa.attempts} attempt{sa.attempts !== 1 ? "s" : ""}
                              </span>
                              {sa.progress && (
                                <span className="flex items-center gap-1 text-[var(--accent)]">
                                  <Trophy size={11} />
                                  Best: {sa.progress.highScore}/{sa.progress.total}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                            <div className="text-center">
                              <div className="text-sm font-bold text-[var(--success)]">
                                {sa.totalCorrect}
                              </div>
                              <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                                Correct
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-bold text-[var(--danger)]">
                                {wrong}
                              </div>
                              <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                                Wrong
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-bold text-[var(--accent)]">
                                {sa.avgPercentage}%
                              </div>
                              <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                                Avg
                              </div>
                            </div>
                            {sa.info && (
                              <button
                                onClick={() => {
                                  const i = sa.info!;
                                  router.push(
                                    `/quiz/${sa.setId}?subjectId=${i.subject.id}&chapterId=${i.chapter.id}`
                                  );
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(245,197,24,0.1)] text-[var(--accent)] hover:bg-[rgba(245,197,24,0.2)] transition-colors duration-200 active:scale-[0.96]"
                                title="Retake set"
                              >
                                <TrendingUp size={14} strokeWidth={2} />
                              </button>
                            )}
                          </div>
                        </div>
                        <ProgressBar percentage={sa.avgPercentage} color={barColor} />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
