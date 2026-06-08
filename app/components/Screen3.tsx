"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

export default function Screen3() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [recycle, setRecycle] = useState(true);

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });

    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);

    const stopTimer = setTimeout(() => setRecycle(false), 7000);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(stopTimer);
    };
  }, []);

  const floatingEmojis = ["💕", "🌸", "✨", "🌸", "💕"];

  return (
    <>
      {size.width > 0 && (
        <Confetti
          width={size.width}
          height={size.height}
          recycle={recycle}
          numberOfPieces={recycle ? 220 : 40}
          colors={[
            "#fda4af",
            "#f9a8d4",
            "#d8b4fe",
            "#fde68a",
            "#86efac",
            "#fca5a5",
            "#fbcfe8",
          ]}
          gravity={0.18}
          style={{ zIndex: 40 }}
        />
      )}

      <motion.div
        className="bg-white/85 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-100 px-8 py-10 flex flex-col items-center gap-6 text-center relative z-50"
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
      >
        {/* Celebration GIF placeholder */}
        <motion.div
          animate={{ rotate: [-6, 6, -6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-36 h-36 rounded-full bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100 shadow-lg flex items-center justify-center"
        >
          {/* GIF placeholder — замените span на <img src="your-gif-url" /> */}
          <span className="text-7xl select-none" role="img" aria-label="celebration">
            🥳
          </span>
        </motion.div>

        {/* Floating emoji row */}
        <div className="flex gap-1">
          {floatingEmojis.map((emoji, i) => (
            <motion.span
              key={i}
              className="text-xl select-none"
              animate={{ y: [0, -9, 0] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        {/* Main message */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-rose-400 leading-snug">
            Договорились! Я всё организую.
          </h2>
          <p className="text-lg font-bold text-pink-400">
            С нетерпением жду встречи! ❤️
          </p>
        </motion.div>

        {/* Signature */}
        <motion.div
          className="w-full pt-4 border-t border-rose-100 space-y-1"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-rose-400 font-extrabold text-xl italic tracking-wide">
            С любовью, Диас
          </p>
          <p className="text-2xl">💌</p>
        </motion.div>
      </motion.div>
    </>
  );
}
