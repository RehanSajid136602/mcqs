"use client";

import { motion } from "framer-motion";
import { useStreak } from "@/hooks/useStreak";

const fireDotVariants = {
  initial: { opacity: 0.4, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
};

export default function StreakCard() {
  const { currentStreak, bestStreak } = useStreak();

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-[rgba(245,197,24,0.2)] bg-gradient-to-br from-[rgba(245,197,24,0.1)] to-[rgba(245,197,24,0.02)] p-6 text-center">
      <h3 className="text-base font-semibold">Current Streak</h3>

      <motion.div
        className="my-4 bg-gradient-to-br from-[var(--accent)] to-[#ffd700] bg-clip-text text-[48px] font-extrabold leading-none"
        style={{ WebkitTextFillColor: "transparent" }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {currentStreak}
      </motion.div>

      <p className="mb-4 text-sm text-[var(--text-secondary)]">days in a row</p>

      <div className="flex justify-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className="block h-2.5 w-2.5 rounded-full bg-[var(--accent)]"
            variants={fireDotVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
        Best streak:{" "}
        <strong className="text-[var(--accent)]">{bestStreak} days</strong>
        <br />
        <span className="text-[var(--teal)]">
          Keep practicing daily to maintain your streak!
        </span>
      </p>
    </div>
  );
}