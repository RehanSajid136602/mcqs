"use client";

import { motion } from "framer-motion";
import { Trophy, ArrowLeft, Construction } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AchievementsPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)]/10">
          <Construction size={32} className="text-[var(--accent)]" />
        </div>
        <h1 className="mb-3 font-display text-3xl font-bold tracking-tight">
          Achievements
        </h1>
        <p className="mx-auto max-w-md text-[var(--text-secondary)]">
          Achievement badges and milestones are coming soon. Keep practicing to unlock them when they arrive!
        </p>
        <button
          onClick={() => router.push("/profile")}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
        >
          <Trophy size={18} />
          View Profile
        </button>
        <button
          onClick={() => router.push("/")}
          className="ml-3 mt-8 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-6 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)] hover:border-[var(--border-hover)]"
        >
          <ArrowLeft size={18} />
          Back Home
        </button>
      </motion.div>
    </div>
  );
}
