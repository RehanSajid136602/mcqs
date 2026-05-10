// CAVEMAN: large component. read only relevant section.
"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronRight, RotateCcw, ArrowLeft, History, User } from "lucide-react";
import type { MCQSet, QuestionAttempt } from "@/types";
import { useProgress } from "@/hooks/useProgress";
import { createAttempt as createAttemptFn, finalizeAttempt } from "@/hooks/useAttemptHistory";
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
    return { q: q.q, options: shuffledOpts.map((o) => o.text), correct: newCorrect, originalIndex: origIdx };
  });
}

function Label({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  if (pct >= 80) return <span className="text-emerald-400">Excellent!</span>;
  if (pct >= 50) return <span className="text-yellow-400">Good Effort!</span>;
  return <span className="text-rose-400">Keep Practicing</span>;
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
      setIsAnswered(true);
      if (idx === current.correct) setScore((s) => s + 1);
    },
    [isAnswered, current]
  );

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

  if (!isShuffled || !current) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-[--text]">Loading quiz...</div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[--card] border border-white/10 rounded-2xl p-10 text-center max-w-md w-full"
        >
          <div className="text-6xl font-bold text-[--accent] mb-2">{score}/{total}</div>
          <div className="text-2xl font-semibold mb-6">
            <Label score={score} total={total} />
          </div>
          <p className="text-[--text]/60 mb-8">
            {score === total
              ? "Perfect score! You're ready for the exam!"
              : `You've completed ${set.label}. Keep practicing to improve!`}
          </p>
          <div className="flex flex-col gap-3">
            {attemptId && (
              <button
                onClick={() => router.push(`/review/${attemptId}`)}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-[--text] hover:bg-white/15 transition font-medium"
              >
                <History size={18} /> Review Answers
              </button>
            )}
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={handleRetake}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[--accent] text-[--bg] font-semibold hover:opacity-90 transition"
              >
                <RotateCcw size={18} /> Retake
              </button>
              <button
                onClick={() => router.push("/profile")}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-[--text] hover:bg-white/15 transition font-medium"
              >
                <User size={18} /> View Profile
              </button>
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-[--text] hover:bg-white/5 transition"
              >
                <ArrowLeft size={18} /> Back
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[--text]/60 hover:text-[--text] transition"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-[--text]/60 font-medium">
            Question {currentIndex + 1} of {total}
          </span>
          <div className="w-8" />
        </div>

        <div className="h-2 bg-white/10 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-[--accent] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex) / total) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-[--card] border border-white/10 rounded-2xl p-8 mb-6">
              <h2 className="text-xl font-semibold text-[--text] leading-relaxed mb-8">
                <KatexRenderer text={current.q} />
              </h2>

              <div className="space-y-3">
                {current.options.map((option, idx) => {
                  const isSelected = selectedIndex === idx;
                  const isCorrectOption = idx === current.correct;
                  const showCorrect = isAnswered && isCorrectOption;
                  const showWrong = isAnswered && isSelected && !isCorrectOption;

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={isAnswered}
                      whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                      className={`
                        w-full text-left px-5 py-4 rounded-xl border transition-all duration-200
                        flex items-center gap-3
                        ${
                          showCorrect
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                            : showWrong
                            ? "bg-rose-500/20 border-rose-500 text-rose-400"
                            : isAnswered
                            ? "bg-white/5 border-white/10 text-[--text]/40 cursor-not-allowed"
                            : "bg-white/5 border-white/10 text-[--text] hover:bg-white/10 hover:border-white/20 cursor-pointer"
                        }
                      `}
                    >
                      <span className="flex-1">
                        <KatexRenderer text={option} />
                      </span>
                      {showCorrect && <Check size={20} className="text-emerald-400" />}
                      {showWrong && <X size={20} className="text-rose-400" />}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-4">
                <ExplanationCard explanation={set.questions[current.originalIndex]?.explanation || "No explanation available for this question."} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-end"
            >
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[--accent] text-[--bg] font-semibold hover:opacity-90 transition"
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