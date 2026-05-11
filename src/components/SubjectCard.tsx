"use client";

import { type LucideIcon } from "lucide-react";
import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";

type SubjectColor = "gold" | "blue" | "pink" | "purple" | "teal";

interface Subject {
  id: string;
  name: string;
  iconName: string;
  color: SubjectColor;
  chapters: number;
  sets: number;
  progress: number;
  bestScore: number;
  attempts: number;
  avgScore: number;
}

interface SubjectCardProps {
  subject: Subject;
  icon: LucideIcon;
  wide?: boolean;
  onClick?: () => void;
}

const iconGradientMap: Record<SubjectColor, { from: string; to: string; text: string }> = {
  gold: { from: "rgba(245,197,24,0.2)", to: "rgba(245,197,24,0.05)", text: "var(--accent)" },
  blue: { from: "rgba(59,130,246,0.2)", to: "rgba(59,130,246,0.05)", text: "var(--blue)" },
  pink: { from: "rgba(236,72,153,0.2)", to: "rgba(236,72,153,0.05)", text: "var(--pink)" },
  purple: { from: "rgba(139,92,246,0.2)", to: "rgba(139,92,246,0.05)", text: "var(--purple)" },
  teal: { from: "rgba(20,184,166,0.2)", to: "rgba(20,184,166,0.05)", text: "var(--teal)" },
};

const barColorMap: Record<SubjectColor, "gold" | "blue" | "pink" | "purple" | "teal"> = {
  gold: "gold",
  blue: "blue",
  pink: "pink",
  purple: "purple",
  teal: "teal",
};

export default function SubjectCard({ subject, icon: Icon, wide, onClick }: SubjectCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  const handleClick = onClick ?? (() => router.push(`/subject/${subject.id}`));

  const { from, to, text } = iconGradientMap[subject.color];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className={`group relative cursor-pointer overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] p-6 transition-all duration-300 hover:-translate-y-[3px] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] ${
        wide ? "col-span-2" : ""
      }`}
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(245,197,24,0.06), transparent 40%)",
        }}
      />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-[14px]"
            style={{
              background: `linear-gradient(135deg, ${from}, ${to})`,
              color: text,
            }}
          >
            <Icon size={24} strokeWidth={1.8} />
          </div>
          <span className="text-xs font-semibold text-[var(--text-muted)]">
            {subject.progress}%
          </span>
        </div>

        <h3 className="mb-1.5 text-lg font-bold">{subject.name}</h3>
        <p className="mb-4 text-[13px] text-[var(--text-secondary)]">
          {subject.chapters} chapters &middot; {subject.sets} sets
        </p>

        <ProgressBar value={subject.progress} color={barColorMap[subject.color]} />

        <div className="mt-4 flex gap-4 border-t border-[var(--border)] pt-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-bold">{subject.bestScore}%</span>
            <span className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              Best
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-bold">{subject.attempts}</span>
            <span className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              Attempts
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-bold">{subject.avgScore}%</span>
            <span className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              Avg
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
