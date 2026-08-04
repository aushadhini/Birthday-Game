import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

    if (optionIndex === question.correctIndex) {
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
              <p className="mb-4 text-center text-sm font-medium tracking-wide text-rose-accent">
                Correct — memory unlocked
              </p>
              <div className="overflow-hidden rounded-3xl border border-rose-line bg-white/5 shadow-lift backdrop-blur-md">
                <MemoryVisual memory={unlocked} />
                <div className="px-6 py-5">
                  <h3 className="font-display text-2xl text-rose-ink">{unlocked.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-rose-muted">{unlocked.text}</p>
                </div>
              </div>
              <button type="button" onClick={continueAfterUnlock} className="btn-primary mt-8 self-center">
                {index + 1 >= quizQuestions.length ? '🎁 Open the Surprise' : '⭐ Next Memory'}
              </button>
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

function MemoryVisual({ memory }) {
  if (memory.photo) {
    return (
      <img
        src={memory.photo}
        alt={memory.title}
        className="h-48 w-full object-cover sm:h-56"
      />
    );
  }

  return (
    <div className="flex h-44 items-center justify-center bg-gradient-to-br from-[#1A2740] via-[#152238] to-[#2A1F2E] sm:h-52">
      <span className="font-display text-4xl text-rose-accent/70">✦</span>
    </div>
  );
}
