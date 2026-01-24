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
  "Really like a playbook? Add it to your Favorites for easier search",
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
      className="relative flex flex-col  items-center justify-center py-16  px-6 min-h-[500px] gap-10 overflow-hidden"
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
          className="text-center px-4 flex-col w-full flex items-center absolute bottom-2 justify-center"
        >
          <div className="flex items-center gap-3 justify-center mb-2">
            <div className="h-1 w-1 rounded-full bg-secondary-400"></div>

            <p className="text-sm font-semibold text-secondary-400 uppercase tracking-wide">
              Tip
            </p>
            <div className="h-1 w-1 rounded-full bg-secondary-400"></div>
          </div>
          <p className="text-muted-foreground text-lg max-w-xl">
            {TIPS[currentTipIndex]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
