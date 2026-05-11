// CAVEMAN: read only relevant section.
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Lightbulb, Check, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CodeBlock from "./CodeBlock";
import { getTopicIcon } from "@/lib/coding-icons";
import type { CodeExample, PracticeQuestion } from "@/lib/coding-icons";

interface TopicPageProps {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  colorBg: string;
  description: string;
  importance: string;
  syntax: string;
  examples: CodeExample[];
  questions: PracticeQuestion[];
}

function ExampleCard({ example, index }: { example: CodeExample; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--border-hover)] transition-all duration-300"
    >
      <h3 className="text-lg font-semibold text-[--text] mb-4">{example.title}</h3>
      <CodeBlock code={example.code} language="python" expectedOutput={example.expectedOutput} />
      {example.explanation && (
        <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
          <p className="text-sm text-[--text]/70">{example.explanation}</p>
        </div>
      )}
    </motion.div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: "easy" | "medium" | "hard" }) {
  const colors = {
    easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    hard: "bg-red-500/10 text-red-400 border-red-500/30",
  };
  const labels = { easy: "Easy", medium: "Medium", hard: "Hard" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[difficulty]}`}>
      {labels[difficulty]}
    </span>
  );
}

function PracticeCard({ question, index }: { question: PracticeQuestion; index: number }) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--border-hover)] transition-all duration-300"
    >
      <div className="flex items-start gap-4 mb-4">
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-lg shrink-0">
          {question.id}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-[--text]">{question.title}</h3>
            <DifficultyBadge difficulty={question.difficulty} />
          </div>
          <p className="text-[--text]/60">{question.question}</p>
        </div>
      </div>

      {question.code && <CodeBlock code={question.code} expectedOutput={question.expectedOutput} />}

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={() => {
            setShowHint(!showHint);
            if (showSolution) setShowSolution(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all"
        >
          <Lightbulb size={16} />
          {showHint ? "Hide Hint" : "Show Hint"}
        </button>

        <button
          onClick={() => {
            setShowSolution(!showSolution);
            if (showHint) setShowHint(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"
        >
          {showSolution ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showSolution ? "Hide Solution" : "Show Solution"}
        </button>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
                <Lightbulb size={16} />
                <span>Hint</span>
              </div>
              <p className="text-[--text]/70">{question.hint}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSolution && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-3">
                <Check size={16} />
                <span>Solution</span>
              </div>
              <CodeBlock code={question.solution} language="python" expectedOutput={question.expectedOutput} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TopicPage(topic: TopicPageProps) {
  const router = useRouter();
  const { id, title, subtitle, iconName, color, colorBg, description, importance, syntax, examples, questions } = topic;
  const icon = getTopicIcon(iconName);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/coding"
            className="inline-flex items-center gap-2 text-[--text]/50 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Coding Lab</span>
          </Link>
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:border-[var(--border-hover)] transition"
          >
            <User size={18} />
            <span className="text-sm font-medium hidden sm:inline">Profile</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colorBg} ${color} text-sm mb-4`}>
            {icon}
            <span>HSSC-II Computer Science</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[--text] mb-3 font-display tracking-tight">{title}</h1>
          <p className="text-xl text-[--text]/60">{subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 mb-10"
        >
          <h2 className="text-xl font-semibold text-[--text] mb-4">Overview</h2>
          <p className="text-[--text]/70 mb-4">{description}</p>
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <h3 className="text-sm font-medium text-blue-400 mb-2">Why This Matters</h3>
            <p className="text-[--text]/70 text-sm">{importance}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-[--text] mb-6">Syntax Reference</h2>
          <CodeBlock code={syntax} language="python" />
        </motion.div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[--text] mb-6">Examples</h2>
          <div className="space-y-6">
            {examples.map((example, index) => (
              <ExampleCard key={index} example={example} index={index} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[--text] mb-6">Practice Questions</h2>
          <p className="text-[--text]/50 mb-6">Test your understanding with these HSSC-II exam questions.</p>
          <div className="space-y-6">
            {questions.map((question, index) => (
              <PracticeCard key={question.id} question={question} index={index} />
            ))}
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-[var(--border)] text-center"
        >
          <div className="flex items-center justify-center gap-6">
            <Link
              href="/coding"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back to all topics</span>
            </Link>
            <span className="text-white/10">|</span>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[--text]/50 hover:text-blue-400 transition-colors"
            >
              <span>Home</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}