"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown } from "lucide-react";
import KatexRenderer from "./KatexRenderer";

interface ExplanationCardProps {
  explanation: string;
  className?: string;
}

function splitBullets(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.;!?])\s+|\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}

const bulletContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const bulletItem = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function ExplanationCard({ explanation, className = "" }: ExplanationCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const bullets = useMemo(() => splitBullets(explanation), [explanation]);

  return (
    <div className={className}>
      <button
        onClick={() => setShowExplanation((prev) => !prev)}
        className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all duration-200"
      >
        <Lightbulb size={16} />
        <span className="text-sm font-medium">
          {showExplanation ? "Hide Explanation" : "Show Explanation"}
        </span>
        <motion.span
          className="ml-auto"
          animate={{ rotate: showExplanation ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-xl bg-[var(--accent)]/5 border-l-2 border-[var(--accent)]/30 p-5">
              <span className="block text-[10px] uppercase tracking-widest text-[var(--accent)]/60 font-semibold mb-3">
                Explanation
              </span>
              <motion.ul
                className="space-y-2.5"
                variants={bulletContainer}
                initial="hidden"
                animate="show"
              >
                {bullets.map((bullet, i) => (
                  <motion.li
                    key={i}
                    variants={bulletItem}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-[0.45em] block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span className="text-sm text-[var(--text)]/90 leading-relaxed">
                      <KatexRenderer text={bullet} />
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
