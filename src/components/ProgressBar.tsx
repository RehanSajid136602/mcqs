"use client";

import { motion } from "framer-motion";

type BarColor = "gold" | "blue" | "pink" | "purple" | "teal";

interface ProgressBarProps {
  value: number;
  color: BarColor;
}

const gradientMap: Record<BarColor, { from: string; to: string }> = {
  gold: { from: "var(--accent)", to: "#ffd700" },
  blue: { from: "var(--blue)", to: "#60a5fa" },
  pink: { from: "var(--pink)", to: "#f472b6" },
  purple: { from: "var(--purple)", to: "#a78bfa" },
  teal: { from: "var(--teal)", to: "#5eead4" },
};

export default function ProgressBar({ value, color }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const { from, to } = gradientMap[color];

  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
      <motion.div
        className="relative h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          background: `linear-gradient(90deg, ${from}, ${to})`,
        }}
      >
        <div
          className="absolute inset-y-0 right-0 w-5"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.3))",
          }}
        />
      </motion.div>
    </div>
  );
}
