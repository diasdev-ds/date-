"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  onYes: () => void;
}

const BTN_W = 124;
const BTN_H = 52;
const MARGIN = 20;

function CatIllustration() {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="w-44 h-44 rounded-full bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 shadow-lg flex items-center justify-center"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* GIF placeholder — замените src на URL вашей гифки */}
        <span
          className="text-8xl select-none"
          role="img"
          aria-label="cute cat"
        >
          🐱
        </span>
      </motion.div>

      {[
        { emoji: "💕", top: "5%", right: "-8%", delay: 0 },
        { emoji: "✨", top: "55%", right: "-14%", delay: 0.5 },
        { emoji: "🌸", top: "15%", left: "-12%", delay: 0.9 },
      ].map(({ emoji, top, right, left, delay }) => (
        <motion.span
          key={emoji}
          className="absolute text-xl select-none pointer-events-none"
          style={{ top, right, left }}
          animate={{ y: [-4, 4, -4], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, delay, ease: "easeInOut" }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

export default function Screen1({ onYes }: Props) {
  const [mounted, setMounted] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const getRandomPos = useCallback((): { x: number; y: number } => {
    const x = MARGIN + Math.random() * (window.innerWidth - BTN_W - MARGIN * 2);
    const y = MARGIN + Math.random() * (window.innerHeight - BTN_H - MARGIN * 2);
    return { x, y };
  }, []);

  useEffect(() => {
    const x = Math.min(
      window.innerWidth / 2 + 76,
      window.innerWidth - BTN_W - MARGIN
    );
    const y = Math.min(
      window.innerHeight * 0.64,
      window.innerHeight - BTN_H - MARGIN
    );
    setNoPos({ x, y });
    setMounted(true);
  }, []);

  const runAway = useCallback(() => {
    setNoPos(getRandomPos());
  }, [getRandomPos]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-100 px-8 py-10 flex flex-col items-center gap-6 text-center relative">
      <CatIllustration />

      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold text-rose-400 leading-snug">
          Пойдешь со мной на свидание?
        </h1>
        <p className="text-sm text-rose-300 font-semibold">
          Я очень хочу провести время с тобой 🥺
        </p>
      </motion.div>

      {/* Button row */}
      <div className="flex gap-4 items-center justify-center mt-1">
        {/* "Да" — pulsing + scale on hover */}
        <motion.button
          onClick={onYes}
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.14 }}
          whileTap={{ scale: 0.93 }}
          className="bg-gradient-to-r from-rose-400 to-pink-400 text-white font-extrabold text-lg px-8 py-3 rounded-2xl shadow-lg shadow-rose-200 cursor-pointer select-none"
        >
          Да 💕
        </motion.button>

        {/* Invisible placeholder so layout doesn't shift */}
        <div
          style={{ width: BTN_W, height: BTN_H }}
          className="invisible shrink-0"
          aria-hidden="true"
        />
      </div>

      <motion.p
        className="text-xs text-rose-200 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Ищи вторую кнопку... 😉
      </motion.p>

      {/* Runaway "Нет" button — fixed over the full viewport */}
      {mounted && (
        <motion.button
          style={{ position: "fixed", left: 0, top: 0, zIndex: 50 }}
          animate={{ x: noPos.x, y: noPos.y }}
          initial={{ x: noPos.x, y: noPos.y }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          onMouseEnter={runAway}
          onTouchStart={(e) => {
            e.preventDefault();
            runAway();
          }}
          className="bg-white text-rose-300 font-bold text-base px-6 py-3 rounded-2xl border-2 border-rose-200 shadow-md cursor-default select-none"
        >
          Нет 🙈
        </motion.button>
      )}
    </div>
  );
}
