"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, CheckCircle, Clock, Flame } from "lucide-react";
import type { Subject, AttemptSummary } from "@/types";
import DashboardHeader from "./DashboardHeader";
import StatCard from "./StatCard";
import SubjectBentoGrid from "./SubjectBentoGrid";
import RecentActivity from "./RecentActivity";
import StreakCard from "./StreakCard";

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

function computeTotalQuizzes(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("mcq_attempts");
    if (!raw) return 0;
    const attempts: AttemptSummary[] = JSON.parse(raw);
    return attempts.filter((a) => a.total > 0).length;
  } catch {
    return 0;
  }
}

function computeTotalStudyTime(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("mcq_attempts");
    if (!raw) return 0;
    const attempts: AttemptSummary[] = JSON.parse(raw);
    const totalMinutes = attempts.reduce((s, a) => s + (a.duration || 0), 0);
    return Math.round(totalMinutes / 60);
  } catch {
    return 0;
  }
}

function computeGlobalAvg(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("mcq_attempts");
    if (!raw) return 0;
    const attempts: AttemptSummary[] = JSON.parse(raw);
    const completed = attempts.filter((a) => a.total > 0);
    if (completed.length === 0) return 0;
    return Math.round(completed.reduce((s, a) => s + a.percentage, 0) / completed.length);
  } catch {
    return 0;
  }
}

const SUBJECT_COLOR_MAP: Record<string, "gold" | "blue" | "pink" | "purple" | "teal"> = {
  physics: "gold",
  maths: "blue",
  math: "blue",
  english: "pink",
  "computer-science": "purple",
  cs: "purple",
};

const SUBJECT_ICON_MAP: Record<string, string> = {
  physics: "Atom",
  maths: "Calculator",
  math: "Calculator",
  english: "BookOpen",
  "computer-science": "Cpu",
  cs: "Cpu",
};

interface HomeClientProps {
  subjects: Subject[];
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function HomeClient({ subjects }: HomeClientProps) {
  const [subjectStats] = useState<Record<string, SubjectStats>>(() => {
    const stats: Record<string, SubjectStats> = {};
    for (const s of subjects) {
      stats[s.id] = computeSubjectStats(s.id);
    }
    return stats;
  });

  const [globalStats] = useState(() => ({
    avg: computeGlobalAvg(),
    quizzes: computeTotalQuizzes(),
    hours: computeTotalStudyTime(),
    streak: 0,
  }));

  const enrichedSubjects = useMemo(() => {
    const result = subjects.map((s) => {
      const stats = subjectStats[s.id];
      const totalSets = s.chapters.reduce((sum, ch) => sum + ch.sets.length, 0);
      return {
        id: s.id,
        name: s.name,
        iconName: SUBJECT_ICON_MAP[s.id] || s.icon || "Atom",
        color: SUBJECT_COLOR_MAP[s.id] || "gold",
        chapters: s.chapters.length,
        sets: totalSets,
        progress: stats?.totalAttempts ? Math.min(100, Math.round((stats.totalAttempts / Math.max(totalSets, 1)) * 100)) : 0,
        bestScore: stats?.bestPct ?? 0,
        attempts: stats?.totalAttempts ?? 0,
        avgScore: stats?.avgPct ?? 0,
      };
    });

    result.push({
      id: "coding-lab",
      name: "Coding Lab",
      iconName: "Terminal",
      color: "teal",
      chapters: 5,
      sets: 24,
      progress: 0,
      bestScore: 0,
      attempts: 0,
      avgScore: 0,
    });

    return result;
  }, [subjects, subjectStats]);

  return (
    <div className="min-h-[100dvh] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="show"
        >
          <DashboardHeader
            userName="Ahmad"
            quizCount={globalStats.quizzes}
          />
        </motion.div>


        <motion.div
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={sectionVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
        >
          <StatCard
            icon={Trophy}
            iconColor="gold"
            value={`${globalStats.avg}%`}
            label="Average Score"
            trend={12}
            trendLabel="vs last week"
          />
          <StatCard
            icon={CheckCircle}
            iconColor="blue"
            value={`${globalStats.quizzes}`}
            label="Quizzes Completed"
            trend={5}
            trendLabel="new"
          />
          <StatCard
            icon={Clock}
            iconColor="green"
            value={`${globalStats.hours}h`}
            label="Study Time"
            trend={2}
            trendLabel="hours more"
          />
          <StatCard
            icon={Flame}
            iconColor="purple"
            value="5"
            label="Day Streak"
            trend={-1}
            trendLabel="from best"
          />
        </motion.div>


        <motion.div
          className="mb-8"
          variants={sectionVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-[22px] font-semibold tracking-tight">
              Your Subjects
            </h2>
            <a
              href="/subjects"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] transition-opacity hover:opacity-80"
            >
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
          <SubjectBentoGrid subjects={enrichedSubjects} stats={subjectStats} />
        </motion.div>


        <motion.div
          className="grid grid-cols-1 gap-4 lg:grid-cols-3"
          variants={sectionVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.3 }}
        >
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div>
            <StreakCard />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
