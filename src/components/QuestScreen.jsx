import { AnimatePresence, motion } from 'framer-motion';
import ConstellationBook from './ConstellationBook';
import { TOTAL_COLLECTIBLES } from '../hooks/useCollectibles';
import { ageTurning } from '../data/birthdayMath';

/**
 * Level 1 — the object hunt. No quiz here: the only interaction on this
 * screen is clicking the 29 floating collectibles (rendered by LoveNotesButton).
 * This card stays deliberately narrow so the objects around it stay clickable.
 */
export default function QuestScreen({ collectedCount = 0, collectedIds = [], onUnlock }) {
  const totalCollectibles = TOTAL_COLLECTIBLES;
  const isComplete = collectedCount >= totalCollectibles;
  // The object count happens to equal the birthday age — say so when it does
  const onePerYear = ageTurning() === totalCollectibles;

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-8">
      {/* Background glow overlay */}
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />

      {/* Main Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="panel-glass edge-gold relative z-10 w-full max-w-sm rounded-3xl p-5 text-center sm:max-w-md sm:p-7"
      >
        <header className="mb-5">
          <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-rose-accent">
            Level 1 · The Storybook Quest
          </p>
          <h2 className="font-display text-2xl text-rose-ink sm:text-3xl">
            {isComplete ? <span className="text-foil">The Letter is Complete</span> : 'Gathering Your Letters'}
          </h2>
          <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-rose-accent to-transparent" />
        </header>

        {/* Quest Instruction Description */}
        <p className="mx-auto mb-6 max-w-xs text-sm leading-relaxed text-rose-muted">
          {isComplete
            ? onePerYear
              ? `All ${totalCollectibles} stars are lit — one for every year of you. The whole letter is yours, and Level 2 is open.`
              : 'Every star is lit and the whole letter is yours. The path to Level 2 is open.'
            : `Search the night sky around this card for ${totalCollectibles} floating objects${
                onePerYear ? ' — one for every year of your life' : ''
              }. Each one lights a star and reveals a handwritten page of your letter.`}
        </p>

        {/* Progress Bar and Indicator */}
        <div className="mx-auto mb-6 max-w-xs">
          <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-rose-muted">
            <span>Collected</span>
            <span className="tabular font-medium text-rose-accent">
              {collectedCount} / {totalCollectibles}
            </span>
          </div>
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#A8894E] via-[#F0D9A0] to-[#C9A86C]"
              animate={{ width: `${(collectedCount / totalCollectibles) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ boxShadow: '0 0 10px rgba(201,168,108,0.55)' }}
            />
          </div>
        </div>

        {/* The 29 objects are 29 stars — the heart draws itself as they collect */}
        <div className="mx-auto max-w-xs">
          <ConstellationBook total={totalCollectibles} collectedIds={collectedIds} />
        </div>

        {/* CTA Unlock Button */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-6"
            >
              <button type="button" onClick={onUnlock} className="btn-primary group gap-2">
                <span>Begin the Memory Challenge</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                  <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
