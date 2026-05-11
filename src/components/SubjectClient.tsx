"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Star,
  ChevronRight,
  Play,
  Trophy,
  TrendingUp,
  Clock,
} from "lucide-react";
import type { Subject } from "@/types";
import { useQuizStore } from "@/lib/store";

interface SubjectClientProps {
  subject: Subject;
}

const SUBJECT_ACCENTS: Record<
  string,
  { gradient: string; glow: string; text: string; border: string }
> = {
  physics: {
    gradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
    glow: "rgba(245, 197, 24, 0.12)",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  maths: {
    gradient: "from-blue-500/20 via-sky-500/10 to-transparent",
    glow: "rgba(59, 130, 246, 0.12)",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  english: {
    gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
    glow: "rgba(236, 72, 153, 0.12)",
    text: "text-pink-400",
    border: "border-pink-500/20",
  },
  cs: {
    gradient: "from-purple-500/20 via-violet-500/10 to-transparent",
    glow: "rgba(139, 92, 246, 0.12)",
    text: "text-purple-400",
    border: "border-purple-500/20",
  },
};

const DEFAULT_ACCENT = SUBJECT_ACCENTS.physics;

function getAccent(subjectId: string) {
  return SUBJECT_ACCENTS[subjectId] ?? DEFAULT_ACCENT;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function SubjectClient({ subject }: SubjectClientProps) {
  const router = useRouter();
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const attempts = useQuizStore((s) => s.attempts);
  const progress = useQuizStore((s) => s.progress);
  const subjectAnalytics = useQuizStore((s) => s.subjectAnalytics);
  const accent = getAccent(subject.id);

  const analytics = useMemo(
    () => subjectAnalytics.find((a) => a.subjectId === subject.id),
    [subjectAnalytics, subject.id]
  );

  const subjectAttempts = useMemo(
    () =>
      attempts
        .filter((a) => a.subjectId === subject.id && a.total > 0)
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()),
    [attempts, subject.id]
  );

  const totalSets = useMemo(
    () => subject.chapters.reduce((sum, ch) => sum + ch.sets.length, 0),
    [subject.chapters]
  );

  const completedSets = useMemo(
    () =>
      subject.chapters.reduce(
        (sum, ch) => sum + ch.sets.filter((s) => Boolean(progress[s.id])).length,
        0
      ),
    [subject.chapters, progress]
  );

  const overallCompletion = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const bestScore = useMemo(() => {
    let best = 0;
    for (const ch of subject.chapters) {
      for (const s of ch.sets) {
        const p = progress[s.id];
        if (p && p.highScore > best) best = p.highScore;
      }
    }
    return best;
  }, [subject.chapters, progress]);

  const getChapterStats = (chapterId: string) => {
    const sets = subject.chapters.find((c) => c.id === chapterId)?.sets ?? [];
    const done = sets.filter((s) => Boolean(progress[s.id])).length;
    const best = sets.reduce((b, s) => {
      const p = progress[s.id];
      return p ? Math.max(b, p.highScore) : b;
    }, 0);
    const avgScore =
      done > 0
        ? Math.round(
            sets
              .filter((s) => progress[s.id])
              .reduce((sum, s) => sum + progress[s.id].highScore, 0) / done
          )
        : 0;
    return { done, total: sets.length, best, avgScore };
  };

  const hasNoAttempts = !analytics || analytics.totalAttempts === 0;

  const stats = [
    { label: "Chapters", value: analytics?.totalChapters ?? subject.chapters.length, icon: BookOpen },
    { label: "Quiz Sets", value: totalSets, icon: Play },
    { label: "Completion", value: `${overallCompletion}%`, icon: TrendingUp },
    {
      label: "Best Score",
      value: analytics?.bestScore ? `${analytics.bestScore}%` : "--",
      icon: Trophy,
    },
  ];

  return (
    <div className="min-h-[100dvh] px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="relative mb-10"
      >
        <div
          className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none opacity-60"
          style={{
            background: `radial-gradient(circle, ${accent.glow} 0%, transparent 70%)`,
          }}
        />

        <button
          onClick={() => router.push("/")}
          className="relative z-10 flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-300 mb-8 group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span className="text-sm font-medium tracking-wide">Back to Subjects</span>
        </button>

        <h1 className="relative z-10 font-display text-4xl sm:text-[40px] font-bold tracking-tight text-[var(--text)] leading-none mb-6">
          {subject.name}
        </h1>

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + i * 0.06,
                  duration: 0.4,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 py-3 hover:border-[var(--border-hover)] transition-colors duration-300"
              >
                <Icon size={18} className={accent.text} strokeWidth={1.5} />
                <div>
                  <div className="text-lg font-semibold text-[var(--text)] leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {hasNoAttempts ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="relative mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
              <TrendingUp size={24} className="text-[var(--text-muted)]" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-1">No attempts yet</h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-xs text-center text-sm">
            No attempts yet. Start your first quiz!
          </p>
          <button
            onClick={() => {
              if (subject.chapters.length > 0 && subject.chapters[0].sets.length > 0) {
                const firstSet = subject.chapters[0].sets[0];
                router.push(
                  `/quiz/${firstSet.id}?subjectId=${subject.id}&chapterId=${subject.chapters[0].id}`
                );
              }
            }}
            className="group flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 font-semibold text-[var(--bg)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,197,24,0.3)] active:scale-[0.98]"
          >
            Start First Quiz
            <ArrowLeft size={14} className="rotate-180 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      ) : (
        <>
          {subjectAttempts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="mb-10"
            >
              <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                <Clock size={14} strokeWidth={1.5} />
                Recent Activity
              </h2>
              <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
                {subjectAttempts.slice(0, 12).map((a, i) => {
                  const pct = a.percentage;
                  const colorClass =
                    pct >= 80
                      ? "text-emerald-400 border-emerald-500/25 bg-emerald-500/5"
                      : pct >= 50
                        ? "text-amber-400 border-amber-500/25 bg-amber-500/5"
                        : "text-rose-400 border-rose-500/25 bg-rose-500/5";

                  return (
                    <motion.button
                      key={a.id}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.04 }}
                      onClick={() => router.push(`/review/${a.id}`)}
                      className={`shrink-0 flex flex-col items-start gap-1 px-3.5 py-2.5 rounded-xl border text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${colorClass}`}
                    >
                      <div className="text-base font-bold leading-none">{pct}%</div>
                      <div className="text-[10px] text-[var(--text-muted)] leading-none">
                        {timeAgo(a.completedAt)}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          )}
        </>
      )}

      <section>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
          <BookOpen size={14} strokeWidth={1.5} />
          Chapters
        </h2>

        <div className="space-y-3">
          {subject.chapters.map((chapter, idx) => {
            const chapterStats = getChapterStats(chapter.id);
            const isExpanded = expandedChapter === chapter.id;
            const chapterNum =
              chapter.id.match(/chapter-(\d+)/)?.[1] ?? String(idx + 1);
            const completionPct =
              chapterStats.total > 0
                ? Math.round((chapterStats.done / chapterStats.total) * 100)
                : 0;

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3 + idx * 0.05,
                  duration: 0.4,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className={`bg-[var(--bg-card)] rounded-2xl border transition-colors duration-300 overflow-hidden ${
                  isExpanded
                    ? "border-[var(--border-hover)]"
                    : "border-[var(--border)] hover:border-[var(--border-hover)]"
                }`}
              >
                <button
                  onClick={() =>
                    setExpandedChapter(isExpanded ? null : chapter.id)
                  }
                  className="w-full flex items-center gap-4 p-4 sm:p-5 text-left group"
                >
                  <div
                    className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                      completionPct === 100
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                        : "bg-white/5 text-[var(--text-muted)] border border-[var(--border)]"
                    }`}
                  >
                    {completionPct === 100 ? (
                      <CheckCircle size={18} strokeWidth={1.5} />
                    ) : (
                      chapterNum
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[var(--text)] font-medium text-sm sm:text-base leading-snug truncate">
                      {chapter.name}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 max-w-[120px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPct}%` }}
                          transition={{
                            duration: 0.6,
                            delay: 0.4 + idx * 0.05,
                            ease: [0.32, 0.72, 0, 1],
                          }}
                          className={`h-full rounded-full ${
                            completionPct === 100
                              ? "bg-emerald-400"
                              : completionPct > 0
                                ? "bg-[var(--accent)]"
                                : "bg-transparent"
                          }`}
                        />
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
                        {chapterStats.done}/{chapterStats.total} sets
                      </span>
                      {chapterStats.best > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                          <Star size={10} className={accent.text} />
                          {chapterStats.best}%
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight
                    size={18}
                    className={`text-[var(--text-muted)] transition-transform duration-300 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 border-t border-[var(--border)]">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {chapter.sets.map((set) => {
                            const p = progress[set.id];
                            const isCompleted = Boolean(p);
                            const hasHighScore = p && p.highScore >= 80;

                            return (
                              <motion.button
                                key={set.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                onClick={() =>
                                  router.push(
                                    `/quiz/${set.id}?subjectId=${subject.id}&chapterId=${chapter.id}`
                                  )
                                }
                                className={`relative flex flex-col items-start gap-1.5 p-3.5 rounded-xl border text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group ${
                                  isCompleted
                                    ? hasHighScore
                                      ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40"
                                      : "bg-[var(--accent)]/5 border-[var(--accent)]/20 hover:border-[var(--accent)]/40"
                                    : "bg-white/[0.02] border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-white/[0.04]"
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-sm font-medium text-[var(--text)]">
                                    {set.label}
                                  </span>
                                  {isCompleted && (
                                    <div
                                      className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                        hasHighScore
                                          ? "bg-emerald-500/15 text-emerald-400"
                                          : "bg-[var(--accent)]/15 text-[var(--accent)]"
                                      }`}
                                    >
                                      <Trophy size={9} />
                                      {p?.highScore}%
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                                  {p ? (
                                    <>
                                      <span className="flex items-center gap-1">
                                        <Play size={9} />
                                        {p.attempts}{" "}
                                        {p.attempts === 1 ? "attempt" : "attempts"}
                                      </span>
                                      <span className="text-[var(--text-muted)]/40">|</span>
                                      <span>{timeAgo(p.lastAttempt)}</span>
                                    </>
                                  ) : (
                                    <span className="flex items-center gap-1">
                                      <Play size={9} />
                                      Start
                                    </span>
                                  )}
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
