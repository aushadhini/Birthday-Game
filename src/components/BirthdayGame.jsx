import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { loveNotes, loveNoteEmojis } from '../data/levelOneReasons';
import { emojiActions } from '../data/emojiActions';
import FloatingDecorations from './FloatingDecorations';

/**
 * Level 1 — Love Letters
 * Shows one love note at a time with a "Next Reason" button.
 */
export default function BirthdayGame({ onComplete }) {
  const [index, setIndex] = useState(0);
  const note = loveNotes[index];
  const total = loveNotes.length;
  const isLast = index >= total - 1;
  const number = String(index + 1).padStart(2, '0');

  const goNext = () => {
    if (isLast) {
      onComplete?.();
      return;
    }
    setIndex((i) => i + 1);
  };

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden">
      <FloatingDecorations />
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-rose-accent">Level 1</p>
          <h2 className="font-display text-2xl text-rose-ink sm:text-3xl">
            {emojiActions.loveLetters.emoji} {emojiActions.loveLetters.label}
          </h2>
        </div>
        <div className="rounded-full border border-rose-line bg-white/5 px-4 py-2 text-sm text-rose-ink backdrop-blur-sm">
          {index + 1}/{total}
        </div>
      </header>

      {/* Floating uncommon emoji strip */}
      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-wrap items-center justify-center gap-2 px-5 py-2 sm:gap-3">
        {loveNoteEmojis.map((emoji, i) => (
          <motion.span
            key={`${emoji}-${i}`}
            className="text-xl sm:text-2xl"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 2.4 + (i % 4) * 0.35,
              delay: i * 0.12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              filter: i === index % loveNoteEmojis.length
                ? 'drop-shadow(0 0 8px rgba(240,168,184,0.7))'
                : undefined,
              opacity: i === index % loveNoteEmojis.length ? 1 : 0.55,
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-5 pb-14 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.article
            key={note.id}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
            className="w-full rounded-3xl border border-rose-line bg-blush-soft/90 px-6 py-9 text-center shadow-lift backdrop-blur-md sm:px-10 sm:py-11"
          >
            <p className="text-4xl sm:text-5xl">{note.emoji}</p>
            <h3 className="mt-5 font-display text-2xl text-rose-accent sm:text-3xl">
              Love Note #{number}
            </h3>
            <p className="mt-5 font-display text-xl leading-relaxed text-rose-ink sm:text-2xl">
              &ldquo;{note.message}&rdquo;
            </p>
          </motion.article>
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={goNext}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary mt-10"
        >
          {isLast ? '⭐ Continue to Memories' : 'Next Reason ✨'}
        </motion.button>

        {!isLast && (
          <p className="mt-4 text-xs tracking-wide text-rose-muted">
            {total - index - 1} more {total - index - 1 === 1 ? 'note' : 'notes'} waiting…
          </p>
        )}
      </div>
    </section>
  );
}
