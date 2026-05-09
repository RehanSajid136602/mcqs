"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown } from "lucide-react";
import KatexRenderer from "./KatexRenderer";

interface ExplanationCardProps {
  explanation: string;
  className?: string;
}

export default function ExplanationCard({ explanation, className = "" }: ExplanationCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className={className}>
      <button
        onClick={() => setShowExplanation((prev) => !prev)}
        className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-[--accent]/10 text-[--text]/60 hover:text-[--accent] transition-all duration-200"
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
            <div className="mt-2 p-5 rounded-xl bg-[--accent]/5 border-l-2 border-[--accent]/30">
              <span className="block text-[10px] uppercase tracking-widest text-[--accent]/60 font-semibold mb-2">
                Explanation
              </span>
              <div className="text-sm text-[--text]/90 leading-relaxed">
                <KatexRenderer text={explanation} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
