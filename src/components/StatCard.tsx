"use client";

import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

type IconColor = "gold" | "blue" | "green" | "purple";

interface StatCardProps {
  icon: LucideIcon;
  iconColor: IconColor;
  value: string;
  label: string;
  trend: number;
  trendLabel: string;
}

const iconColorMap: Record<IconColor, { bg: string; text: string }> = {
  gold: { bg: "bg-[rgba(245,197,24,0.1)]", text: "text-[var(--accent)]" },
  blue: { bg: "bg-[rgba(59,130,246,0.1)]", text: "text-[var(--blue)]" },
  green: { bg: "bg-[rgba(16,185,129,0.1)]", text: "text-[var(--success)]" },
  purple: { bg: "bg-[rgba(139,92,246,0.1)]", text: "text-[var(--purple)]" },
};

export default function StatCard({
  icon: Icon,
  iconColor,
  value,
  label,
  trend,
  trendLabel,
}: StatCardProps) {
  const isPositive = trend >= 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-3 flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconColorMap[iconColor].bg} ${iconColorMap[iconColor].text}`}
        >
          <Icon size={20} strokeWidth={2} />
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isPositive
              ? "bg-[rgba(16,185,129,0.1)] text-[var(--success)]"
              : "bg-[rgba(239,68,68,0.1)] text-[var(--danger)]"
          }`}
        >
          {isPositive ? (
            <TrendingUp size={12} strokeWidth={2.5} />
          ) : (
            <TrendingDown size={12} strokeWidth={2.5} />
          )}
          {Math.abs(trend)}% {trendLabel}
        </span>
      </div>

      <p className="mb-1 text-[28px] font-bold tracking-tight">{value}</p>
      <p className="text-[13px] text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
