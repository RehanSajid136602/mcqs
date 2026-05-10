"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Star, ChevronRight, History, User } from "lucide-react";
import type { Subject, AttemptSummary } from "@/types";
import { useProgress } from "@/hooks/useProgress";
import { getAllAttempts } from "@/hooks/useAttemptHistory";

interface SubjectClientProps {
  subject: Subject;
}

export default function SubjectClient({ subject }: SubjectClientProps) {
  const params = useParams();
  const router = useRouter();
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const { progress } = useProgress();
  const attempts = getAllAttempts();

  const getChapterStats = (chapterId: string) => {
    const sets = subject.chapters.find((c) => c.id === chapterId)?.sets ?? [];
    const done = sets.filter((s) => Boolean(progress[s.id])).length;
    const best = sets.reduce((best, s) => {
      const p = progress[s.id];
      return p ? Math.max(best, p.highScore) : best;
    }, 0);
    return { done, total: sets.length, best };
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-[--text]/50 hover:text-[--text] transition"
        >
          <ArrowLeft size={18} /> Back to Subjects
        </button>
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[--card] border border-white/10 text-[--text]/70 hover:text-[--text] hover:border-white/20 transition"
        >
          <User size={18} />
          <span className="text-sm font-medium hidden sm:inline">Profile</span>
        </button>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-[--accent] mb-10 font-display"
      >
        {subject.name}
      </motion.h1>

      {attempts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mb-8"
        >
          <h2 className="text-sm font-semibold text-[--text]/50 uppercase tracking-wider mb-3 flex items-center gap-2">
            <History size={14} /> Recent Activity
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {attempts
              .filter((a) => a.subjectId === subject.id && a.total > 0)
              .slice(0, 10)
              .map((a) => {
                const date = new Date(a.completedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                const colorClass =
                  a.percentage >= 80
                    ? "border-emerald-500/30 text-emerald-400"
                    : a.percentage >= 50
                    ? "border-yellow-500/30 text-yellow-400"
                    : "border-rose-500/30 text-rose-400";
                return (
                  <button
                    key={a.id}
                    onClick={() => router.push(`/review/${a.id}`)}
                    className={`shrink-0 px-3 py-2 rounded-xl border bg-[--card] text-left hover:bg-white/5 transition ${colorClass}`}
                  >
                    <div className="text-sm font-bold">{a.percentage}%</div>
                    <div className="text-[10px] text-[--text]/40 mt-0.5">{date}</div>
                  </button>
                );
              })}
          </div>
        </motion.div>
      )}

      <div className="max-w-2xl space-y-3">
        {subject.chapters.map((chapter, idx) => {
          const stats = getChapterStats(chapter.id);
          const isExpanded = expandedChapter === chapter.id;

          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div
                className={`bg-[--card] border border-white/10 rounded-xl overflow-hidden transition-all ${
                  isExpanded ? "border-[--accent]/30" : ""
                }`}
              >
                <button
                  onClick={() =>
                    setExpandedChapter(isExpanded ? null : chapter.id)
                  }
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[--text]/40 text-sm font-mono w-8">
                      {chapter.id.match(/chapter-(\d+)/)?.[1] ?? "?"}
                    </span>
                    <span className="text-[--text] font-medium">{chapter.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {stats.done > 0 && (
                      <div className="flex items-center gap-1 text-sm text-emerald-400">
                        <Check size={14} />
                        {stats.done}
                        {stats.best > 0 && (
                          <span className="text-[--text]/40">· {stats.best}%</span>
                        )}
                      </div>
                    )}
                    <span className="text-xs text-[--text]/40 bg-white/5 px-2 py-1 rounded-md">
                      {chapter.sets.length} sets
                    </span>
                    <ChevronRight
                      size={16}
                      className={`text-[--text]/30 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {chapter.sets.map((set) => {
                          const p = progress[set.id];
                          return (
                            <button
                              key={set.id}
                              onClick={() => router.push(`/quiz/${set.id}?subjectId=${subject.id}&chapterId=${chapter.id}`)}
                              className={`relative p-3 rounded-xl border text-left transition-all hover:border-[--accent]/50 ${
                                p
                                  ? "bg-emerald-500/5 border-emerald-500/20"
                                  : "bg-white/5 border-white/10"
                              }`}
                            >
                              <div className="text-[--text] font-medium text-sm">
                                {set.label}
                              </div>
                              {p && (
                                <div className="mt-1 flex items-center gap-1">
                                  <Star size={10} className="text-[--accent]" />
                                  <span className="text-xs text-emerald-400">
                                    {p.highScore}%
                                  </span>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}