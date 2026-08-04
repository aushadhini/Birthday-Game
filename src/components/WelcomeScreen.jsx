import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Countdown from './Countdown';
import MusicPlayer from './MusicPlayer';
import FloatingDecorations from './FloatingDecorations';
import TimeTogether from './TimeTogether';
import { emojiActions } from '../data/emojiActions';
import { siteConfig } from '../data/config';
import { palette } from '../data/theme';
import { birthdayLabel } from '../data/birthdayMath';

/**
 * Landing experience after password unlock.
 * Brand-first hero with countdown, music, and entry into the quest.
 */
export default function WelcomeScreen({ onStart, onOpenGallery }) {
  // The hidden letter has two triggers: typing the name (needs a keyboard) and
  // long-pressing the corner ✦ (works anywhere). Point at the one that exists
  // on this device — a phone has no keyboard on this screen.
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');
    setIsTouch(query.matches);
    const onChange = (event) => setIsTouch(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const canType = Boolean(siteConfig.secretPhrase) && !isTouch;

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
          className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-rose-accent"
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-rose-accent/70" />
          A private birthday experience
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-rose-accent/70" />
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-[clamp(2.4rem,8vw,4.5rem)] leading-[1.02] text-rose-ink"
        >
          <span className="block text-[0.46em] italic tracking-wide text-rose-muted">
            {siteConfig.heroGreeting}
          </span>
          <span className="text-foil block">{siteConfig.heroTitle}</span>
        </motion.h1>

        {/* Name and date, set like an engraving under the headline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-5 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em] text-rose-accent"
        >
          <span>{siteConfig.recipientName}</span>
          <BirthdayCake />
          <span>{birthdayLabel()}</span>
        </motion.div>

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
          <TimeTogether />
          <MusicPlayer />

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <button type="button" onClick={onStart} className="btn-primary group gap-2">
              Begin the Quest
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" onClick={onOpenGallery} className="btn-ghost gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-4 w-4">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="10" r="1.6" />
                <path d="M3 16l5-4 4 3 3-2 6 5" strokeLinecap="round" />
              </svg>
              {emojiActions.memories.label}
            </button>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 space-y-1.5 pb-6 text-center">
        <p className="text-[11px] tracking-wide text-rose-muted/70">
          Find the 29 floating objects to light your constellation and unlock my letter
        </p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-rose-muted/45">
          {canType
            ? `psst — one thing is hidden. ${siteConfig.secretHint}.`
            : 'psst — one thing is hidden. hold the ✦ in the top corner.'}
        </p>
      </div>
    </section>
  );
}

/**
 * Two-tier cake in gold line, sized for the engraved name/date row.
 * Drawn rather than an emoji so it inherits the palette instead of fighting it
 * — and the single flame actually flickers.
 */
function BirthdayCake() {
  const gold = palette.gold;

  return (
    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" className="h-full w-full overflow-visible">
        {/* Flame glow + flicker */}
        <motion.g
          animate={{ scaleY: [1, 1.22, 0.94, 1], scaleX: [1, 0.92, 1.06, 1], y: [0, -0.4, 0.2, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '12px 7.6px' }}
        >
          <circle cx="12" cy="5.6" r="2.6" fill="#FFD27A" opacity="0.22" />
          <path
            d="M12 3.4c1.5 1.6 1.3 3.1 0 4.2-1.3-1.1-1.5-2.6 0-4.2Z"
            fill="#FFD27A"
          />
        </motion.g>

        {/* Candle */}
        <path d="M12 7.8v2.4" stroke={palette.rose} strokeWidth="1.5" strokeLinecap="round" />

        {/* Top tier + icing drip */}
        <path
          d="M8 14.4v-3.1c0-.5.4-.9.9-.9h6.2c.5 0 .9.4.9.9v3.1"
          stroke={gold}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M8 11.9q1.35 1.2 2.7 0q1.35 1.2 2.7 0q1.35 1.2 2.6 0"
          stroke={palette.goldGlow}
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Bottom tier + icing drip */}
        <path
          d="M4.8 20.2v-4.9c0-.5.4-.9.9-.9h12.6c.5 0 .9.4.9.9v4.9"
          stroke={gold}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M4.8 16.1q1.7 1.3 3.4 0q1.7 1.3 3.4 0q1.7 1.3 3.4 0q1.6 1.3 3.2 0"
          stroke={palette.goldGlow}
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Plate */}
        <path d="M3.2 20.4h17.6" stroke={gold} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </span>
  );
}
