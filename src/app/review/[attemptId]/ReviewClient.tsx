"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, RotateCcw, User } from "lucide-react";
import { getAttemptDetail, getAllAttempts } from "@/hooks/useAttemptHistory";
import KatexRenderer from "@/components/KatexRenderer";
import ExplanationCard from "@/components/ExplanationCard";
import type { AttemptDetail, AttemptSummary } from "@/types";

interface ReviewClientProps {
  attemptId: string;
}

export default function ReviewClient({ attemptId }: ReviewClientProps) {
  const router = useRouter();
  const [detail, setDetail] = useState<AttemptDetail | null>(null);
  const [summary, setSummary] = useState<AttemptSummary | null>(null);

  useEffect(() => {
    const d = getAttemptDetail(attemptId);
    setDetail(d);
    const all = getAllAttempts();
    setSummary(all.find((a) => a.id === attemptId) ?? null);
  }, [attemptId]);

  if (!detail || !summary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-[--text]">Loading review...</div>
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

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[--text]/50 hover:text-[--text] transition"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[--card] border border-white/10 text-[--text]/70 hover:text-[--text] hover:border-white/20 transition text-sm"
          >
            <User size={16} /> Profile
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[--card] border border-white/10 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-[--text] font-display">Review</h1>
            <span className={`text-lg font-bold ${pct >= 80 ? "text-emerald-400" : pct >= 50 ? "text-yellow-400" : "text-rose-400"}`}>
              {pct}%
            </span>
          </div>
          <div className="flex gap-4 text-sm text-[--text]/60">
            <span>{date}</span>
            <span>{timeStr}</span>
            <span>{correctCount}/{total} correct</span>
          </div>
        </motion.div>

        <div className="space-y-4">
          {detail.questions.map((q, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`bg-[--card] border rounded-xl p-5 ${
                q.wasCorrect ? "border-emerald-500/20" : "border-rose-500/20"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-[--text]/40 text-sm font-mono mt-1 shrink-0">
                  #{idx + 1}
                </span>
                <div className="flex-1">
                  <div className="text-[--text] font-medium leading-relaxed mb-3">
                    <KatexRenderer text={q.questionText} />
                  </div>
                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = optIdx === q.chosenOptionIndex;
                      const isCorrectOpt = optIdx === q.correctOptionIndex;
                      const isWrongPick = isChosen && !isCorrectOpt;

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                            isCorrectOpt
                              ? "bg-emerald-500/15 text-emerald-400"
                              : isWrongPick
                              ? "bg-rose-500/15 text-rose-400"
                              : "text-[--text]/50"
                          }`}
                        >
                          {isCorrectOpt && <Check size={14} className="shrink-0" />}
                          {isWrongPick && <X size={14} className="shrink-0" />}
                          <span className={isCorrectOpt || isWrongPick ? "font-medium" : ""}>
                            <KatexRenderer text={opt} />
                          </span>
                          {isCorrectOpt && (
                            <span className="text-[10px] uppercase tracking-wider ml-auto text-emerald-400/60">
                              Correct
                            </span>
                          )}
                          {isWrongPick && (
                            <span className="text-[10px] uppercase tracking-wider ml-auto text-rose-400/60">
                              Your pick
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-3">
                      <ExplanationCard explanation={q.explanation} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => router.push(`/quiz/${summary.setId}?subjectId=${summary.subjectId}&chapterId=${summary.chapterId}`)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[--accent] text-[--bg] font-semibold hover:opacity-90 transition"
          >
            <RotateCcw size={18} /> Retake This Set
          </button>
        </div>
      </div>
    </div>
  );
}
