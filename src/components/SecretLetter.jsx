import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { siteConfig } from '../data/config';
import { palette } from '../data/theme';

/**
 * The hidden one.
 *
 * Type their name anywhere in the game (or long-press the ✦ in the corner on a
 * phone) and a wax-sealed letter cracks open. Being found is remembered in
 * localStorage, but only to make a plain tap enough to re-read it — the ✦ itself
 * never changes, so the secret stays a secret.
 */
const STORAGE_KEY = 'birthday_secret_letter_found_v1';
const LONG_PRESS_MS = 700;

export default function SecretLetter() {
  const phrase = (siteConfig.secretPhrase || siteConfig.recipientName || '').toLowerCase();
  const [open, setOpen] = useState(false);
  const [found, setFound] = useState(false);
  const [sealBroken, setSealBroken] = useState(false);
  const [nudge, setNudge] = useState(false);
  const bufferRef = useRef('');
  const pressTimer = useRef(null);
  const nudgeTimer = useRef(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'true') setFound(true);
    } catch {
      /* private mode — the easter egg just stays re-findable */
    }
  }, []);

  const reveal = useCallback(() => {
    setOpen(true);
    setSealBroken(false);
    setFound(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      /* ignore */
    }
    if (navigator.vibrate) navigator.vibrate([12, 60, 24]);
  }, []);

  // Keyboard trigger — type the phrase anywhere
  useEffect(() => {
    if (!phrase) return;

    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      // Don't listen while they're typing in a field (e.g. the password gate)
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key.length !== 1) return;

      bufferRef.current = (bufferRef.current + event.key.toLowerCase()).slice(-phrase.length);
      if (bufferRef.current === phrase) {
        bufferRef.current = '';
        reveal();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phrase, reveal]);

  const startPress = () => {
    setNudge(false);
    pressTimer.current = setTimeout(reveal, LONG_PRESS_MS);
  };
  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = null;
  };

  /**
   * A quick tap is the natural first attempt, and it used to do nothing at all
   * — which reads as a broken button. Teach the gesture instead of failing.
   */
  const handleClick = () => {
    if (found) {
      setOpen(true);
      return;
    }
    setNudge(true);
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    nudgeTimer.current = setTimeout(() => setNudge(false), 2200);
  };

  useEffect(
    () => () => {
      cancelPress();
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    },
    [],
  );

  return (
    <>
      {/* Long-press target for phones — a quiet ✦ in the top-left corner.
          Turns into a gold wax seal once the letter has been found. */}
      <button
        type="button"
        onPointerDown={startPress}
        onPointerUp={cancelPress}
        onPointerLeave={cancelPress}
        onContextMenu={(e) => e.preventDefault()}
        onClick={handleClick}
        aria-label={found ? 'Re-read the secret letter' : 'A hidden corner — press and hold it'}
        className="fixed left-4 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-transparent transition sm:left-6 sm:top-6"
      >
        {/* Always the same faint gold breath — never a lit-up seal. Finding it
            once used to turn it into a bordered gold badge, which handed the
            secret away on every screen from then on. It stays a secret: the
            same barely-there ✦, which opens on a tap once it's been found. */}
        <motion.span
          className="select-none text-sm"
          style={{ color: palette.gold }}
          animate={{ opacity: [0.28, 0.6, 0.28] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          ✦
        </motion.span>

        {/* Tap feedback: tells you it wants a long press, without saying why */}
        <AnimatePresence>
          {nudge && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em]"
              style={{
                borderColor: `${palette.gold}66`,
                background: 'rgba(11,18,32,0.92)',
                color: palette.goldGlow,
              }}
            >
              hold, don&apos;t tap
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overscroll-contain p-4">
            <motion.button
              type="button"
              aria-label="Close the letter"
              className="absolute inset-0 bg-[#050A14]/90 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="A secret letter"
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl edge-gold"
              style={{
                background:
                  'linear-gradient(160deg, #FFF9EC 0%, #FBF1DC 55%, #F3E4C8 100%)',
              }}
              initial={{ opacity: 0, y: 40, scale: 0.92, rotateX: -8 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 24, stiffness: 210 }}
            >
              <div className="relative p-7 sm:p-9">
                {/* Wax seal — click to break it open */}
                <div className="mb-5 flex justify-center">
                  <motion.button
                    type="button"
                    onClick={() => setSealBroken(true)}
                    aria-label={sealBroken ? 'Seal broken' : 'Break the wax seal'}
                    className="relative h-16 w-16 cursor-pointer"
                    animate={
                      sealBroken
                        ? { scale: [1, 1.15, 0.9], opacity: 0, rotate: 18 }
                        : { scale: [1, 1.04, 1] }
                    }
                    transition={
                      sealBroken
                        ? { duration: 0.5, ease: 'easeOut' }
                        : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                    }
                    style={{ display: sealBroken ? 'none' : 'block' }}
                  >
                    <svg viewBox="0 0 64 64" className="h-full w-full">
                      <circle cx="32" cy="32" r="26" fill={palette.roseDeep} />
                      <circle cx="32" cy="32" r="26" fill="none" stroke={palette.gold} strokeWidth="1.5" />
                      <circle cx="32" cy="32" r="19" fill="none" stroke={palette.goldGlow} strokeWidth="0.8" opacity="0.7" />
                      <path
                        d="M32 43s-9-6-11.4-10.6C18.4 28.2 20 24 24.4 24c2.3 0 4.1 1.3 5.2 2.9 1.1-1.6 2.9-2.9 5.2-2.9 4.4 0 6 4.2 3.8 8.4C36.2 37 32 43 32 43Z"
                        fill={palette.goldGlow}
                        opacity="0.9"
                      />
                    </svg>
                  </motion.button>

                  {sealBroken && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] uppercase tracking-[0.3em] text-[#A8894E]"
                    >
                      Sealed for you only
                    </motion.p>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {sealBroken ? (
                    <motion.div
                      key="letter"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                      className="text-[#1A2233]"
                    >
                      <h3 className="font-display text-center text-2xl italic text-[#A8894E]">
                        {siteConfig.secretLetterTitle}
                      </h3>
                      <div className="mt-5 space-y-4 font-display text-lg leading-relaxed text-[#1A2233]/90">
                        {siteConfig.secretLetterBody.map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                      <p className="mt-6 text-right font-display text-base italic text-[#A8894E]">
                        — {siteConfig.creatorName}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="prompt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-sm leading-relaxed text-[#1A2233]/70"
                    >
                      You found the hidden letter.
                      <br />
                      Break the seal.
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="mt-7 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-[#1A2233]/20 px-5 py-2 text-[11px] uppercase tracking-[0.18em] text-[#1A2233]/60 transition hover:bg-[#1A2233]/5 hover:text-[#1A2233]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
