import { AnimatePresence, motion } from 'framer-motion';
import { CollectibleIcon } from './LoveNotesButton';
import { TOTAL_COLLECTIBLES } from '../hooks/useCollectibles';

/**
 * Level 1 — the object hunt. No quiz here: the only interaction on this
 * screen is clicking the 29 floating collectibles (rendered by LoveNotesButton).
 * This card stays deliberately narrow so the objects around it stay clickable.
 */
export default function QuestScreen({ collectedCount = 0, collectedIds = [], onUnlock }) {
  const totalCollectibles = TOTAL_COLLECTIBLES;
  const isComplete = collectedCount >= totalCollectibles;

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-8">
      {/* Background glow overlay */}
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />

      {/* Main Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-sm rounded-3xl border border-[#D4AF37]/30 bg-[#0B1D3A]/75 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl text-center sm:max-w-md sm:p-7"
      >
        <header className="mb-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Level 1 · The Storybook Quest</p>
          <h2 className="font-display text-2xl text-[#FFF8E7] sm:text-3xl">
            {isComplete ? '✨ The Letter is Complete ✨' : 'Gathering Your Letters'}
          </h2>
          <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37] to-[#D4AF37]/20" />
        </header>

        {/* Quest Instruction Description */}
        <p className="mx-auto mb-6 max-w-xs text-sm leading-relaxed text-[#FFF8E7]/75">
          {isComplete
            ? 'You have collected all 29 magical objects and unlocked my entire birthday letter! The path to Level 2 is open.'
            : 'Search the night sky around this card for the 29 floating magical objects. Each one reveals a new handwritten page of your birthday letter.'}
        </p>

        {/* Progress Bar and Indicator */}
        <div className="mx-auto mb-6 max-w-xs">
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wider text-[#FFF8E7]/70">
            <span>Collected</span>
            <span className="font-bold text-[#D4AF37]">{collectedCount} / {totalCollectibles}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 p-[1px]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF8E7] to-[#D4AF37]"
              animate={{ width: `${(collectedCount / totalCollectibles) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                boxShadow: '0 0 10px rgba(212,175,55,0.5)'
              }}
            />
          </div>
        </div>

        {/* Compact sticker book — every one of the 29 items */}
        <div className="mx-auto max-w-xs">
          <p className="mb-2 text-left text-[10px] uppercase tracking-wider text-[#FFF8E7]/50">Your Sticker Book</p>
          <div className="grid grid-cols-10 justify-items-center gap-1">
            {[...Array(totalCollectibles)].map((_, index) => {
              const id = index + 1;
              const isFound = collectedIds.includes(id);

              return (
                <div
                  key={id}
                  className={`relative flex h-6 w-6 items-center justify-center rounded-md border transition-all duration-300 ${
                    isFound
                      ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#D4AF37]'
                      : 'border-white/5 bg-white/[0.02]'
                  }`}
                  title={isFound ? `Unlocked Item #${id}` : `Locked Item #${id}`}
                >
                  {isFound ? (
                    <CollectibleIcon id={id} className="h-4 w-4" />
                  ) : (
                    <span className="font-mono text-[8px] text-[#FFF8E7]/25">{id}</span>
                  )}
                </div>
              );
            })}
          </div>
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
              <button
                type="button"
                onClick={onUnlock}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF8E7] to-[#D4AF37] px-7 py-3 text-sm font-bold uppercase tracking-wider text-[#0B1D3A] shadow-[0_0_30px_rgba(212,175,55,0.5)] transition duration-300 hover:scale-105"
              >
                <span>Begin Memory Challenge</span>
                <span className="transition-transform group-hover:translate-x-1">🗝️</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
