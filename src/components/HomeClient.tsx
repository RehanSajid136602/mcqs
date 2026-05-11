"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, CheckCircle, Clock, Flame } from "lucide-react";
import type { Subject } from "@/types";
import { useQuizStore } from "@/lib/store";
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

function formatStudyTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

interface HomeClientProps {
  subjects: Subject[];
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function HomeClient({ subjects }: HomeClientProps) {
  const setSubjects = useQuizStore((s) => s.setSubjects);
  const globalAnalytics = useQuizStore((s) => s.globalAnalytics);
  const subjectAnalytics = useQuizStore((s) => s.subjectAnalytics);
  const currentStreak = useQuizStore((s) => s.currentStreak);
  const isEmpty = useQuizStore((s) => s.isEmpty);

  useEffect(() => {
    setSubjects(subjects);
  }, [subjects, setSubjects]);

  const subjectStats = useMemo<Record<string, SubjectStats>>(() => {
    const stats: Record<string, SubjectStats> = {};
    for (const sa of subjectAnalytics) {
      stats[sa.subjectId] = {
        avgPct: sa.averageScore,
        totalAttempts: sa.totalAttempts,
        bestPct: sa.bestScore,
      };
    }
    return stats;
  }, [subjectAnalytics]);

  const enrichedSubjects = useMemo(() => {
    const saMap = new Map(subjectAnalytics.map((sa) => [sa.subjectId, sa]));
    return subjects.map((s) => {
      const sa = saMap.get(s.id);
      const totalSets = s.chapters.reduce((sum, ch) => sum + ch.sets.length, 0);
      return {
        id: s.id,
        name: s.name,
        iconName: SUBJECT_ICON_MAP[s.id] || s.icon || "Atom",
        color: SUBJECT_COLOR_MAP[s.id] || "gold",
        chapters: s.chapters.length,
        sets: totalSets,
        progress: sa
          ? Math.min(100, Math.round((sa.chaptersCompleted / Math.max(sa.totalChapters, 1)) * 100))
          : 0,
        bestScore: sa?.bestScore ?? 0,
        attempts: sa?.totalAttempts ?? 0,
        avgScore: sa?.averageScore ?? 0,
      };
    });
  }, [subjects, subjectAnalytics]);

  const delta = globalAnalytics.recentScoreDelta;
  const avgTrendLabel = delta > 0 ? "vs avg" : delta < 0 ? "recently" : "stable";
  const streakVsBest = currentStreak - globalAnalytics.bestStreak;

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
            quizCount={isEmpty ? 0 : globalAnalytics.weeklyQuizzes}
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
            value={isEmpty ? "--" : `${globalAnalytics.averageScore}%`}
            label={isEmpty ? "No attempts yet" : "Average Score"}
            trend={isEmpty ? 0 : delta}
            trendLabel={isEmpty ? "" : avgTrendLabel}
          />
          <StatCard
            icon={CheckCircle}
            iconColor="blue"
            value={isEmpty ? "--" : `${globalAnalytics.totalQuizzes}`}
            label={isEmpty ? "No attempts yet" : "Quizzes Completed"}
            trend={isEmpty ? 0 : globalAnalytics.weeklyQuizzes}
            trendLabel={isEmpty ? "" : "this week"}
          />
          <StatCard
            icon={Clock}
            iconColor="green"
            value={isEmpty ? "--" : formatStudyTime(globalAnalytics.totalStudyMinutes)}
            label={isEmpty ? "No attempts yet" : "Study Time"}
            trend={0}
            trendLabel="total"
          />
          <StatCard
            icon={Flame}
            iconColor="purple"
            value={isEmpty ? "--" : `${currentStreak}`}
            label={isEmpty ? "No attempts yet" : "Day Streak"}
            trend={isEmpty ? 0 : streakVsBest}
            trendLabel={isEmpty ? "" : "from best"}
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
