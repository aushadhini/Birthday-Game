import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ConstellationBook from './ConstellationBook';
import { TOTAL_COLLECTIBLES } from '../hooks/useCollectibles';
import { ageTurning } from '../data/birthdayMath';
import { ANCHOR, collectibleSize, computeQuestLayout, questAnchor } from '../data/collectibleLayout';

const EMPTY_LAYOUT = { fieldHeight: null, cardTop: null, itemSize: 44, anchor: null, slots: [] };

const sameLayout = (a, b) =>
  a.fieldHeight === b.fieldHeight &&
  a.cardTop === b.cardTop &&
  a.itemSize === b.itemSize &&
  a.anchor === b.anchor &&
  a.slots.length === b.slots.length &&
  a.slots.every((slot, i) => slot.x === b.slots[i].x && slot.y === b.slots[i].y);

const viewportAnchor = () =>
  typeof window === 'undefined' ? ANCHOR.CENTER : questAnchor(window.innerWidth, window.innerHeight);

/**
 * Level 1 — the bubble hunt. No quiz here: the only interaction on this screen
 * is popping the 29 floating bubbles (rendered by LoveNotesButton).
 *
 * Two shapes, because they want opposite things. On a desktop the quest card
 * sits in the middle and the bubbles fill the sky around it. On a phone that
 * card would eat the screen and push the hunt into two cramped strips, so the
 * card becomes a slim HUD bar at the top — progress always visible, the detail
 * behind a tap — and the whole rest of the screen is open air with no scrolling.
 *
 * Either way this screen owns the playing field: it measures the card, and
 * hands the resulting keep-out layout up to App, which passes it to
 * LoveNotesButton. The bubbles are portalled into the field below and placed
 * around the card, never on it.
 */
export default function QuestScreen({
  collectedCount = 0,
  collectedIds = [],
  onUnlock,
  onField,
  letterOpen = false,
}) {
  const totalCollectibles = TOTAL_COLLECTIBLES;
  const isComplete = collectedCount >= totalCollectibles;
  // The bubble count happens to equal the birthday age — say so when it does
  const onePerYear = ageTurning() === totalCollectibles;

  const fieldRef = useRef(null);
  const cardRef = useRef(null);
  // Decided before the first paint, so the element we measure is already the
  // right one — measuring the big card and then swapping in the bar would lay
  // every bubble out against a box that no longer exists.
  const [anchor, setAnchor] = useState(viewportAnchor);
  const [layout, setLayout] = useState(EMPTY_LAYOUT);
  const [detailOpen, setDetailOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const compact = anchor === ANCHOR.TOP;

  // Fire only on the pop that finishes the heart — count going 28 → 29. A page
  // reload restores the saved progress as 0 → 29 in one step, which is a
  // restore, not an achievement, and must not set the fireworks off.
  const previousCount = useRef(collectedCount);
  useEffect(() => {
    if (collectedCount === totalCollectibles && previousCount.current === totalCollectibles - 1) {
      setCelebrate(true);
    }
    previousCount.current = collectedCount;
  }, [collectedCount, totalCollectibles]);

  const measure = useCallback(() => {
    const field = fieldRef.current;
    const card = cardRef.current;
    if (!field || !card) return;
    const nextAnchor = viewportAnchor();
    if (nextAnchor !== anchor) {
      // Swap the card first; the re-render re-runs this against the new box.
      setAnchor(nextAnchor);
      return;
    }
    // offsetWidth/Height, not getBoundingClientRect: the card enters with a
    // `scale` transform, and a rect measured mid-animation reports it ~5%
    // smaller than it settles at — which is enough to park a row of bubbles on
    // its bottom edge.
    const next = computeQuestLayout({
      fieldWidth: field.clientWidth,
      viewportHeight: window.innerHeight,
      cardWidth: card.offsetWidth,
      cardHeight: card.offsetHeight,
      itemSize: collectibleSize(window.innerWidth, window.innerHeight),
      count: totalCollectibles,
      anchor: nextAnchor,
    });
    // The field's own height is an *output*, never an input — so re-measuring
    // after we grow it settles instead of looping.
    setLayout((prev) => (sameLayout(prev, next) ? prev : next));
  }, [anchor, totalCollectibles]);

  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (fieldRef.current) observer.observe(fieldRef.current);
    if (cardRef.current) observer.observe(cardRef.current);
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, [measure]);

  useEffect(() => {
    if (!layout.slots.length) return;
    onField?.({ node: fieldRef.current, slots: layout.slots, itemSize: layout.itemSize });
  }, [onField, layout]);

  // Leaving Level 1 takes the bubbles with it
  useEffect(() => () => onField?.(null), [onField]);

  // Only the desktop layout ever outgrows the screen; say so when it does, or
  // the bubbles past the fold look like they were never there.
  const scrollHunt = Boolean(
    layout.fieldHeight && layout.fieldHeight > (typeof window === 'undefined' ? 0 : window.innerHeight) + 40,
  );

  const perYear = onePerYear ? ' — one for every year of your life' : '';
  let questCopy;
  if (isComplete) {
    questCopy = onePerYear
      ? `All ${totalCollectibles} stars are lit — one for every year of you. The whole letter is yours, and Level 2 is open.`
      : 'Every star is lit and the whole letter is yours. The path to Level 2 is open.';
  } else if (scrollHunt) {
    questCopy = `Scroll the night sky above and below this card to find ${totalCollectibles} floating bubbles${perYear}. Each one lights a star and reveals a handwritten page of your letter.`;
  } else {
    questCopy = `Search the night sky for ${totalCollectibles} floating bubbles${perYear}. Each one lights a star and reveals a handwritten page of your letter.`;
  }

  // Until the first measurement the card is centred by flexbox; after it, the
  // field owns every coordinate in the level. Centring the card in CSS *and*
  // assuming that centre in JS is what put bubbles on the card's bottom edge —
  // 100dvh and window.innerHeight don't always agree.
  const settled = layout.fieldHeight !== null;
  const progress = `${(collectedCount / totalCollectibles) * 100}%`;

  const progressBar = (
    <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-[#A8894E] via-[#F0D9A0] to-[#C9A86C]"
        animate={{ width: progress }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ boxShadow: '0 0 10px rgba(201,168,108,0.55)' }}
      />
    </div>
  );

  const unlockButton = (
    <button type="button" onClick={onUnlock} className="btn-primary group gap-2">
      <span>Begin the Memory Challenge</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4 transition-transform group-hover:translate-x-1">
        <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  return (
    <section
      ref={fieldRef}
      className={`relative w-full overflow-hidden ${
        settled ? 'block' : 'flex min-h-dvh flex-col items-center justify-center'
      }`}
      style={settled ? { height: layout.fieldHeight } : undefined}
    >
      {/* Background glow overlay */}
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />

      {/* PHONE: the constellation lives in the sky itself rather than behind a
          tap — barely there, but every pop lights one more of its stars, so the
          heart quietly draws itself behind the hunt. */}
      {compact && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-8 opacity-[0.35]"
          aria-hidden
        >
          <div className="w-[min(86vw,22rem)]">
            <ConstellationBook total={totalCollectibles} collectedIds={collectedIds} showHeader={false} />
          </div>
        </div>
      )}

      <div
        className={`z-10 ${
          compact ? 'w-[calc(100%-1.25rem)]' : 'w-[calc(100%-2rem)] max-w-[19rem] sm:max-w-md'
        } ${settled ? 'absolute left-1/2 -translate-x-1/2' : 'relative'}`}
        style={settled ? { top: layout.cardTop } : undefined}
      >
        {compact ? (
          /* ─── PHONE: slim HUD bar, so the sky below it stays empty ─── */
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="panel-glass edge-gold relative rounded-2xl px-3.5 py-2.5"
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[9px] uppercase tracking-[0.24em] text-rose-accent">
                  Level 1 · Storybook Quest
                </p>
                <p className="truncate font-display text-[15px] leading-tight text-rose-ink">
                  {isComplete ? <span className="text-foil">The Letter is Complete</span> : 'Gathering Your Letters'}
                </p>
              </div>

              <span className="tabular shrink-0 text-sm font-medium text-rose-accent">
                {collectedCount}
                <span className="text-rose-muted">/{totalCollectibles}</span>
              </span>

              <button
                type="button"
                onClick={() => setDetailOpen(true)}
                aria-label="Quest details and constellation"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rose-line text-rose-accent transition hover:border-rose-accent"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="mt-2.5">{progressBar}</div>

            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex justify-center pt-3">{unlockButton}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ─── DESKTOP: the full card, bubbles in the sky around it ─── */
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="panel-glass edge-gold relative rounded-3xl p-7 text-center"
          >
            <header className="mb-5">
              <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-rose-accent">
                Level 1 · The Storybook Quest
              </p>
              <h2 className="font-display text-3xl text-rose-ink">
                {isComplete ? <span className="text-foil">The Letter is Complete</span> : 'Gathering Your Letters'}
              </h2>
              <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-rose-accent to-transparent" />
            </header>

            <p className="mx-auto mb-6 max-w-xs text-sm leading-relaxed text-rose-muted">{questCopy}</p>

            <div className="mx-auto mb-6 max-w-xs">
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-rose-muted">
                <span>Collected</span>
                <span className="tabular font-medium text-rose-accent">
                  {collectedCount} / {totalCollectibles}
                </span>
              </div>
              {progressBar}
            </div>

            {/* The 29 bubbles are 29 stars — the heart draws itself as they pop */}
            <div className="mx-auto max-w-xs">
              <ConstellationBook total={totalCollectibles} collectedIds={collectedIds} />
            </div>

            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-6"
                >
                  {unlockButton}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nudge towards the bubbles that live past the fold */}
            {scrollHunt && !isComplete && (
              <motion.p
                className="mt-5 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-rose-muted/80"
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span>Scroll to explore the sky</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-3 w-3">
                  <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.p>
            )}
          </motion.div>
        )}
      </div>

      {/* ─── PHONE: the detail the HUD bar doesn't have room for ─── */}
      <AnimatePresence>
        {compact && detailOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.button
              type="button"
              aria-label="Close quest details"
              className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailOpen(false)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              // pb-20: the music and storybook buttons are pinned over the
              // bottom of the screen, so the sheet's own footer has to clear them
              className="panel-glass edge-gold relative w-full rounded-t-3xl px-5 pb-20 pt-4 text-center"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 260 }}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />

              <p className="text-[10px] uppercase tracking-[0.28em] text-rose-accent">
                Level 1 · The Storybook Quest
              </p>
              <h2 className="mt-1 font-display text-2xl text-rose-ink">
                {isComplete ? <span className="text-foil">The Letter is Complete</span> : 'Gathering Your Letters'}
              </h2>

              <p className="mx-auto mt-3 max-w-xs text-[13px] leading-relaxed text-rose-muted">{questCopy}</p>

              <div className="mx-auto mt-5 max-w-[15rem]">
                <ConstellationBook total={totalCollectibles} collectedIds={collectedIds} />
              </div>

              <button
                type="button"
                onClick={() => setDetailOpen(false)}
                className="mt-6 text-[11px] uppercase tracking-[0.2em] text-rose-muted transition hover:text-rose-ink"
              >
                Back to the hunt
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── PHONE: the heart, finished, front and centre ───
          Held back while the 29th love letter is open — the celebration is the
          reward for closing it, not something stacked on top of it. */}
      <AnimatePresence>
        {compact && celebrate && !letterOpen && (
          <div className="fixed inset-0 z-[55] flex items-center justify-center p-5">
            <motion.button
              type="button"
              aria-label="Close"
              className="absolute inset-0 bg-[#0B1220]/88 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCelebrate(false)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              className="panel-glass edge-gold relative max-h-[92dvh] w-full max-w-sm overflow-y-auto rounded-3xl px-5 py-7 text-center"
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-rose-accent">
                All {totalCollectibles} stars are lit
              </p>
              <h2 className="mt-1.5 font-display text-3xl">
                <span className="text-foil">Your Heart is Complete</span>
              </h2>

              <div className="relative mx-auto mt-4 w-[min(15rem,46vh)]">
                {/* Slow bloom behind the constellation */}
                <motion.div
                  className="pointer-events-none absolute inset-0 -m-6 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(240,217,160,0.28) 0%, rgba(240,168,184,0.14) 45%, transparent 70%)',
                  }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: [0, 1, 0.75], scale: [0.7, 1.08, 1] }}
                  transition={{ duration: 2.4, ease: 'easeOut', delay: 0.9 }}
                />
                {/* Fresh mount, so the outline redraws itself star by star */}
                <ConstellationBook
                  total={totalCollectibles}
                  collectedIds={collectedIds}
                  showHeader={false}
                  drawStep={0.055}
                />
              </div>

              <motion.p
                className="mx-auto mt-4 max-w-xs text-[13px] leading-relaxed text-rose-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {onePerYear
                  ? `One star for every year of you — and every page of the letter is yours now.`
                  : 'Every star is lit, and every page of the letter is yours now.'}
              </motion.p>

              <motion.div
                className="mt-6 flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.6 }}
              >
                {unlockButton}
                <button
                  type="button"
                  onClick={() => setCelebrate(false)}
                  className="text-[11px] uppercase tracking-[0.2em] text-rose-muted transition hover:text-rose-ink"
                >
                  Stay here a moment
                </button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
