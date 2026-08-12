import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FloatingDecorations from './FloatingDecorations';
import MusicPlayer from './MusicPlayer';
import CandleBlowOut from './CandleBlowOut';
import { siteConfig } from '../data/config';

const WISH_BANNER_MS = 7000;

/**
 * Level 3 — Birthday Surprise finale with cake, fireworks, confetti & message.
 */
export default function FinalSurprise({ onReplay }) {
  const [burstKey, setBurstKey] = useState(0);
  // The words the whole game has been walking towards. Held back until the last
  // flame is out, so blowing the candles has a payoff — the letter below stays
  // readable the whole time either way, so nothing is ever locked behind it.
  const [wishBanner, setWishBanner] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setBurstKey((k) => k + 1), 2800);
    return () => clearInterval(id);
  }, []);

  const handleAllOut = useCallback(() => {
    setWishBanner(true);
    setBurstKey((k) => k + 1);
  }, []);

  // It bows out on its own — nobody should have to dismiss a birthday wish
  useEffect(() => {
    if (!wishBanner) return undefined;
    const id = setTimeout(() => setWishBanner(false), WISH_BANNER_MS);
    return () => clearTimeout(id);
  }, [wishBanner]);

  const confetti = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: `${(i * 13) % 100}%`,
        delay: (i % 10) * 0.18,
        color: ['#C9A86C', '#E0C48A', '#F0D9A0', '#F0A8B8', '#FFFFFF'][i % 5],
        size: 5 + (i % 4) * 2,
        duration: 3.5 + (i % 5) * 0.4,
      })),
    [],
  );

  const fireworks = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 10 + i * 11,
        y: 12 + (i % 4) * 10,
        delay: i * 0.28,
        radius: 36 + (i % 3) * 14,
      })),
    [],
  );

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1A2740_0%,#0F1A2E_45%,#0B1220_100%)]" />
      <FloatingDecorations density="dense" />

      {/* Confetti rain */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {confetti.map((piece) => (
          <motion.span
            key={`${burstKey}-${piece.id}`}
            className="absolute top-[-5%] rounded-sm"
            style={{
              left: piece.left,
              width: piece.size,
              height: piece.size * 1.4,
              backgroundColor: piece.color,
            }}
            initial={{ y: 0, rotate: 0, opacity: 0 }}
            animate={{
              y: '110vh',
              rotate: 360,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Firework bursts */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {fireworks.map((fw) => (
          <Firework
            key={`${burstKey}-fw-${fw.id}`}
            x={fw.x}
            y={fw.y}
            delay={fw.delay}
            radius={fw.radius}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        {/* The cake — the candles can be blown out with real breath */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 w-full max-w-md"
        >
          <CandleBlowOut onAllOut={handleAllOut} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="panel-glass edge-gold rounded-3xl px-6 py-8 text-left sm:px-10 sm:py-10"
        >
          <h2 className="font-display text-center text-3xl leading-tight sm:text-4xl">
            <span className="text-foil">Happy Birthday, My Love</span>
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-rose-muted sm:text-base">
            <p>
              I hope your birthday is filled with happiness, love, success, and everything you
              dream of.
            </p>
            <p>
              Thank you for being my best friend, my biggest support, and the person who makes my
              life happier.
            </p>
            <p>I am so lucky to have you.</p>
            <p className="font-display text-xl text-soft-rose">I love you always</p>
          </div>

          <p className="mt-8 border-t border-rose-line pt-6 text-center text-xs leading-relaxed text-rose-muted/80 sm:text-sm">
            P.S. This is your last birthday as my fiancé. Next year, I will celebrate your birthday
            as your wife.
          </p>
        </motion.div>

        <div className="mt-8 flex w-full max-w-xs flex-col items-center gap-4">
          <MusicPlayer compact />
          <button
            type="button"
            onClick={onReplay}
            className="rounded-full border border-rose-accent/30 px-6 py-2.5 text-sm tracking-[0.06em] text-rose-muted transition hover:border-rose-accent hover:text-rose-ink"
          >
            Play it again
          </button>
        </div>
      </div>

      {/* ─── THE WISH — the moment the last flame goes out ─── */}
      <AnimatePresence>
        {wishBanner && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Dark enough to hush the letter behind it — it carries the same
                words, and two of them at once reads as a printing error — but
                still thin enough for the fireworks to flash through */}
            <button
              type="button"
              aria-label="Continue"
              className="absolute inset-0 bg-[#0B1220]/88 backdrop-blur-[7px]"
              onClick={() => setWishBanner(false)}
            />

            <div className="pointer-events-none relative text-center">
              <motion.p
                className="text-[11px] uppercase tracking-[0.32em] text-rose-accent sm:text-xs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7 }}
              >
                Every candle out · Every wish yours
              </motion.p>

              <motion.h2
                className="mt-4 font-display text-4xl leading-tight sm:text-6xl"
                initial={{ opacity: 0, scale: 0.88, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-foil">Happy Birthday,</span>
                <br />
                <span className="text-foil">My Love</span>
              </motion.h2>

              <motion.div
                className="mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-rose-accent to-transparent"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '11rem', opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />

              <motion.p
                className="mt-5 font-display text-xl text-soft-rose sm:text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.9 }}
              >
                {siteConfig.recipientName}
              </motion.p>

              <motion.p
                className="mt-8 text-[10px] uppercase tracking-[0.22em] text-rose-muted/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0.5, 0.9] }}
                transition={{ delay: 2.4, duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                Tap anywhere to read your letter
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Firework({ x, y, delay, radius = 42 }) {
  const golds = ['#F0D9A0', '#E0C48A', '#C9A86C', '#FFECB8', '#A8894E'];
  const sparks = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    return {
      id: i,
      dx: Math.cos(angle) * radius,
      dy: Math.sin(angle) * radius,
      color: golds[i % golds.length],
    };
  });

  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      {/* Center flash */}
      <motion.span
        className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F0D9A0]"
        style={{ boxShadow: '0 0 24px 8px rgba(240, 217, 160, 0.7)' }}
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: [0, 1, 0], scale: [0.2, 1.8, 0] }}
        transition={{ duration: 0.9, delay, ease: 'easeOut' }}
      />
      {sparks.map((spark) => (
        <motion.span
          key={spark.id}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: spark.color,
            boxShadow: `0 0 8px 2px ${spark.color}`,
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{
            x: spark.dx,
            y: spark.dy,
            opacity: [0, 1, 0.6, 0],
            scale: [0.4, 1.3, 0.3],
          }}
          transition={{ duration: 1.35, delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
