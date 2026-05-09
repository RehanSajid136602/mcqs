"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Terminal } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showTerminal?: boolean;
  expectedOutput?: string;
}

export default function CodeBlock({ code, language = "python", title, expectedOutput }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-900/50">
      {title && (
        <div className="px-4 py-2 bg-slate-800/50 border-b border-white/5 flex items-center gap-2">
          <span className="text-xs text-[--text]/50 uppercase tracking-wider">{title}</span>
        </div>
      )}
      <div className="relative">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-slate-800/30">
          <span className="text-xs text-cyan-400/70 font-mono">{language}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[--text]/60 hover:text-[--text] hover:bg-white/5 transition-all"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
            {expectedOutput && (
              <button
                onClick={() => setShowTerminal(!showTerminal)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[--text]/60 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"
              >
                <Terminal size={14} />
                <span>{showTerminal ? "Hide" : "Run"} Terminal</span>
              </button>
            )}
          </div>
        </div>
        <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
          <code className="text-slate-300">{code}</code>
        </pre>
      </div>

      <AnimatePresence>
        {showTerminal && expectedOutput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="border-t border-white/5 overflow-hidden"
          >
            <div className="bg-slate-950 p-4 font-mono text-sm">
              <div className="flex items-center gap-2 mb-3 text-cyan-400/80">
                <Terminal size={14} />
                <span className="text-xs uppercase tracking-wider">Expected Output</span>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3 text-emerald-400 border border-emerald-400/20 whitespace-pre">
                {expectedOutput}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}