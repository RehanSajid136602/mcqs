"use client";
import { motion } from "framer-motion";
import { Code2, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CODING_TOPICS, getTopicIcon } from "@/lib/coding-icons";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function CodingHub() {
  const router = useRouter();
  return (
    <div className="min-h-screen px-4 sm:px-6 py-12">
      <div className="max-w-5xl mx-auto relative">
        <div className="absolute right-0 top-0">
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[--card] border border-white/10 text-[--text]/70 hover:text-[--text] hover:border-white/20 transition"
          >
            <User size={18} />
            <span className="text-sm font-medium hidden sm:inline">Profile</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm mb-4">
            <Code2 size={16} />
            <span>HSSC-II Computer Science</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[--text] mb-4 font-display tracking-tight">
            Coding Lab
          </h1>
          <p className="text-[--text]/60 text-lg max-w-2xl mx-auto">
            Master Python fundamentals and database queries with interactive examples and practice questions.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {CODING_TOPICS.map((topic) => (
            <motion.div key={topic.id} variants={item}>
              <Link
                href={`/coding/${topic.id}`}
                className="block bg-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-blue-500/40 hover:bg-slate-900/60 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-xl ${topic.colorBg} ${topic.color}`}>
                    {getTopicIcon(topic.iconName)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-[--text] mb-1 group-hover:text-blue-400 transition-colors">
                      {topic.title}
                    </h2>
                    <p className="text-[--text]/50 text-sm mb-3">{topic.subtitle}</p>
                    <p className="text-[--text]/40 text-xs mb-4 line-clamp-2">{topic.description}</p>
                    <div className="flex items-center gap-2 text-sm text-blue-400">
                      <span>Start Learning</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs text-[--text]/40">
                    <span>{topic.examples.length} Examples</span>
                    <span>{topic.questions.length} Questions</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-[--text]/40 text-sm">
            Ready to practice MCQs?{" "}
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              Back to Home
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}