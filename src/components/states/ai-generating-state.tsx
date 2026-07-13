"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderFive } from "../ui/loader";

const TIPS = [
  "The more details you provide, the better your playbook will be",
  "You can edit playbooks after they're generated",
  "Add contexts to get more targeted strategy recommendations",
  "A new session can be created directly from a created playbook",
  "Strategies can be customized to fit your needs",
  "Easily reorder your playbook strategies by dragging and dropping them into your preferred sequence",
  "Really like a playbook? Add it to your Favorites for easier lookup",
];

const TIP_DURATION = 4000; // 4 seconds per tip

export function AIGeneratingState() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % TIPS.length);
    }, TIP_DURATION);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative flex min-h-[500px] flex-col items-center justify-center gap-10 overflow-hidden px-6 py-16"
      aria-label="Generating playbook"
    >
      <LoaderFive text={"Generating playbook..."} />

      {/* Cycling Tips */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTipIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="absolute bottom-2 flex w-full flex-col items-center justify-center px-4 text-center"
        >
          <div className="mb-2 flex items-center justify-center gap-3">
            <div className="bg-secondary-400 h-1 w-1 rounded-full"></div>

            <p className="text-secondary-400 text-sm font-semibold tracking-wide uppercase">
              Tip
            </p>
            <div className="bg-secondary-400 h-1 w-1 rounded-full"></div>
          </div>
          <p className="text-muted-foreground max-w-xl text-lg">
            {TIPS[currentTipIndex]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
