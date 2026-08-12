import { motion } from 'framer-motion';

/**
 * Phone-only way out of a level.
 *
 * On a desktop the levels are one long page you can always see the whole of; on
 * a phone the HUD bar is the only chrome, and there was no way back from a level
 * once you were in it. Sits in the top-right corner, opposite the secret ✦, in
 * the strip the quest layout keeps clear above the HUD bar.
 */
export default function BackButton({ onBack, label = 'Back' }) {
  return (
    <motion.button
      type="button"
      onClick={onBack}
      aria-label={label}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="panel-glass fixed right-4 top-4 z-40 flex items-center gap-1.5 rounded-full border border-rose-line px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-rose-muted transition hover:border-rose-accent hover:text-rose-ink"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
        <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </motion.button>
  );
}
