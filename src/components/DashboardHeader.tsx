"use client";

import { Search, Bell, Menu } from "lucide-react";
import { useSidebar } from "./providers/SidebarProvider";

interface DashboardHeaderProps {
  userName?: string;
  quizCount?: number;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHeader({
  userName = "Ahmad",
  quizCount = 12,
}: DashboardHeaderProps) {
  const { toggle } = useSidebar();

  return (
    <header className="mb-9 flex items-center justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-[28px] font-bold tracking-tight md:text-[32px]">
          {getGreeting()}, {userName}
        </h1>
        <p className="mt-1.5 text-[15px] text-[var(--text-secondary)]">
          Ready to crush your HSSC-2 board prep? You&apos;ve completed {quizCount} quizzes this week.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text)] lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text)]"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text)]"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}
