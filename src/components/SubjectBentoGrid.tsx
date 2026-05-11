"use client";

import { motion } from "framer-motion";
import { Atom, Calculator, BookOpen, Cpu, Code2, Terminal } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import SubjectCard from "./SubjectCard";

type SubjectColor = "gold" | "blue" | "pink" | "purple" | "teal";

interface SubjectItem {
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

interface SubjectStats {
  avgPct: number;
  totalAttempts: number;
  bestPct: number;
}

interface SubjectBentoGridProps {
  subjects: SubjectItem[];
  stats: Record<string, SubjectStats>;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Atom,
  Calculator,
  BookOpen,
  Cpu,
  BarChart3: Atom,
  Code2,
  Terminal,
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

function isCodingLab(subject: SubjectItem) {
  return subject.id === "coding-lab" || subject.id === "coding";
}

function isComputerScience(subject: SubjectItem) {
  return subject.id === "computer-science" || subject.id === "cs";
}

export default function SubjectBentoGrid({
  subjects,
  stats,
}: SubjectBentoGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {subjects.map((subject) => {
        const icon = ICON_MAP[subject.iconName] ?? Atom;
        const s = stats[subject.id];
        const enrichedSubject = {
          ...subject,
          bestScore: s?.bestPct ?? subject.bestScore,
          attempts: s?.totalAttempts ?? subject.attempts,
          avgScore: s?.avgPct ?? subject.avgScore,
        };

        if (isCodingLab(subject)) {
          return (
            <motion.div key={subject.id} variants={item}>
              <CodingLabCard subject={enrichedSubject} icon={icon} />
            </motion.div>
          );
        }

        return (
          <motion.div
            key={subject.id}
            variants={item}
            className={
              isComputerScience(subject) ? "col-span-1 md:col-span-2" : ""
            }
          >
            <SubjectCard
              subject={enrichedSubject}
              icon={icon}
              wide={isComputerScience(subject)}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function CodingLabCard({
  subject,
  icon: Icon,
}: {
  subject: SubjectItem;
  icon: LucideIcon;
}) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/coding")}
      className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-[rgba(20,184,166,0.2)] bg-gradient-to-br from-[rgba(20,184,166,0.1)] to-[rgba(59,130,246,0.05)] p-6 transition-all duration-300 hover:-translate-y-[3px] hover:border-[rgba(20,184,166,0.4)]">
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(20,184,166,0.15)] px-3.5 py-1.5 text-xs font-semibold text-[var(--teal)]">
        <Code2 size={14} strokeWidth={2} />
        Interactive
      </div>

      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-[14px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(20,184,166,0.05))",
            color: "var(--teal)",
          }}
        >
          <Icon size={24} strokeWidth={1.8} />
        </div>
      </div>

      <h3 className="mb-1.5 text-lg font-bold">{subject.name}</h3>
      <p className="mb-4 text-[13px] text-[var(--text-secondary)]">
        Python &amp; SQL practice with live examples
      </p>

      <div className="flex gap-4 border-t border-[rgba(20,184,166,0.15)] pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-bold">{subject.chapters}</span>
          <span className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
            Topics
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-bold">{subject.sets}</span>
          <span className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
            Examples
          </span>
        </div>
      </div>
    </div>
  );
}