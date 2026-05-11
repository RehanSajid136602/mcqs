"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Atom, Calculator, BookOpen, Cpu, Code2, ArrowRight } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useQuizStore } from "@/lib/store";

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

function formatTimeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return "just now";

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function RecentActivity() {
  const attempts = useQuizStore((s) => s.attempts);

  const activities = useMemo(() => {
    return attempts
      .filter((a) => a.completedAt && a.total > 0)
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() -
          new Date(a.completedAt).getTime()
      )
      .slice(0, 4);
  }, [attempts]);

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
          <p className="text-sm text-[var(--text-muted)]">
            No activity yet. Complete your first quiz!
          </p>
        </div>
      ) : (
        <motion.div
          className="divide-y divide-[var(--border)]"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {activities.map((attempt) => {
            const Icon = SUBJECT_ICONS[attempt.subjectId] ?? BookOpen;
            const colors = SUBJECT_COLORS[attempt.subjectId] ?? {
              bg: "rgba(255,255,255,0.06)",
              text: "var(--text-secondary)",
            };
            const label = SUBJECT_LABELS[attempt.subjectId] ?? attempt.subjectId;
            const isGood = attempt.percentage >= 70;

            return (
              <motion.div
                key={attempt.id}
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
                    {label} &mdash; {attempt.chapterId} Set {attempt.setId}
                  </p>
                  <p className="text-[13px] text-[var(--text-muted)]">
                    {attempt.total} questions &middot;{" "}
                    {formatTimeAgo(attempt.completedAt)}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-sm font-bold ${
                    isGood ? "text-[var(--success)]" : "text-[var(--danger)]"
                  }`}
                >
                  {attempt.percentage}%
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
