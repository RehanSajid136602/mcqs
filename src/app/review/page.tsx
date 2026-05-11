"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, ArrowRight, Calendar, Target, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllAttempts } from "@/hooks/useAttemptHistory";
import type { AttemptSummary } from "@/types";

export default function ReviewIndexPage() {
  const router = useRouter();
  const [attempts] = useState<AttemptSummary[]>(() => {
    if (typeof window === "undefined") return [];
    const all = getAllAttempts();
    return all
      .filter((a) => a.completedAt)
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
  });

  if (attempts.length === 0) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-card)]">
            <BookOpen size={32} className="text-[var(--text-muted)]" />
          </div>
          <h1 className="mb-3 font-display text-3xl font-bold tracking-tight">
            No Reviews Yet
          </h1>
          <p className="mx-auto max-w-md text-[var(--text-secondary)]">
            Complete a quiz to see your review history here.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
          >
            Start Practicing
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[800px]">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Review History
          </h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Review your past attempts and learn from mistakes.
          </p>
        </motion.div>

        <div className="space-y-3">
          {attempts.map((attempt, idx) => {
            const pct = attempt.percentage;
            const date = new Date(attempt.completedAt).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric", year: "numeric" }
            );
            const scoreColor =
              pct >= 80
                ? "var(--success)"
                : pct >= 50
                ? "var(--accent)"
                : "var(--danger)";
            const scoreBg =
              pct >= 80
                ? "rgba(16,185,129,0.1)"
                : pct >= 50
                ? "rgba(245,197,24,0.1)"
                : "rgba(239,68,68,0.1)";
            const scoreBorder =
              pct >= 80
                ? "rgba(16,185,129,0.2)"
                : pct >= 50
                ? "rgba(245,197,24,0.2)"
                : "rgba(239,68,68,0.2)";

            return (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                onClick={() => router.push(`/review/${attempt.id}`)}
                className="flex cursor-pointer items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                  style={{
                    background: scoreBg,
                    border: `1px solid ${scoreBorder}`,
                    color: scoreColor,
                  }}
                >
                  {pct}%
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[var(--text)]">
                    {attempt.subjectId} — {attempt.chapterId}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Target size={12} />
                      {attempt.score}/{attempt.total} correct
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <RotateCcw size={12} />
                      {attempt.setId}
                    </span>
                  </div>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-[var(--text-muted)]"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
