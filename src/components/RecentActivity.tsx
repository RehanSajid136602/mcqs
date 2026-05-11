"use client";

import { motion } from "framer-motion";
import { Atom, Calculator, BookOpen, Cpu, Code2, ArrowRight } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useRecentActivity, formatTimeAgo } from "@/hooks/useRecentActivity";

type SubjectColor = "gold" | "blue" | "pink" | "purple" | "teal";

const SUBJECT_ICONS: Record<string, LucideIcon> = {
  physics: Atom,
  maths: Calculator,
  math: Calculator,
  english: BookOpen,
  "computer-science": Cpu,
  cs: Cpu,
  "coding-lab": Code2,
  coding: Code2,
};

const SUBJECT_COLORS: Record<string, { bg: string; text: string }> = {
  physics: { bg: "rgba(245,197,24,0.1)", text: "var(--accent)" },
  maths: { bg: "rgba(59,130,246,0.1)", text: "var(--blue)" },
  math: { bg: "rgba(59,130,246,0.1)", text: "var(--blue)" },
  english: { bg: "rgba(236,72,153,0.1)", text: "var(--pink)" },
  "computer-science": { bg: "rgba(139,92,246,0.1)", text: "var(--purple)" },
  cs: { bg: "rgba(139,92,246,0.1)", text: "var(--purple)" },
  "coding-lab": { bg: "rgba(20,184,166,0.1)", text: "var(--teal)" },
  coding: { bg: "rgba(20,184,166,0.1)", text: "var(--teal)" },
};

const SUBJECT_LABELS: Record<string, string> = {
  physics: "Physics",
  maths: "Maths",
  math: "Maths",
  english: "English",
  "computer-science": "Computer Science",
  cs: "Computer Science",
  "coding-lab": "Coding Lab",
  coding: "Coding Lab",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function RecentActivity() {
  const activities = useRecentActivity(4);

  return (
    <div className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Recent Activity</h2>
        <a
          href="#"
          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
        >
          View All
          <ArrowRight size={14} strokeWidth={2} />
        </a>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,255,255,0.04)]">
            <BookOpen size={20} className="text-[var(--text-muted)]" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-[var(--text-muted)]">No activity yet</p>
          <p className="mt-1 text-xs text-[var(--text-muted)] opacity-60">
            Complete a quiz to see your history here
          </p>
        </div>
      ) : (
        <motion.div
          className="divide-y divide-[var(--border)]"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {activities.map((activity, idx) => {
            const Icon = SUBJECT_ICONS[activity.subjectId] ?? BookOpen;
            const colors = SUBJECT_COLORS[activity.subjectId] ?? {
              bg: "rgba(255,255,255,0.06)",
              text: "var(--text-secondary)",
            };
            const label = SUBJECT_LABELS[activity.subjectId] ?? activity.subjectId;
            const isGood = activity.percentage >= 70;

            return (
              <motion.div
                key={`${activity.quizId}-${idx}`}
                variants={item}
                className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: colors.bg, color: colors.text }}
                >
                  <Icon size={18} strokeWidth={2} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {label} &mdash; {activity.chapterName} Set {activity.setNumber}
                  </p>
                  <p className="text-[13px] text-[var(--text-muted)]">
                    {activity.totalQuestions} questions &middot;{" "}
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-sm font-bold ${
                    isGood ? "text-[var(--success)]" : "text-[var(--danger)]"
                  }`}
                >
                  {activity.percentage}%
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}