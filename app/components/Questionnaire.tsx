"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendAnswers, type Answers } from "../lib/sendAnswers";

interface ChoiceOption {
  value: string;
  emoji: string;
  label: string;
  hint: string;
  bgSelected: string;
  borderSelected: string;
  checkColor: string;
  wide?: boolean;
}

type Step =
  | {
      key: "startTime" | "homeTime";
      kind: "time";
      emoji: string;
      title: string;
      subtitle: string;
      chips: string[];
    }
  | {
      key: "ride" | "tower";
      kind: "choice";
      emoji: string;
      title: string;
      subtitle: string;
      options: ChoiceOption[];
    }
  | {
      key: "wishes";
      kind: "text";
      emoji: string;
      title: string;
      subtitle: string;
    };

const steps: Step[] = [
  {
    key: "startTime",
    kind: "time",
    emoji: "⏰",
    title: "Во сколько сможешь выйти?",
    subtitle: "Чем раньше, тем больше времени проведём вместе ☀️",
    chips: ["10:00", "12:00", "14:00", "16:00"],
  },
  {
    key: "ride",
    kind: "choice",
    emoji: "🗺️",
    title: "Покатаемся по городу или погуляем?",
    subtitle: "Как тебе больше хочется 🌸",
    options: [
      {
        value: "Покатаемся по городу 🚗",
        emoji: "🚗",
        label: "Покатаемся",
        hint: "музыка, окна, огни города",
        bgSelected: "bg-sky-50",
        borderSelected: "border-sky-300",
        checkColor: "bg-sky-400",
      },
      {
        value: "Погуляем 🌿",
        emoji: "🌿",
        label: "Погуляем",
        hint: "неспешно и с разговорами",
        bgSelected: "bg-emerald-50",
        borderSelected: "border-emerald-300",
        checkColor: "bg-emerald-400",
      },
      {
        value: "И то, и другое ✨",
        emoji: "✨",
        label: "И то, и другое",
        hint: "зачем выбирать?",
        bgSelected: "bg-violet-50",
        borderSelected: "border-violet-300",
        checkColor: "bg-violet-400",
        wide: true,
      },
    ],
  },
  {
    key: "tower",
    kind: "choice",
    emoji: "🗼",
    title: "На вышку хочешь вечером или пока светло?",
    subtitle: "Там красиво в любое время, но по-разному 💫",
    options: [
      {
        value: "Пока светло 🌇",
        emoji: "🌇",
        label: "Пока светло",
        hint: "весь город как на ладони",
        bgSelected: "bg-amber-50",
        borderSelected: "border-amber-300",
        checkColor: "bg-amber-400",
      },
      {
        value: "Вечером 🌃",
        emoji: "🌃",
        label: "Вечером",
        hint: "огоньки внизу",
        bgSelected: "bg-indigo-50",
        borderSelected: "border-indigo-300",
        checkColor: "bg-indigo-400",
      },
    ],
  },
  {
    key: "homeTime",
    kind: "time",
    emoji: "🏠",
    title: "Во сколько вернуть тебя домой?",
    subtitle: "Доставлю вовремя, обещаю 🤝",
    chips: ["20:00", "21:00", "22:00", "23:00"],
  },
  {
    key: "wishes",
    kind: "text",
    emoji: "💭",
    title: "Какие-то пожелания?",
    subtitle: "Можно пропустить, но мне будет приятно 😊",
  },
];

const LATE_START = "16:00";

const slide = {
  enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
};

interface Props {
  onDone: () => void;
}

export default function Questionnaire({ onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Answers>({
    startTime: "",
    ride: "",
    tower: "",
    homeTime: "",
    wishes: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const step = steps[index];
  const value = answers[step.key];
  const isLast = index === steps.length - 1;
  const canContinue = step.kind === "text" || value !== "";

  const setValue = (v: string) =>
    setAnswers((prev) => ({ ...prev, [step.key]: v }));

  const goBack = () => {
    if (index === 0 || status === "sending") return;
    setDirection(-1);
    setIndex((i) => i - 1);
  };

  const goNext = async () => {
    if (!canContinue || status === "sending") return;
    if (!isLast) {
      setDirection(1);
      setIndex((i) => i + 1);
      return;
    }
    setStatus("sending");
    try {
      await sendAnswers(answers);
      onDone();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-100 px-6 py-8 sm:px-8 flex flex-col gap-6">
      {/* Progress hearts */}
      <div className="flex justify-center gap-2">
        {steps.map((s, i) => (
          <motion.span
            key={s.key}
            className="text-lg select-none"
            animate={{
              scale: i === index ? 1.3 : 1,
              opacity: i <= index ? 1 : 0.35,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            {i <= index ? "💗" : "🤍"}
          </motion.span>
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step.key}
          custom={direction}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col gap-6"
        >
          {/* Header */}
          <div className="text-center space-y-1">
            <motion.div
              className="text-5xl mb-2 select-none"
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {step.emoji}
            </motion.div>
            <h2 className="text-2xl font-extrabold text-rose-400 leading-snug">
              {step.title}
            </h2>
            <p className="text-sm text-rose-300 font-semibold">{step.subtitle}</p>
          </div>

          {step.kind === "time" && (
            <TimeStep
              value={value}
              chips={step.chips}
              onChange={setValue}
              showEarlyHint={step.key === "startTime" && value > LATE_START}
            />
          )}

          {step.kind === "choice" && (
            <ChoiceStep value={value} options={step.options} onChange={setValue} />
          )}

          {step.kind === "text" && (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Что угодно: любимый кофе, музыка в машине, куда точно хочешь заехать…"
              className="w-full resize-none rounded-2xl border-2 border-rose-100 bg-white px-4 py-3 text-gray-600 font-semibold placeholder:text-rose-200 placeholder:font-medium focus:outline-none focus:border-rose-300 transition-colors"
            />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm font-bold text-rose-400"
          >
            Ой, не отправилось 🙈 Проверь интернет и попробуй ещё раз
          </motion.p>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <motion.button
          onClick={goBack}
          animate={{ opacity: index === 0 ? 0 : 1 }}
          whileTap={index === 0 ? undefined : { scale: 0.95 }}
          className={[
            "px-5 py-3 rounded-2xl font-bold text-rose-300 border-2 border-rose-100 bg-white select-none",
            index === 0 ? "pointer-events-none" : "cursor-pointer hover:border-rose-200",
          ].join(" ")}
          aria-hidden={index === 0}
          tabIndex={index === 0 ? -1 : 0}
        >
          ← Назад
        </motion.button>

        <motion.button
          onClick={goNext}
          animate={{ opacity: canContinue ? 1 : 0.45 }}
          whileHover={canContinue ? { scale: 1.05 } : undefined}
          whileTap={canContinue ? { scale: 0.95 } : undefined}
          transition={{ duration: 0.2 }}
          className={[
            "flex items-center gap-2 px-8 py-3 rounded-2xl font-extrabold text-lg select-none transition-shadow",
            canContinue
              ? "bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-lg shadow-rose-200 cursor-pointer"
              : "bg-rose-100 text-rose-300 cursor-not-allowed",
          ].join(" ")}
        >
          {status === "sending" ? (
            <>
              <motion.span
                className="inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              Отправляю…
            </>
          ) : isLast ? (
            status === "error" ? "Попробовать ещё раз 💌" : "Отправить 💌"
          ) : (
            "Дальше →"
          )}
        </motion.button>
      </div>
    </div>
  );
}

function TimeStep({
  value,
  chips,
  onChange,
  showEarlyHint,
}: {
  value: string;
  chips: string[];
  onChange: (v: string) => void;
  showEarlyHint: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-4 gap-2 w-full">
        {chips.map((chip) => {
          const active = value === chip;
          return (
            <motion.button
              key={chip}
              onClick={() => onChange(chip)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.93 }}
              className={[
                "py-3 rounded-2xl border-2 font-extrabold text-sm transition-colors cursor-pointer select-none",
                active
                  ? "bg-rose-50 border-rose-300 text-rose-500 shadow-sm"
                  : "bg-white border-rose-100 text-gray-500 hover:border-rose-200",
              ].join(" ")}
            >
              {chip}
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 text-sm font-semibold text-rose-300">
        <span className="h-px w-8 bg-rose-100" />
        или своё время
        <span className="h-px w-8 bg-rose-100" />
      </div>

      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-40 text-center text-2xl font-extrabold text-rose-400 rounded-2xl border-2 border-rose-100 bg-white px-4 py-2 focus:outline-none focus:border-rose-300 transition-colors"
      />

      <AnimatePresence>
        {showEarlyHint && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm font-bold text-pink-400"
          >
            а может чуть пораньше? 🥺
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChoiceStep({
  value,
  options,
  onChange,
}: {
  value: string;
  options: ChoiceOption[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option, i) => {
        const isSelected = value === option.value;
        return (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.96 }}
            className={[
              "relative flex flex-col items-center gap-1 rounded-2xl border-2 transition-colors duration-200 cursor-pointer select-none",
              option.wide ? "col-span-2 flex-row justify-center gap-3 py-3 px-4" : "p-5",
              isSelected
                ? `${option.bgSelected} ${option.borderSelected} shadow-sm`
                : "bg-white border-rose-100 shadow-sm hover:border-rose-200",
            ].join(" ")}
          >
            <span className={option.wide ? "text-2xl" : "text-4xl leading-none mb-1"}>
              {option.emoji}
            </span>
            <span className={option.wide ? "text-left" : "text-center"}>
              <span className="block text-sm font-extrabold text-gray-600">
                {option.label}
              </span>
              <span className="block text-xs font-semibold text-gray-400">
                {option.hint}
              </span>
            </span>

            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`absolute -top-2 -right-2 w-6 h-6 ${option.checkColor} rounded-full flex items-center justify-center text-white text-xs font-extrabold shadow`}
                >
                  ✓
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
