import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { quizQuestions } from '../data/quizQuestions';

/**
 * Level 2 — Memory Challenge quiz.
 * Questions live in src/data/quizQuestions.js for easy editing.
 */
export default function MemoryQuiz({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [unlocked, setUnlocked] = useState(null);
  const [selected, setSelected] = useState(null);

  const question = quizQuestions[index];
  const progress = ((index + (feedback === 'correct' ? 1 : 0)) / quizQuestions.length) * 100;

  const handleAnswer = (optionIndex) => {
    if (feedback) return;
    setSelected(optionIndex);

    // Reflective questions (`anyAnswer`) accept whatever he picks.
    if (question.anyAnswer || optionIndex === question.correctIndex) {
      setFeedback('correct');
      setUnlocked(question.memory);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setSelected(null);
      }, 900);
    }
  };

  const continueAfterUnlock = () => {
    const next = index + 1;
    if (next >= quizQuestions.length) {
      onComplete?.();
      return;
    }
    setIndex(next);
    setFeedback(null);
    setUnlocked(null);
    setSelected(null);
  };

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />

      <header className="relative z-10 px-5 py-5 sm:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-rose-accent">Level 2</p>
        <h2 className="font-display text-2xl text-rose-ink sm:text-3xl">Memory Challenge</h2>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#C9A86C] to-[#E0C48A]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45 }}
          />
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pb-10 sm:px-8">
        <AnimatePresence mode="wait">
          {feedback === 'correct' && unlocked ? (
            <motion.div
              key={`unlock-${question.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex flex-1 flex-col justify-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 26, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 210, damping: 24 }}
                className="relative overflow-hidden rounded-3xl border border-rose-line bg-white/5 shadow-lift backdrop-blur-md"
              >
                <MemoryVisual memory={unlocked} seed={question.id} />
                <div className="px-6 py-5">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="font-display text-2xl text-rose-ink"
                  >
                    {unlocked.title}
                  </motion.h3>
                  <RevealText text={unlocked.text} />
                </div>

                {/* Gold foil sweeps across once, the way the card catches light */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 35%, rgba(240,217,160,0.16) 50%, transparent 65%)',
                  }}
                  initial={{ x: '-120%' }}
                  animate={{ x: '120%' }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
                />
              </motion.div>
              <motion.button
                type="button"
                onClick={continueAfterUnlock}
                className="btn-primary mt-8 self-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
              >
                {index + 1 >= quizQuestions.length ? 'Open the Surprise' : 'Next Memory'}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key={`q-${question.id}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="flex flex-1 flex-col justify-center"
            >
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-rose-muted">
                Question {index + 1} of {quizQuestions.length}
              </p>
              <h3 className="font-display text-2xl leading-snug text-rose-ink sm:text-3xl">
                {question.question}
              </h3>

              <div className="mt-8 flex flex-col gap-3">
                {question.options.map((option, i) => {
                  const isSelected = selected === i;
                  const isWrong = feedback === 'wrong' && isSelected;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleAnswer(i)}
                      className={`rounded-2xl border px-5 py-4 text-left text-base transition ${
                        isWrong
                          ? 'border-soft-rose/60 bg-soft-rose/10 text-soft-rose'
                          : isSelected
                            ? 'border-rose-accent bg-rose-accent/10 text-rose-ink shadow-soft'
                            : 'border-rose-line bg-white/5 text-rose-ink hover:border-rose-accent/40 hover:bg-white/[0.07]'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {feedback === 'wrong' && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-center text-sm text-rose-muted"
                  >
                    Not quite — try again
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/**
 * Line-art emblems, drawn on with a stroke animation.
 * Pick one per question via `memory.emblem`; falls back to the heart.
 */
const EMBLEMS = {
  heart: ['M12 20.4S4.6 15.5 4.6 10.4A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.4 2.8c0 5.1-7.4 10-7.4 10Z'],
  camera: [
    'M4 8.2h3.1L8.7 6h6.6l1.6 2.2H20v10.3H4z',
    'M12 16.5a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Z',
  ],
  plane: ['M21 3 3 10.6l6.4 2.5L12 20.6 21 3Z', 'M9.4 13.1 21 3'],
  bubble: ['M4.6 6.2h14.8v9.1h-8.5L6.7 18.8v-3.5H4.6z', 'M8.6 10.8h6.8'],
  infinity: [
    'M8.4 9.1a3.2 3.2 0 1 0 0 5.8c2.4 0 3.4-5.8 7.2-5.8a2.9 2.9 0 0 1 0 5.8c-3.8 0-4.8-5.8-7.2-5.8Z',
  ],
  cake: [
    'M4.6 19.2h14.8v-5H4.6z',
    'M6.6 14.2v-2.4h10.8v2.4',
    'M12 11.6V8.4',
    'M12 8.2c1.3-1.2.6-2.5 0-3.4-.6.9-1.3 2.2 0 3.4Z',
  ],
  rings: [
    'M9.7 15.6a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
    'M14.3 15.6a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  ],
};

// Each question gets its own backdrop so six unlocks never look like one screen.
const PANELS = [
  { from: '#1A2740', via: '#152238', to: '#2A1F2E', glow: 'rgba(240,217,160,0.30)' },
  { from: '#231F38', via: '#17203A', to: '#2C2030', glow: 'rgba(240,168,184,0.28)' },
  { from: '#152B33', via: '#132234', to: '#241F2F', glow: 'rgba(200,230,220,0.24)' },
  { from: '#251C2E', via: '#181F35', to: '#30222C', glow: 'rgba(240,168,184,0.30)' },
  { from: '#1B2A3E', via: '#141F33', to: '#2A2433', glow: 'rgba(240,217,160,0.26)' },
];

function MemoryVisual({ memory, seed = 0 }) {
  const reduceMotion = useReducedMotion();

  if (memory.photo) {
    return (
      <img
        src={memory.photo}
        alt={memory.title}
        className="h-48 w-full object-cover sm:h-56"
      />
    );
  }

  const panel = PANELS[seed % PANELS.length];
  const paths = EMBLEMS[memory.emblem] ?? EMBLEMS.heart;

  return (
    <div
      className="relative h-44 overflow-hidden sm:h-52"
      style={{
        background: `linear-gradient(135deg, ${panel.from}, ${panel.via} 55%, ${panel.to})`,
      }}
    >
      {/* Two soft lights breathing behind the emblem */}
      {!reduceMotion && (
        <>
          <motion.span
            aria-hidden
            className="absolute -left-8 top-2 h-40 w-40 rounded-full blur-3xl"
            style={{ background: panel.glow }}
            animate={{ x: [0, 28, 6, 0], y: [0, 14, -8, 0], opacity: [0.5, 0.8, 0.45, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            aria-hidden
            className="absolute -bottom-4 -right-10 h-44 w-44 rounded-full blur-3xl"
            style={{ background: 'rgba(240,168,184,0.20)' }}
            animate={{ x: [0, -22, -4, 0], y: [0, -16, 10, 0], opacity: [0.35, 0.65, 0.3, 0.35] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          />
        </>
      )}

      {/* Bloom rings, once, as the memory lands */}
      {!reduceMotion &&
        [0, 0.22, 0.44].map((delay) => (
          <motion.span
            key={delay}
            aria-hidden
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-accent/40"
            initial={{ scale: 0.35, opacity: 0.55 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{ duration: 1.6, delay: 0.2 + delay, ease: 'easeOut' }}
          />
        ))}

      <SparkleField reduceMotion={reduceMotion} seed={seed} />

      {/* The emblem draws itself, then settles into a slow float */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      >
        <motion.svg
          viewBox="0 0 24 24"
          className="h-16 w-16 sm:h-20 sm:w-20"
          fill="none"
          stroke="#E0C48A"
          strokeWidth={1.1}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 10px rgba(240,217,160,0.35))' }}
          initial={{ scale: 0.86, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          aria-hidden
        >
          {paths.map((d, i) => (
            <motion.path
              key={d}
              d={d}
              initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.25 + i * 0.28, ease: 'easeInOut' }}
            />
          ))}
        </motion.svg>
      </motion.div>
    </div>
  );
}

/** Sparkles drifting up inside the card. */
function SparkleField({ reduceMotion, seed }) {
  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 12 }, (_, i) => {
        const size = 4 + ((i + seed) % 4) * 2;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#F0D9A0]"
            style={{
              left: `${((i * 23 + seed * 11) % 92) + 3}%`,
              bottom: -8,
              width: size,
              height: size,
              filter: 'blur(0.4px)',
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [-4, -170 - (i % 4) * 20],
              x: [0, i % 2 === 0 ? 16 : -14, 0],
              opacity: [0, 0.85, 0],
              scale: [0.6, 1.1, 0.5],
            }}
            transition={{
              duration: 5 + (i % 5) * 0.9,
              delay: (i % 6) * 0.55,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}

/** The memory note arrives a word at a time, like it's being said out loud. */
function RevealText({ text }) {
  const reduceMotion = useReducedMotion();
  const words = text.split(' ');

  if (reduceMotion) {
    return <p className="mt-2 text-sm leading-relaxed text-rose-muted">{text}</p>;
  }

  return (
    <p className="mt-2 text-sm leading-relaxed text-rose-muted">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.5 + i * 0.045 }}
        >
          {word}{i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </p>
  );
}
