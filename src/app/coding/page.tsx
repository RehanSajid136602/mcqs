"use client";

import { motion } from "framer-motion";
import { Code2, Terminal, ArrowRight, BookOpen, Play, Database, FileCode } from "lucide-react";
import Link from "next/link";
import { CODING_TOPICS, getTopicIcon } from "@/lib/coding-icons";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  },
};

const QUICK_START = [
  {
    id: CODING_TOPICS[0]?.id ?? "lists",
    label: "Python Lists",
    icon: Code2,
  },
  {
    id: CODING_TOPICS[3]?.id ?? "dictionaries",
    label: "Dictionaries",
    icon: Database,
  },
  {
    id: CODING_TOPICS[4]?.id ?? "sql-basics",
    label: "SQL Basics",
    icon: Terminal,
  },
];

export default function CodingHub() {
  return (
    <div className="min-h-[100dvh] px-4 sm:px-6 py-12 md:py-20">
      <div className="max-w-5xl mx-auto">
<motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--teal)]/10 text-[var(--teal)] text-xs font-medium tracking-wide uppercase mb-6">
            <Code2 size={14} strokeWidth={2} />
            <span>HSSC-II Computer Science</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display tracking-tight leading-[1.1] text-[var(--text)] mb-5">
            Coding Lab
          </h1>

          <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl leading-relaxed">
            Python &amp; SQL practice for HSSC-II Computer Science
          </p>
        </motion.header>

<motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
          className="mb-14 md:mb-20"
        >
          <div className="flex items-center gap-2 mb-5">
            <Play size={16} className="text-[var(--teal)]" strokeWidth={2} />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Quick Start
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {QUICK_START.map((qs) => (
              <Link
                key={qs.id}
                href={`/coding/${qs.id}`}
                className="group flex items-center gap-3 px-5 py-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] transition-all duration-300"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--teal)]/10 text-[var(--teal)] shrink-0">
                  <qs.icon size={18} strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--teal)] transition-colors">
                  {qs.label}
                </span>
                <ArrowRight
                  size={14}
                  className="ml-auto text-[var(--text-muted)] group-hover:text-[var(--teal)] group-hover:translate-x-0.5 transition-all duration-200"
                  strokeWidth={2}
                />
              </Link>
            ))}
          </div>
        </motion.section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={16} className="text-[var(--text-muted)]" strokeWidth={2} />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              All Topics
            </h2>
            <span className="ml-2 text-xs text-[var(--text-muted)] tabular-nums">
              {CODING_TOPICS.length} topics
            </span>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {CODING_TOPICS.map((topic) => (
              <motion.div key={topic.id} variants={item}>
                <Link
                  href={`/coding/${topic.id}`}
                  className="group block rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] transition-all duration-300 hover:shadow-[0_8px_32px_-8px_rgba(20,184,166,0.08)]"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--teal)]/10 text-[var(--teal)] shrink-0">
                        {getTopicIcon(topic.iconName)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[var(--text)] group-hover:text-[var(--teal)] transition-colors duration-200 mb-1">
                          {topic.title}
                        </h3>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed line-clamp-2">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5">
                        <FileCode size={12} strokeWidth={2} />
                        {topic.examples.length} examples
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen size={12} strokeWidth={2} />
                        {topic.questions.length} questions
                      </span>
                    </div>

                    <span className="flex items-center gap-1 text-xs font-medium text-[var(--teal)] opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-0 transition-all duration-200">
                      Start
                      <ArrowRight size={12} strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-[var(--border)] text-center"
        >
          <p className="text-[var(--text-muted)] text-sm">
            Ready for MCQs?{" "}
            <Link
              href="/"
              className="text-[var(--teal)] hover:text-[var(--teal)]/80 transition-colors"
            >
              Back to Home
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}