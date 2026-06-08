"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Activity {
  id: string;
  emoji: string;
  label: string;
  bgSelected: string;
  borderSelected: string;
  checkColor: string;
}

const activities: Activity[] = [
  {
    id: "dinner",
    emoji: "🍕",
    label: "Вкусный ужин",
    bgSelected: "bg-orange-50",
    borderSelected: "border-orange-300",
    checkColor: "bg-orange-400",
  },
  {
    id: "coffee",
    emoji: "☕️",
    label: "Попить кофе и поболтать",
    bgSelected: "bg-amber-50",
    borderSelected: "border-amber-300",
    checkColor: "bg-amber-400",
  },
  {
    id: "cinema",
    emoji: "🍿",
    label: "Сходить в кино",
    bgSelected: "bg-sky-50",
    borderSelected: "border-sky-300",
    checkColor: "bg-sky-400",
  },
  {
    id: "walk",
    emoji: "🌿",
    label: "Просто погулять",
    bgSelected: "bg-emerald-50",
    borderSelected: "border-emerald-300",
    checkColor: "bg-emerald-400",
  },
  {
    id: "bowling",
    emoji: "🎳",
    label: "Боулинг",
    bgSelected: "bg-violet-50",
    borderSelected: "border-violet-300",
    checkColor: "bg-violet-400",
  },
  {
    id: "games",
    emoji: "🎲",
    label: "Настольные игры",
    bgSelected: "bg-pink-50",
    borderSelected: "border-pink-300",
    checkColor: "bg-pink-400",
  },
];

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
  onContinue: () => void;
}

export default function Screen2({ selected, onToggle, onContinue }: Props) {
  const hasSelection = selected.length > 0;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-100 px-6 py-8 sm:px-8 flex flex-col gap-6">
      {/* Header */}
      <motion.div
        className="text-center space-y-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="text-5xl mb-2"
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          🌸
        </motion.div>
        <h2 className="text-2xl font-extrabold text-rose-400">
          Ура! А чем займемся?
        </h2>
        <p className="text-sm text-rose-300 font-semibold">
          Выбери, что тебе больше по душе 🌸
        </p>
      </motion.div>

      {/* Activity grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {activities.map((activity, i) => {
          const isSelected = selected.includes(activity.id);
          return (
            <motion.button
              key={activity.id}
              onClick={() => onToggle(activity.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.96 }}
              className={[
                "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-colors duration-200 cursor-pointer select-none",
                isSelected
                  ? `${activity.bgSelected} ${activity.borderSelected} shadow-sm`
                  : "bg-white border-rose-100 shadow-sm hover:border-rose-200",
              ].join(" ")}
            >
              <span className="text-3xl leading-none">{activity.emoji}</span>
              <span className="text-xs font-bold text-gray-600 text-center leading-snug">
                {activity.label}
              </span>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`absolute -top-2 -right-2 w-6 h-6 ${activity.checkColor} rounded-full flex items-center justify-center text-white text-xs font-extrabold shadow`}
                  >
                    ✓
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Continue button */}
      <div className="flex justify-center">
        <motion.button
          onClick={hasSelection ? onContinue : undefined}
          animate={{ opacity: hasSelection ? 1 : 0.45 }}
          whileHover={hasSelection ? { scale: 1.05 } : undefined}
          whileTap={hasSelection ? { scale: 0.95 } : undefined}
          transition={{ duration: 0.2 }}
          className={[
            "px-10 py-3 rounded-2xl font-extrabold text-lg transition-shadow",
            hasSelection
              ? "bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-lg shadow-rose-200 cursor-pointer"
              : "bg-rose-100 text-rose-300 cursor-not-allowed",
          ].join(" ")}
        >
          Продолжить →
        </motion.button>
      </div>
    </div>
  );
}
