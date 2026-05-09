"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Atom, Calculator, BookOpen, Cpu, BarChart3, Check, TrendingUp, Code2, ArrowRight, User } from "lucide-react";
import type { Subject, AttemptSummary } from "@/types";
import { useProgress } from "@/hooks/useProgress";

const ICON_MAP: Record<string, any> = {
  Atom,
  Calculator,
  BookOpen,
  Cpu,
  BarChart3,
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

interface SubjectStats {
  avgPct: number;
  totalAttempts: number;
  bestPct: number;
}

function computeSubjectStats(subjectId: string): SubjectStats {
  if (typeof window === "undefined") return { avgPct: 0, totalAttempts: 0, bestPct: 0 };
  try {
    const raw = localStorage.getItem("mcq_attempts");
    if (!raw) return { avgPct: 0, totalAttempts: 0, bestPct: 0 };
    const attempts: AttemptSummary[] = JSON.parse(raw);
    const subjectAttempts = attempts.filter((a) => a.subjectId === subjectId && a.total > 0);
    if (subjectAttempts.length === 0) return { avgPct: 0, totalAttempts: 0, bestPct: 0 };
    const totalPct = subjectAttempts.reduce((s, a) => s + a.percentage, 0);
    const bestPct = Math.max(...subjectAttempts.map((a) => a.percentage));
    return {
      avgPct: Math.round(totalPct / subjectAttempts.length),
      totalAttempts: subjectAttempts.length,
      bestPct,
    };
  } catch {
    return { avgPct: 0, totalAttempts: 0, bestPct: 0 };
  }
}

interface HomeClientProps {
  subjects: Subject[];
}

export default function HomeClient({ subjects }: HomeClientProps) {
  const router = useRouter();
  const { progress, refresh } = useProgress();
  const [subjectStats, setSubjectStats] = useState<Record<string, SubjectStats>>({});

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const stats: Record<string, SubjectStats> = {};
    for (const s of subjects) {
      stats[s.id] = computeSubjectStats(s.id);
    }
    setSubjectStats(stats);
  }, [subjects]);

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto relative">
        <div className="absolute right-0 top-0">
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[--card] border border-white/10 text-[--text]/70 hover:text-[--text] hover:border-white/20 transition"
          >
            <User size={18} />
            <span className="text-sm font-medium hidden sm:inline">Profile</span>
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <h1 className="text-5xl font-bold text-[--accent] mb-4 font-display tracking-tight">
          MCQ Master
        </h1>
        <p className="text-[--text]/60 text-lg">
          Pakistani HSSC-2 Board Exam Practice
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
      >
        {subjects.map((subject) => {
          const Icon = ICON_MAP[subject.icon] ?? BookOpen;
          const totalSets = subject.chapters.reduce((acc, ch) => acc + ch.sets.length, 0);
          const completedSets = subject.chapters.reduce(
            (acc, ch) => acc + ch.sets.filter((s) => Boolean(progress[s.id])).length,
            0
          );

          return (
            <motion.div key={subject.id} variants={item}>
              <button
                onClick={() => router.push(`/subject/${subject.id}`)}
                className="w-full bg-[--card] border border-white/10 rounded-2xl p-8 hover:border-[--accent]/40 hover:bg-white/8 transition-all duration-300 group text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[--accent]/10 text-[--accent]">
                    <Icon size={32} />
                  </div>
                  {totalSets > 0 && (
                    <div className="flex items-center gap-1.5 text-sm text-[--text]/50">
                      <Check size={14} className="text-emerald-400" />
                      {completedSets}/{totalSets}
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-semibold text-[--text] mb-2 font-display">
                  {subject.name}
                </h2>
                <p className="text-[--text]/50 text-sm">
                  {subject.chapters.length} Chapters
                </p>
                {subjectStats[subject.id]?.totalAttempts > 0 && (
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <span className="text-emerald-400/80">
                      <TrendingUp size={12} className="inline mr-1" />
                      {subjectStats[subject.id].avgPct}% avg
                    </span>
                    <span className="text-[--text]/40">
                      {subjectStats[subject.id].totalAttempts} attempts
                    </span>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {subject.chapters.slice(0, 4).map((ch) => {
                    const hasSets = ch.sets.some((s) => Boolean(progress[s.id]));
                    return (
                      <span
                        key={ch.id}
                        className={`text-xs px-2 py-1 rounded-md ${
                          hasSets
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-white/5 text-[--text]/40"
                        }`}
                      >
                        {ch.name.replace("Chapter ", "Ch. ")}
                      </span>
                    );
                  })}
                  {subject.chapters.length > 4 && (
                    <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-[--text]/40">
                      +{subject.chapters.length - 4}
                    </span>
                  )}
                </div>
              </button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Coding Lab section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-5xl mx-auto mt-12"
      >
        <button
          onClick={() => router.push("/coding")}
          className="w-full bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-purple-600/20 border border-blue-500/30 hover:border-blue-400/60 rounded-2xl p-8 transition-all duration-300 group text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                <Code2 size={36} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[--text] mb-1 font-display">
                  Coding Lab
                </h2>
                <p className="text-[--text]/60">
                  HSSC-II Computer Science — Python & Database practice
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-400 group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-medium">Open Lab</span>
              <ArrowRight size={18} />
            </div>
          </div>
        </button>
      </motion.div>
    </div>
  );
}