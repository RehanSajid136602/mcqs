"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Code2,
  BarChart3,
  RotateCcw,
  Trophy,
  User,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "./providers/SidebarProvider";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/" },
      { label: "Subjects", icon: BookOpen, href: "/subjects", badge: 4 },
      { label: "Coding Lab", icon: Code2, href: "/coding" },
      { label: "Analytics", icon: BarChart3, href: "/analytics" },
    ],
  },
  {
    title: "Personal",
    items: [
      { label: "Review", icon: RotateCcw, href: "/review" },
      { label: "Achievements", icon: Trophy, href: "/achievements" },
      { label: "Profile", icon: User, href: "/profile" },
    ],
  },
];

export default function Sidebar() {
  const { isOpen, close } = useSidebar();
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const sidebarX = isDesktop ? 0 : isOpen ? 0 : -260;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={close}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sidebarX }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 z-50 flex h-full w-[260px] flex-col border-r border-[var(--border)] bg-[var(--bg-surface)]/60 backdrop-blur-[20px] max-lg:shadow-2xl"
      >
        <button
          onClick={close}
          className="absolute right-3 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)] lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>

        <div className="mb-10 flex items-center gap-3 px-8 pt-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[#d4a017] shadow-[0_4px_20px_rgba(245,197,24,0.3)]">
            <GraduationCap size={22} className="text-[var(--bg)]" />
          </div>
          <span className="font-display text-[22px] font-bold tracking-tight">
            MCQ <span className="text-[var(--accent)]">Master</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-5">
          {navSections.map((section) => (
            <div key={section.title} className="mb-7">
              <div className="mb-2.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                {section.title}
              </div>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className={`group flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "border border-[rgba(245,197,24,0.2)] bg-[rgba(245,197,24,0.1)] text-[var(--accent)]"
                            : "text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--text)]"
                        }`}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="ml-auto rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-[var(--bg)]">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-auto border-t border-[var(--border)] px-5 pt-4 pb-2">
          <div className="flex items-center gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--blue)] to-[var(--purple)] text-sm font-bold text-white">
              AR
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-[var(--text)]">
                Ahmad Raza
              </div>
              <div className="text-xs text-[var(--text-muted)]">HSSC-2 Student</div>
            </div>
            <button
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-secondary)]"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
