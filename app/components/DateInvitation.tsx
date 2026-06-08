"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Screen1 from "./Screen1";
import Screen2 from "./Screen2";
import Screen3 from "./Screen3";

type Step = 1 | 2 | 3;

const pageVariants = {
  initial: { opacity: 0, y: 32, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -32, scale: 0.96 },
};

const pageTransition = { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const };

export default function DateInvitation() {
  const [step, setStep] = useState<Step>(1);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleActivity = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="screen1"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="w-full max-w-sm"
          >
            <Screen1 onYes={() => setStep(2)} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="screen2"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="w-full max-w-lg"
          >
            <Screen2
              selected={selected}
              onToggle={toggleActivity}
              onContinue={() => setStep(3)}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="screen3"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="w-full max-w-sm"
          >
            <Screen3 />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
