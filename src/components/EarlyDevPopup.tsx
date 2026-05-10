"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

const STORAGE_KEY = "mcq_early_dev_dismissed";

export default function EarlyDevPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setTimeout(() => setShow(true), 500);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleDismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-[#111827] border border-amber-500/30 rounded-2xl p-8 shadow-2xl shadow-amber-500/5">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <AlertTriangle size={28} className="text-amber-400" />
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-2 rounded-lg hover:bg-white/5 text-[--text]/40 hover:text-[--text] transition"
                >
                  <X size={20} />
                </button>
              </div>
              <h2 className="text-xl font-bold text-[--text] mb-3 font-display">
                Early Development
              </h2>
              <p className="text-[--text]/60 leading-relaxed mb-6">
                This platform is in early development. MCQ content and explanations are being
                actively refined. Please verify answers against your textbooks when preparing
                for exams.
              </p>
              <button
                onClick={handleDismiss}
                className="w-full py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/20 text-amber-400 font-medium transition border border-amber-500/20"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
