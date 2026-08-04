import { motion } from 'framer-motion';
import Countdown from './Countdown';
import MusicPlayer from './MusicPlayer';
import FloatingDecorations from './FloatingDecorations';
import { emojiActions } from '../data/emojiActions';

/**
 * Landing experience after password unlock.
 * Brand-first hero with countdown, music, and entry into the quest.
 */
export default function WelcomeScreen({ onStart, onOpenGallery }) {
  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden">
      <FloatingDecorations />

      {/* Soft atmospheric wash */}
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-4 text-xs uppercase tracking-[0.35em] text-rose-accent"
        >
          {emojiActions.birthdayCake.emoji} A premium birthday experience
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-[clamp(2.4rem,8vw,4.5rem)] leading-[1.05] text-rose-ink"
        >
          Birthday Quest
          <span className="mt-2 flex items-center justify-center gap-2 text-[0.72em] text-rose-accent">
            for Adeesha
            <BirthdayHeart />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-5 max-w-md text-base leading-relaxed text-rose-muted sm:text-lg"
        >
          Three little levels. One big celebration. Are you ready, Babe?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex w-full flex-col items-center gap-8"
        >
          <Countdown />
          <MusicPlayer />

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <button type="button" onClick={onStart} className="btn-primary">
              {emojiActions.startAdventure.emoji} {emojiActions.startAdventure.label}
            </button>
            <button type="button" onClick={onOpenGallery} className="btn-ghost">
              {emojiActions.memories.emoji} {emojiActions.memories.label}
            </button>
          </div>
        </motion.div>
      </div>

      <p className="relative z-10 pb-6 text-center text-[11px] tracking-wide text-rose-muted/70">
        Find the 29 floating magical objects to unlock my birthday letter 📖✨
      </p>
    </section>
  );
}

/**
 * Soft rose heart with champagne gold shimmer — elegant, not playful.
 */
function BirthdayHeart() {
  return (
    <motion.span
      className="relative inline-flex h-[0.85em] w-[0.95em] items-center justify-center"
      aria-hidden
      animate={{ y: [0, -2, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" fill="none">
        <ellipse cx="24" cy="26" rx="14" ry="12" fill="#F0A8B8" opacity="0.25" />
        <path
          d="M24 40C24 40 8 30 8 19.2C8 13.6 12.2 10 17 10C20.2 10 22.6 11.6 24 13.8C25.4 11.6 27.8 10 31 10C35.8 10 40 13.6 40 19.2C40 30 24 40 24 40Z"
          fill="url(#bhGrad)"
        />
        {/* Champagne highlight */}
        <path
          d="M15 18c2-3 5-4 7-2"
          stroke="#E8D5A8"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.7"
        />
        <defs>
          <linearGradient id="bhGrad" x1="10" y1="12" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFB6C8" />
            <stop offset="0.5" stopColor="#F0A8B8" />
            <stop offset="1" stopColor="#E891A8" />
          </linearGradient>
        </defs>
      </svg>
    </motion.span>
  );
}
