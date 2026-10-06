"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

interface Props {
  onYes: () => void;
}

const BTN_W = 124;
const BTN_H = 52;
const MARGIN = 16;

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

type Rect = { x: number; y: number; width: number; height: number };

// Visible area of the screen: on iPhone the Safari toolbars eat into innerHeight,
// so prefer visualViewport when it's available.
function getViewport(): Rect {
  const vv = window.visualViewport;
  return vv
    ? { x: vv.offsetLeft, y: vv.offsetTop, width: vv.width, height: vv.height }
    : { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
}

function clampToViewport(pos: { x: number; y: number }, w: number, h: number) {
  const vp = getViewport();
  return {
    x: Math.min(Math.max(pos.x, vp.x + MARGIN), vp.x + vp.width - w - MARGIN),
    y: Math.min(Math.max(pos.y, vp.y + MARGIN), vp.y + vp.height - h - MARGIN),
  };
}

function overlaps(a: Rect, b: Rect, gap: number) {
  return !(
    a.x + a.width + gap < b.x ||
    b.x + b.width + gap < a.x ||
    a.y + a.height + gap < b.y ||
    b.y + b.height + gap < a.y
  );
}

export default function Screen1({ onYes }: Props) {
  const [mounted, setMounted] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const slotRef = useRef<HTMLDivElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);

  const getNoSize = () => ({
    w: noRef.current?.offsetWidth ?? BTN_W,
    h: noRef.current?.offsetHeight ?? BTN_H,
  });

  const getRandomPos = useCallback((): { x: number; y: number } => {
    const vp = getViewport();
    const { w, h } = getNoSize();
    const yes = yesRef.current?.getBoundingClientRect();
    let pos = { x: 0, y: 0 };
    // A few tries to avoid landing right on top of the "Да" button.
    for (let i = 0; i < 12; i++) {
      pos = {
        x: vp.x + MARGIN + Math.random() * Math.max(0, vp.width - w - MARGIN * 2),
        y: vp.y + MARGIN + Math.random() * Math.max(0, vp.height - h - MARGIN * 2),
      };
      if (!yes || !overlaps({ ...pos, width: w, height: h }, yes, 12)) break;
    }
    return pos;
  }, []);

  useEffect(() => {
    // Start exactly in the empty slot next to "Да". Wait for the page
    // transition to finish so the slot is measured at its final position.
    const placeTimer = setTimeout(() => {
      const slot = slotRef.current?.getBoundingClientRect();
      if (slot) setNoPos(clampToViewport({ x: slot.left, y: slot.top }, BTN_W, BTN_H));
      setMounted(true);
    }, 500);

    // Keep the button on screen when the viewport changes
    // (rotation, Safari toolbars collapsing, keyboard).
    const keepInside = () => {
      const { w, h } = getNoSize();
      setNoPos((p) => clampToViewport(p, w, h));
    };
    window.addEventListener("resize", keepInside);
    window.visualViewport?.addEventListener("resize", keepInside);
    window.visualViewport?.addEventListener("scroll", keepInside);
    return () => {
      clearTimeout(placeTimer);
      window.removeEventListener("resize", keepInside);
      window.visualViewport?.removeEventListener("resize", keepInside);
      window.visualViewport?.removeEventListener("scroll", keepInside);
    };
  }, []);

  const runAway = useCallback(() => {
    setNoPos(getRandomPos());
  }, [getRandomPos]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-100 px-6 py-8 sm:px-8 sm:py-10 flex flex-col items-center gap-6 text-center relative">
      <CatIllustration />

      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold text-rose-400 leading-snug">
          Каусар, пойдешь со мной погулять?
        </h1>
        <p className="text-sm text-rose-300 font-semibold">
          Будет классно, обещаю ✨
        </p>
      </motion.div>

      {/* Button row */}
      <div className="flex gap-4 items-center justify-center mt-1">
        {/* "Да" — pulsing + scale on hover */}
        <motion.button
          ref={yesRef}
          onClick={onYes}
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.14 }}
          whileTap={{ scale: 0.93 }}
          className="bg-gradient-to-r from-rose-400 to-pink-400 text-white font-extrabold text-lg px-8 py-3 rounded-2xl shadow-lg shadow-rose-200 cursor-pointer select-none"
        >
          Да 💕
        </motion.button>

        {/* Invisible placeholder so layout doesn't shift; "Нет" starts here */}
        <div
          ref={slotRef}
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
        Ищи вторую кнопку...
      </motion.p>

      {/* Runaway "Нет" button. Rendered into <body>: the card's backdrop-blur and
          the page transition's transform would otherwise make `fixed` relative
          to the card instead of the screen, pushing the button out of view. */}
      {mounted &&
        createPortal(
          <motion.button
            ref={noRef}
            style={{ position: "fixed", left: 0, top: 0, zIndex: 50, width: BTN_W, height: BTN_H }}
            animate={{ x: noPos.x, y: noPos.y, opacity: 1 }}
            initial={{ x: noPos.x, y: noPos.y, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onMouseEnter={runAway}
            onTouchStart={runAway}
            onClick={runAway}
            className="flex items-center justify-center bg-white text-rose-300 font-bold text-base rounded-2xl border-2 border-rose-200 shadow-md cursor-default select-none touch-manipulation"
          >
            Нет 🙄
          </motion.button>,
          document.body
        )}
    </div>
  );
}
