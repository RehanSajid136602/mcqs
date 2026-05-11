"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  ChevronRight,
  RotateCcw,
  ArrowLeft,
  History,
  CheckCircle2,
  Clock,
  Trophy,
  Target,
} from "lucide-react";
import type { MCQSet, QuestionAttempt } from "@/types";
import { useProgress } from "@/hooks/useProgress";
import {
  createAttempt as createAttemptFn,
  finalizeAttempt,
} from "@/hooks/useAttemptHistory";
import KatexRenderer from "./KatexRenderer";
import ExplanationCard from "./ExplanationCard";

interface QuizProps {
  set: MCQSet;
  subjectId: string;
  chapterId: string;
  onBack: () => void;
}

interface ShuffledQuestion {
  q: string;
  options: string[];
  correct: number;
  originalIndex: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildShuffledQuestions(set: MCQSet): ShuffledQuestion[] {
  return set.questions.map((q, origIdx) => {
    const opts = q.options.map((o, i) => ({ text: o, origIdx: i }));
    const shuffledOpts = shuffle(opts);
    const newCorrect = shuffledOpts.findIndex((o) => o.origIdx === q.correct);
    return {
      q: q.q,
      options: shuffledOpts.map((o) => o.text),
      correct: newCorrect,
      originalIndex: origIdx,
    };
  });
}

function ScoreLabel({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  if (pct >= 80)
    return <span className="text-[var(--success)]">Excellent!</span>;
  if (pct >= 50)
    return <span className="text-[var(--accent)]">Good Effort!</span>;
  return <span className="text-[var(--danger)]">Keep Practicing</span>;
}

export default function Quiz({ set, subjectId, chapterId, onBack }: QuizProps) {
  const router = useRouter();
  const { saveProgress } = useProgress();
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const questionAttempts = useRef<QuestionAttempt[]>([]);

  useEffect(() => {
    const id = createAttemptFn(set.id, subjectId, chapterId);
    setAttemptId(id);
    setQuestions(buildShuffledQuestions(set));
    setIsShuffled(true);
  }, [set, subjectId, chapterId]);

  const current = questions[currentIndex];
  const total = questions.length;

  const handleSelect = useCallback(
    (idx: number) => {
      if (isAnswered) return;
      setSelectedIndex(idx);
    },
    [isAnswered]
  );

  const handleConfirm = useCallback(() => {
    if (selectedIndex === null) return;
    setIsAnswered(true);
    if (selectedIndex === current.correct) setScore((s) => s + 1);
  }, [selectedIndex, current]);

  const handleNext = useCallback(() => {
    if (current && selectedIndex !== null) {
      const origQuestion = set.questions[current.originalIndex];
      questionAttempts.current.push({
        originalIndex: current.originalIndex,
        questionText: current.q,
        options: current.options,
        correctOptionIndex: current.correct,
        chosenOptionIndex: selectedIndex,
        wasCorrect: selectedIndex === current.correct,
        explanation: origQuestion.explanation,
      });
    }

    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedIndex(null);
      setIsAnswered(false);
    } else {
      saveProgress(set.id, score, total);
      if (attemptId) {
        finalizeAttempt(attemptId, questionAttempts.current);
      }
      setIsComplete(true);
    }
  }, [currentIndex, total, score, set.id, current, selectedIndex, attemptId]);

  const handleRetake = useCallback(() => {
    questionAttempts.current = [];
    const id = createAttemptFn(set.id, subjectId, chapterId);
    setAttemptId(id);
    setQuestions(buildShuffledQuestions(set));
    setCurrentIndex(0);
    setSelectedIndex(null);
    setIsAnswered(false);
    setScore(0);
    setIsComplete(false);
  }, [set, subjectId, chapterId]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isComplete) return;
      if (!isAnswered) {
        if (e.key >= "1" && e.key <= "4") {
          const idx = parseInt(e.key, 10) - 1;
          if (idx < (current?.options.length ?? 0)) {
            handleSelect(idx);
          }
        } else if (e.key === "Enter" && selectedIndex !== null) {
          handleConfirm();
        }
      } else {
        if (e.key === "Enter" || e.key === "ArrowRight") {
          handleNext();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isComplete, isAnswered, current, selectedIndex, handleSelect, handleConfirm, handleNext]);

  if (!isShuffled || !current) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="animate-pulse text-[var(--text-secondary)]">
          Preparing your quiz...
        </div>
      </div>
    );
  }

  if (isComplete) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const scoreColor =
      pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--accent)" : "var(--danger)";
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
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold"
              style={{ background: scoreBg, border: `1px solid ${scoreBorder}`, color: scoreColor }}
            >
              {score}/{total}
            </div>

            <div className="mb-2 text-2xl font-semibold">
              <ScoreLabel score={score} total={total} />
            </div>

            <p className="mb-8 text-[var(--text-secondary)]">
              {score === total
                ? "Perfect score! You're ready for the exam!"
                : `You've completed ${set.label}. Keep practicing to improve!`}
            </p>

            <div className="flex flex-col gap-3">
              {attemptId && (
                <button
                  onClick={() => router.push(`/review/${attemptId}`)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--bg-card-hover)] px-6 py-3 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--bg-surface)]"
                >
                  <History size={18} /> Review Answers
                </button>
              )}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleRetake}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
                >
                  <RotateCcw size={18} /> Retake
                </button>
                <button
                  onClick={() => router.push("/profile")}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)]"
                >
                  <Target size={18} /> Profile
                </button>
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)]"
                >
                  <ArrowLeft size={18} /> Back
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const progress = ((currentIndex) / total) * 100;
  const letterLabels = ["A", "B", "C", "D"];

  return (
    <div className="flex min-h-[100dvh] flex-col items-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-2xl">
        {/* Top Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Exit</span>
          </button>
          <span className="text-sm font-medium text-[var(--text-muted)]">
            {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="w-16" />
        </div>

        {/* Progress Bar */}
        <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-[var(--bg-surface)]">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-8">
              <h2 className="text-lg font-semibold leading-relaxed text-[var(--text)] sm:text-xl">
                <KatexRenderer text={current.q} />
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {current.options.map((option, idx) => {
                const isSelected = selectedIndex === idx;
                const isCorrectOption = idx === current.correct;
                const showCorrect = isAnswered && isCorrectOption;
                const showWrong = isAnswered && isSelected && !isCorrectOption;
                const showPending = isSelected && !isAnswered;

                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                    className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-200 ${
                      showCorrect
                        ? "border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)] text-[var(--success)]"
                        : showWrong
                        ? "border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] text-[var(--danger)]"
                        : showPending
                        ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--text)]"
                        : isAnswered
                        ? "cursor-not-allowed border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)]"
                        : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                        showCorrect
                          ? "bg-[var(--success)] text-white"
                          : showWrong
                          ? "bg-[var(--danger)] text-white"
                          : showPending
                          ? "bg-[var(--accent)] text-[var(--bg)]"
                          : isAnswered
                          ? "bg-[var(--bg-surface)] text-[var(--text-muted)]"
                          : "bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                      }`}
                    >
                      {letterLabels[idx]}
                    </span>
                    <span className="flex-1 text-sm sm:text-base">
                      <KatexRenderer text={option} />
                    </span>
                    {showCorrect && <Check size={20} className="shrink-0 text-[var(--success)]" />}
                    {showWrong && <X size={20} className="shrink-0 text-[var(--danger)]" />}
                    {showPending && (
                      <CheckCircle2 size={20} className="shrink-0 text-[var(--accent)]" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-4"
              >
                <ExplanationCard
                  explanation={
                    set.questions[current.originalIndex]?.explanation ||
                    "No explanation available for this question."
                  }
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <AnimatePresence>
          {selectedIndex !== null && !isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6 flex flex-col items-center gap-2"
            >
              <button
                onClick={handleConfirm}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-4 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
              >
                <CheckCircle2 size={20} />
                Lock In Answer
              </button>
              <p className="text-xs text-[var(--text-muted)]">
                Press Enter to confirm
              </p>
            </motion.div>
          )}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 flex justify-end"
            >
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-4 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
              >
                {currentIndex < total - 1 ? (
                  <>
                    Next <ChevronRight size={20} />
                  </>
                ) : (
                  "See Results"
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
