"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Trophy,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  BarChart3,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Layers,
  RotateCcw,
} from "lucide-react";
import type { Subject, AttemptSummary, SetProgress } from "@/types";
import { getAllProgress } from "@/hooks/useProgress";
import { getAllAttempts } from "@/hooks/useAttemptHistory";

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

interface SubjectAggregate {
  subjectId: string;
  subjectName: string;
  attempts: number;
  totalCorrect: number;
  totalQuestions: number;
  avgPercentage: number;
  bestPercentage: number;
  setsAttempted: number;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProfileClient({ subjects }: ProfileClientProps) {
  const router = useRouter();

  const { setMap, subjectMap } = useMemo(() => {
    const sMap = new Map<string, SetInfo>();
    const subjMap = new Map<string, Subject>();
    for (const subject of subjects) {
      subjMap.set(subject.id, subject);
      for (const chapter of subject.chapters) {
        for (const set of chapter.sets) {
          sMap.set(set.id, { subject, chapter, set });
        }
      }
    }
    return { setMap: sMap, subjectMap: subjMap };
  }, [subjects]);

  const { attempts, progress, overall, subjectAggregates, setAggregates } = useMemo(() => {
    const allAttempts = getAllAttempts();
    const allProgress = getAllProgress();

    const totalAttempts = allAttempts.length;
    const totalCorrect = allAttempts.reduce((s, a) => s + a.score, 0);
    const totalQuestions = allAttempts.reduce((s, a) => s + a.total, 0);
    const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const uniqueSets = new Set(allAttempts.map((a) => a.setId)).size;

    const overall = {
      totalAttempts,
      totalCorrect,
      totalWrong: totalQuestions - totalCorrect,
      totalQuestions,
      overallAccuracy,
      uniqueSets,
    };

    const subjectAttemptsById = new Map<string, AttemptSummary[]>();
    for (const a of allAttempts) {
      if (!subjectAttemptsById.has(a.subjectId)) subjectAttemptsById.set(a.subjectId, []);
      subjectAttemptsById.get(a.subjectId)!.push(a);
    }
    const subjectAggregates: SubjectAggregate[] = [];
    for (const [subjectId, sAttempts] of subjectAttemptsById) {
      const subj = subjectMap.get(subjectId);
      const totalCorrectSubj = sAttempts.reduce((s, a) => s + a.score, 0);
      const totalQuestionsSubj = sAttempts.reduce((s, a) => s + a.total, 0);
      subjectAggregates.push({
        subjectId,
        subjectName: subj?.name ?? subjectId,
        attempts: sAttempts.length,
        totalCorrect: totalCorrectSubj,
        totalQuestions: totalQuestionsSubj,
        avgPercentage: totalQuestionsSubj > 0 ? Math.round(totalCorrectSubj / totalQuestionsSubj * 100) : 0,
        bestPercentage: Math.max(...sAttempts.map((a) => a.percentage)),
        setsAttempted: new Set(sAttempts.map((a) => a.setId)).size,
      });
    }
    subjectAggregates.sort((a, b) => b.attempts - a.attempts);

    const setAttemptsById = new Map<string, AttemptSummary[]>();
    for (const a of allAttempts) {
      if (!setAttemptsById.has(a.setId)) setAttemptsById.set(a.setId, []);
      setAttemptsById.get(a.setId)!.push(a);
    }
    const setAggregates: SetAggregate[] = [];
    for (const [setId, sAttempts] of setAttemptsById) {
      const totalCorrectSet = sAttempts.reduce((s, a) => s + a.score, 0);
      const totalQuestionsSet = sAttempts.reduce((s, a) => s + a.total, 0);
      const bestPct = Math.max(...sAttempts.map((a) => a.percentage));
      const avgPct = totalQuestionsSet > 0 ? Math.round(totalCorrectSet / totalQuestionsSet * 100) : 0;
      const lastDate = sAttempts
        .filter((a) => a.completedAt)
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0]?.completedAt ?? "";
      setAggregates.push({
        setId,
        info: setMap.get(setId) ?? null,
        attempts: sAttempts.length,
        totalCorrect: totalCorrectSet,
        totalQuestions: totalQuestionsSet,
        bestPercentage: bestPct,
        avgPercentage: avgPct,
        lastAttemptDate: lastDate,
        progress: allProgress[setId] ?? null,
      });
    }
    setAggregates.sort((a, b) => new Date(b.lastAttemptDate).getTime() - new Date(a.lastAttemptDate).getTime());

    return { attempts: allAttempts, progress: allProgress, overall, subjectAggregates, setAggregates };
  }, [subjects, setMap, subjectMap]);

  const recentAttempts = useMemo(() => {
    return [...attempts]
      .filter((a) => a.completedAt)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 20);
  }, [attempts]);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[--text]/50 hover:text-[--text] transition"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex items-center gap-2 text-[--text]/50">
            <User size={16} />
            <span className="text-sm">Profile</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-[--text] font-display tracking-tight mb-2">
            Your Progress
          </h1>
          <p className="text-[--text]/60 text-lg">
            Every attempt, every set, every detail.
          </p>
        </motion.div>

        {overall && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          >
            <StatCard
              icon={<Layers size={20} />}
              label="Total Attempts"
              value={overall.totalAttempts}
              color="text-[--accent]"
              bg="bg-[--accent]/10"
            />
            <StatCard
              icon={<CheckCircle2 size={20} />}
              label="Total Correct"
              value={overall.totalCorrect}
              color="text-emerald-400"
              bg="bg-emerald-500/10"
            />
            <StatCard
              icon={<XCircle size={20} />}
              label="Total Wrong"
              value={overall.totalWrong}
              color="text-rose-400"
              bg="bg-rose-500/10"
            />
            <StatCard
              icon={<Target size={20} />}
              label="Accuracy"
              value={`${overall.overallAccuracy}%`}
              color="text-blue-400"
              bg="bg-blue-500/10"
            />
          </motion.div>
        )}

        {subjectAggregates.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-[--accent]" />
              <h2 className="text-xl font-semibold text-[--text] font-display">Subject Breakdown</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjectAggregates.map((subj) => (
                <div
                  key={subj.subjectId}
                  className="bg-[--card] border border-white/10 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[--text]">{subj.subjectName}</h3>
                    <span className="text-sm font-bold text-[--accent]">{subj.avgPercentage}% avg</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <MiniStat label="Attempts" value={subj.attempts} />
                    <MiniStat label="Correct" value={subj.totalCorrect} color="text-emerald-400" />
                    <MiniStat label="Wrong" value={subj.totalQuestions - subj.totalCorrect} color="text-rose-400" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[--text]/50">
                    <span className="flex items-center gap-1">
                      <Trophy size={12} className="text-yellow-400" />
                      Best: {subj.bestPercentage}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers size={12} />
                      {subj.setsAttempted} sets
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {subjects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-[--accent]" />
              <h2 className="text-xl font-semibold text-[--text] font-display">Subjects Overview</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => {
                const totalSets = subject.chapters.reduce((acc, ch) => acc + ch.sets.length, 0);
                const attemptedSets = new Set(
                  attempts.filter((a) => a.subjectId === subject.id).map((a) => a.setId)
                ).size;
                const subjAgg = subjectAggregates.find((s) => s.subjectId === subject.id);
                return (
                  <button
                    key={subject.id}
                    onClick={() => router.push(`/subject/${subject.id}`)}
                    className="text-left bg-[--card] border border-white/10 hover:border-[--accent]/30 rounded-2xl p-5 transition group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-[--text]">{subject.name}</h3>
                      {subjAgg && (
                        <span className="text-sm font-bold text-[--accent]">{subjAgg.avgPercentage}%</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[--text]/50">
                      <span>{subject.chapters.length} chapters</span>
                      <span>{totalSets} sets</span>
                    </div>
                    {subjAgg ? (
                      <div className="mt-3 flex items-center gap-3 text-xs">
                        <span className="text-emerald-400/80">{subjAgg.totalCorrect} correct</span>
                        <span className="text-rose-400/80">{subjAgg.totalQuestions - subjAgg.totalCorrect} wrong</span>
                        <span className="text-[--text]/40">{attemptedSets}/{totalSets} done</span>
                      </div>
                    ) : (
                      <div className="mt-3 text-xs text-[--text]/30">Not started yet</div>
                    )}
                    <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[--accent] rounded-full transition-all"
                        style={{ width: `${totalSets > 0 ? (attemptedSets / totalSets) * 100 : 0}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}

        {setAggregates.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-[--accent]" />
              <h2 className="text-xl font-semibold text-[--text] font-display">Set Performance</h2>
            </div>
            <div className="space-y-3">
              {setAggregates.map((sa) => {
                const info = sa.info;
                const title = info
                  ? `${info.subject.name} › ${info.chapter.name.replace("Chapter ", "Ch. ")} › ${info.set.label}`
                  : sa.setId;
                const wrong = sa.totalQuestions - sa.totalCorrect;
                return (
                  <div
                    key={sa.setId}
                    className="bg-[--card] border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[--text] font-medium truncate">{title}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[--text]/50">
                        <span className="flex items-center gap-1">
                          <RotateCcw size={12} />
                          {sa.attempts} attempt{sa.attempts !== 1 ? "s" : ""}
                        </span>
                        {sa.lastAttemptDate && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(sa.lastAttemptDate)}
                          </span>
                        )}
                        {sa.progress && (
                          <span className="flex items-center gap-1 text-[--accent]/70">
                            <Trophy size={12} />
                            High score: {sa.progress.highScore}/{sa.progress.total}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <div className="text-center">
                        <div className="text-sm font-bold text-emerald-400">{sa.totalCorrect}</div>
                        <div className="text-[10px] uppercase tracking-wider text-[--text]/40">Correct</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-rose-400">{wrong}</div>
                        <div className="text-[10px] uppercase tracking-wider text-[--text]/40">Wrong</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-[--accent]">{sa.avgPercentage}%</div>
                        <div className="text-[10px] uppercase tracking-wider text-[--text]/40">Avg</div>
                      </div>
                      {sa.info && (
                        <button
                          onClick={() => {
                            const info = sa.info!;
                            router.push(
                              `/quiz/${sa.setId}?subjectId=${info.subject.id}&chapterId=${info.chapter.id}`
                            );
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[--text]/60 hover:text-[--text] transition"
                          title="Retake set"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {recentAttempts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-[--accent]" />
              <h2 className="text-xl font-semibold text-[--text] font-display">Recent Attempts</h2>
            </div>
            <div className="space-y-3">
              {recentAttempts.map((attempt) => {
                const info = setMap.get(attempt.setId);
                const title = info
                  ? `${info.subject.name} › ${info.chapter.name.replace("Chapter ", "Ch. ")} › ${info.set.label}`
                  : attempt.setId;
                const pct = attempt.percentage;
                return (
                  <button
                    key={attempt.id}
                    onClick={() => router.push(`/review/${attempt.id}`)}
                    className="w-full text-left bg-[--card] border border-white/10 hover:border-white/20 rounded-xl p-4 transition group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-[--text] font-medium truncate">{title}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[--text]/50">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDateTime(attempt.completedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatDuration(attempt.duration)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-sm">
                          <span className="font-bold text-[--text]">{attempt.score}</span>
                          <span className="text-[--text]/40">/{attempt.total}</span>
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            pct >= 80 ? "text-emerald-400" : pct >= 50 ? "text-yellow-400" : "text-rose-400"
                          }`}
                        >
                          {pct}%
                        </span>
                        <ChevronRight
                          size={16}
                          className="text-[--text]/30 group-hover:text-[--text]/60 transition"
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}

        {overall && overall.totalAttempts === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
              <TrendingUp size={28} className="text-[--text]/30" />
            </div>
            <h2 className="text-xl font-semibold text-[--text] mb-2">No attempts yet</h2>
            <p className="text-[--text]/50 mb-6 max-w-sm mx-auto">
              Start practicing a subject to see your progress, accuracy, and attempt history here.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-xl bg-[--accent] text-[--bg] font-semibold hover:opacity-90 transition"
            >
              Explore Subjects
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-[--card] border border-white/10 rounded-2xl p-5">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${bg} ${color} mb-3`}>
        {icon}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-[--text] font-display">{value}</div>
      <div className="text-sm text-[--text]/50 mt-1">{label}</div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color = "text-[--text]",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="text-center bg-white/5 rounded-lg p-2">
      <div className={`text-sm font-bold ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-[--text]/40 mt-0.5">{label}</div>
    </div>
  );
}
