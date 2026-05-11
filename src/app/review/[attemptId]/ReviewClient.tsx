"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, RotateCcw, Clock, Calendar, Target } from "lucide-react";
import { getAttemptDetail, getAllAttempts } from "@/hooks/useAttemptHistory";
import KatexRenderer from "@/components/KatexRenderer";
import ExplanationCard from "@/components/ExplanationCard";
import type { AttemptDetail, AttemptSummary } from "@/types";

interface ReviewClientProps {
  attemptId: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function ReviewClient({ attemptId }: ReviewClientProps) {
  const router = useRouter();
  const [detail] = useState<AttemptDetail | null>(() => {
    if (typeof window === "undefined") return null;
    return getAttemptDetail(attemptId);
  });
  const [summary] = useState<AttemptSummary | null>(() => {
    if (typeof window === "undefined") return null;
    const all = getAllAttempts();
    return all.find((a) => a.id === attemptId) ?? null;
  });

  if (!detail || !summary) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="animate-pulse text-[var(--text-secondary)]">Loading review...</div>
      </div>
    );
  }

  const correctCount = detail.questions.filter((q) => q.wasCorrect).length;
  const total = detail.questions.length;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const date = new Date(summary.completedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const mins = Math.floor(summary.duration / 60);
  const secs = summary.duration % 60;
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  const scoreColor = pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--accent)" : "var(--danger)";
  const scoreBg = pct >= 80 ? "rgba(16,185,129,0.1)" : pct >= 50 ? "rgba(245,197,24,0.1)" : "rgba(239,68,68,0.1)";
  const scoreBorder = pct >= 80 ? "rgba(16,185,129,0.2)" : pct >= 50 ? "rgba(245,197,24,0.2)" : "rgba(239,68,68,0.2)";

  return (
    <div className="min-h-[100dvh] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[800px]">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center justify-between"
        >
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10 overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-8"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Review
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} />
                  {date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} />
                  {timeStr}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Target size={14} />
                  {correctCount}/{total} correct
                </span>
              </div>
            </div>

            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border text-2xl font-bold sm:h-24 sm:w-24 sm:text-3xl"
              style={{
                background: scoreBg,
                borderColor: scoreBorder,
                color: scoreColor,
              }}
            >
              {pct}%
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() =>
                router.push(
                  `/quiz/${summary.setId}?subjectId=${summary.subjectId}&chapterId=${summary.chapterId}`
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
            >
              <RotateCcw size={16} />
              Retake This Set
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {detail.questions.map((q, idx) => {
            const letterLabels = ["A", "B", "C", "D"];
            return (
              <motion.div
                key={idx}
                variants={item}
                className={`overflow-hidden rounded-[16px] border bg-[var(--bg-card)] p-5 sm:p-6 ${
                  q.wasCorrect
                    ? "border-[rgba(16,185,129,0.15)]"
                    : "border-[rgba(239,68,68,0.15)]"
                }`}
              >
                <div className="mb-4 flex items-start gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                      q.wasCorrect
                        ? "bg-[rgba(16,185,129,0.15)] text-[var(--success)]"
                        : "bg-[rgba(239,68,68,0.15)] text-[var(--danger)]"
                    }`}
                  >
                    {q.wasCorrect ? <Check size={14} /> : <X size={14} />}
                  </span>
                  <div className="flex-1 text-[15px] font-medium leading-relaxed text-[var(--text)]">
                    <KatexRenderer text={q.questionText} />
                  </div>
                </div>

                <div className="space-y-2 pl-9">
                  {q.options.map((opt, optIdx) => {
                    const isChosen = optIdx === q.chosenOptionIndex;
                    const isCorrectOpt = optIdx === q.correctOptionIndex;
                    const isWrongPick = isChosen && !isCorrectOpt;

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                          isCorrectOpt
                            ? "border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.08)] text-[var(--success)]"
                            : isWrongPick
                            ? "border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.08)] text-[var(--danger)]"
                            : "border border-[var(--border)] text-[var(--text-secondary)]"
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                            isCorrectOpt
                              ? "bg-[var(--success)] text-white"
                              : isWrongPick
                              ? "bg-[var(--danger)] text-white"
                              : "bg-[var(--bg-surface)] text-[var(--text-muted)]"
                          }`}
                        >
                          {letterLabels[optIdx]}
                        </span>
                        <span className="flex-1">
                          <KatexRenderer text={opt} />
                        </span>
                        {isCorrectOpt && (
                          <span className="shrink-0 text-xs font-semibold text-[var(--success)]">
                            Correct
                          </span>
                        )}
                        {isWrongPick && (
                          <span className="shrink-0 text-xs font-semibold text-[var(--danger)]">
                            Your answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="mt-4 pl-9">
                    <ExplanationCard explanation={q.explanation} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex justify-center"
        >
          <button
            onClick={() =>
              router.push(
                `/quiz/${summary.setId}?subjectId=${summary.subjectId}&chapterId=${summary.chapterId}`
              )
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
          >
            <RotateCcw size={18} />
            Retake This Set
          </button>
        </motion.div>
      </div>
    </div>
  );
}
