import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { quizQuestions } from '../data/quizQuestions';
import { siteConfig } from '../data/config';

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
  const isOpen = feedback === 'correct' && Boolean(unlocked);
  const isLast = index + 1 >= quizQuestions.length;

  const handleAnswer = (optionIndex) => {
    if (feedback) return;
    setSelected(optionIndex);

    // Reflective questions (`anyAnswer`) accept whatever he picks.
    if (question.anyAnswer || optionIndex === question.correctIndex) {
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

  // A tap on an answer lands exactly where the popup's backdrop is about to
  // appear, and the click the browser fires after the touch then hits that
  // backdrop — dismissing the memory the moment it opened. On the last
  // question that skipped the card entirely and went straight to the surprise.
  // So ignore any dismissal in the first moments after the popup opens.
  const openedAt = useRef(0);

  useEffect(() => {
    if (isOpen) openedAt.current = performance.now();
  }, [isOpen, index]);

  const continueAfterUnlock = () => {
    if (performance.now() - openedAt.current < 550) return;

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

  // Escape moves the popup along without reaching for the button. Enter is left
  // alone — it would fire both this and a click on the focused button.
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape') continueAfterUnlock();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index]);

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />

      <motion.header
        className="relative z-10 px-5 py-5 sm:px-8"
        animate={{
          opacity: isOpen ? 0.45 : 1,
          filter: isOpen ? 'blur(5px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-xs uppercase tracking-[0.25em] text-rose-accent">Level 2</p>
        <h2 className="font-display text-2xl text-rose-ink sm:text-3xl">Memory Challenge</h2>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#C9A86C] to-[#E0C48A]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45 }}
          />
        </div>
      </motion.header>

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pb-10 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`q-${question.id}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{
              opacity: isOpen ? 0.4 : 1,
              x: 0,
              scale: isOpen ? 0.97 : 1,
              filter: isOpen ? 'blur(7px)' : 'blur(0px)',
            }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-1 flex-col justify-center ${isOpen ? 'pointer-events-none' : ''}`}
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
        </AnimatePresence>
      </div>

      {/* The unlocked memory arrives as a popup over the question */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overscroll-contain p-4 sm:p-6">
            <motion.button
              type="button"
              aria-label="Continue"
              className="absolute inset-0 bg-[#050A14]/60 backdrop-blur-[6px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={continueAfterUnlock}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={unlocked.title}
              className="relative z-10 flex max-h-[88dvh] w-full max-w-md flex-col overflow-hidden rounded-3xl backdrop-blur-2xl"
              style={{
                background:
                  'linear-gradient(160deg, rgba(26,36,60,0.88) 0%, rgba(15,23,41,0.92) 55%, rgba(20,20,38,0.94) 100%)',
                boxShadow: [
                  '0 0 0 1px rgba(224,196,138,0.22)',
                  'inset 0 1px 0 rgba(255,255,255,0.10)',
                  '0 40px 90px -25px rgba(0,0,0,0.85)',
                  '0 0 60px -20px rgba(201,168,108,0.45)',
                ].join(', '),
              }}
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 210, damping: 24 }}
            >
              <div className="relative shrink-0">
                <MemoryVisual memory={unlocked} seed={question.id} />
                {/* the art melts into the panel instead of ending on a hard line */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(15,23,41,0.92), rgba(15,23,41,0))',
                  }}
                  aria-hidden
                />
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="font-display text-2xl text-rose-ink"
                >
                  {unlocked.title}
                </motion.h3>
                <RevealText text={unlocked.text} />
              </div>

              <motion.div
                className="shrink-0 px-6 pb-6 pt-2 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button type="button" onClick={continueAfterUnlock} className="btn-primary">
                  {isLast ? 'Open the Surprise' : 'Next Memory'}
                </button>
              </motion.div>

              {/* Gold foil sweeps across once, the way the card catches light */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 35%, rgba(240,217,160,0.16) 50%, transparent 65%)',
                }}
                initial={{ x: '-120%' }}
                animate={{ x: '120%' }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

/**
 * A written-by-hand '/photos/x.jpg' would point at the domain root and 404 on
 * GitHub Pages, where the site sits under /Birthday-Game/. Re-root it on the
 * deployed base so either form works.
 */
const withBase = (path) =>
  path.startsWith('/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path;

// Each question gets its own backdrop so six unlocks never look like one screen.
const PANELS = [
  { from: '#1A2740', via: '#152238', to: '#2A1F2E', glow: 'rgba(240,217,160,0.30)' },
  { from: '#231F38', via: '#17203A', to: '#2C2030', glow: 'rgba(240,168,184,0.28)' },
  { from: '#152B33', via: '#132234', to: '#241F2F', glow: 'rgba(200,230,220,0.24)' },
  { from: '#251C2E', via: '#181F35', to: '#30222C', glow: 'rgba(240,168,184,0.30)' },
  { from: '#1B2A3E', via: '#141F33', to: '#2A2433', glow: 'rgba(240,217,160,0.26)' },
];

function MemoryVisual({ memory, seed = 0 }) {
  const reduceMotion = useReducedMotion();

  if (memory.photo) {
    return (
      <img
        src={withBase(memory.photo)}
        alt={memory.title}
        className="h-48 w-full object-cover sm:h-56"
      />
    );
  }

  const panel = PANELS[seed % PANELS.length];

  return (
    <div
      className="relative h-44 overflow-hidden sm:h-52"
      style={{
        background: `linear-gradient(135deg, ${panel.from}, ${panel.via} 55%, ${panel.to})`,
      }}
    >
      {/* Two soft lights breathing behind us */}
      {!reduceMotion && (
        <>
          <motion.span
            aria-hidden
            className="absolute -left-8 top-2 h-40 w-40 rounded-full blur-3xl"
            style={{ background: panel.glow }}
            animate={{ x: [0, 28, 6, 0], y: [0, 14, -8, 0], opacity: [0.5, 0.8, 0.45, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            aria-hidden
            className="absolute -bottom-4 -right-10 h-44 w-44 rounded-full blur-3xl"
            style={{ background: 'rgba(240,168,184,0.20)' }}
            animate={{ x: [0, -22, -4, 0], y: [0, -16, 10, 0], opacity: [0.35, 0.65, 0.3, 0.35] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          />
        </>
      )}

      {/* Bloom rings, once, as the memory lands */}
      {!reduceMotion &&
        [0, 0.22, 0.44].map((delay) => (
          <motion.span
            key={delay}
            aria-hidden
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-accent/40"
            initial={{ scale: 0.35, opacity: 0.55 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{ duration: 1.6, delay: 0.2 + delay, ease: 'easeOut' }}
          />
        ))}

      <SparkleField reduceMotion={reduceMotion} seed={seed} />

      <CoupleAvatar reduceMotion={reduceMotion} seed={seed} />
    </div>
  );
}

/**
 * The two of us — one scene, not two portraits: he has an arm around her, her
 * head tilted onto his shoulder, a heart floating above.
 *
 * Drop real bitmojis at /public/avatars/ and point siteConfig.avatarHer /
 * avatarHim at them; they show as two overlapping, tilted cut-outs leaning
 * into each other. Set only one (or neither), or let a file 404, and the drawn
 * couple below stands in — so the card never shows a broken image.
 */
function CoupleAvatar({ reduceMotion, seed = 0 }) {
  const [broken, setBroken] = useState([]);

  // The drawing is a single scene, so photos are all-or-nothing: one photo
  // beside one cartoon would look like two different games.
  // Photos cannot be re-posed, so they lean differently instead — the amount
  // and direction shift per memory, matching the drawn poses' variety.
  const lean = 5 + (seed % 3) * 4;
  const flip = seed % 2 === 0 ? 1 : -1;
  const photos = [
    { key: 'her', src: siteConfig.avatarHer, alt: 'Me', tilt: -lean * flip },
    { key: 'him', src: siteConfig.avatarHim, alt: siteConfig.recipientName, tilt: lean * flip },
  ];
  const usePhotos = photos.every((p) => p.src && !broken.includes(p.key));

  const markBroken = (key) =>
    setBroken((prev) => (prev.includes(key) ? prev : [...prev, key]));

  return (
    <motion.div
      className="absolute inset-0 flex items-end justify-center"
      initial={{ opacity: 0, y: 18, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }}
    >
      <motion.div
        className="relative flex h-full w-full items-end justify-center"
        animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        {usePhotos ? (
          <div className="flex h-full items-center justify-center">
            {photos.map(({ key, src, alt, tilt }, i) => (
              <div
                key={key}
                className="h-24 w-24 overflow-hidden rounded-full border border-rose-accent/45 bg-white/[0.06] sm:h-28 sm:w-28"
                style={{
                  transform: `rotate(${tilt}deg)`,
                  marginLeft: i === 1 ? '-1.75rem' : 0,
                  zIndex: i === 1 ? 1 : 2,
                  boxShadow: '0 0 22px rgba(240,217,160,0.25)',
                }}
              >
                <img
                  src={withBase(src)}
                  alt={alt}
                  onError={() => markBroken(key)}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <DrawnCouple reduceMotion={reduceMotion} seed={seed} />
        )}

        {/* A heart beating above the two of them */}
        <motion.span
          aria-hidden
          className="absolute left-1/2 top-3 -translate-x-1/2 text-2xl"
          style={{ filter: 'drop-shadow(0 0 8px rgba(240,168,184,0.6))' }}
          initial={{ opacity: 0, scale: 0.4, y: 8 }}
          animate={
            reduceMotion
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 1, scale: [1, 1.18, 1], y: 0 }
          }
          transition={{
            opacity: { delay: 0.55 },
            y: { delay: 0.55 },
            scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.7 },
          }}
        >
          ❤️
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

// Two palettes, kept apart on purpose — she reads rose and warm, he reads navy.
const HER = {
  skin: '#E8B98F',
  neck: '#D9A87C',
  hair: '#241C2E',
  top: '#C46A80',
  mouth: '#B4635A',
};
const HIM = {
  skin: '#D9A576',
  neck: '#C98F63',
  hair: '#1C1723',
  top: '#33405E',
  mouth: '#8A4E45',
};

/**
 * Her: shorter, long hair, rose top. Head and hair pivot together at the neck,
 * so a lean never opens a seam along the hairline.
 */
function HerBust({ tilt = 0, eyes = 'open', smile = 'soft' }) {
  return (
    <g>
      <path d="M26 132c0-26 16-40 42-40s42 14 42 40z" fill={HER.top} />
      <g transform={`rotate(${tilt} 78 100)`}>
        <path
          d="M52 76c0-25 10-39 26-39s26 14 26 39c0 14-2 34-5 50H57c-3-16-5-36-5-50z"
          fill={HER.hair}
        />
        <rect x="70" y="80" width="16" height="20" rx="8" fill={HER.neck} />
        <ellipse cx="78" cy="70" rx="20" ry="23" fill={HER.skin} />
        {/* side-swept fringe, joined to the crown */}
        <path
          d="M58 70c0-16 9-28 20-28s22 12 22 28c-2-11-8-17-14-18-6 7-18 12-28 18z"
          fill={HER.hair}
        />
        {eyes === 'closed' ? (
          <path
            d="M67 71c1.9 2.8 5.7 2.8 7.6 0M81 71c1.9 2.8 5.7 2.8 7.6 0"
            stroke={HER.hair}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <>
            <circle cx="71" cy="71" r="2.5" fill={HER.hair} />
            <circle cx="85" cy="71" r="2.5" fill={HER.hair} />
          </>
        )}
        {smile === 'wide' ? (
          <path d="M70 79c1.5 7 11 7 13 0z" fill={HER.mouth} />
        ) : (
          <path
            d="M72 81c2.5 3 9.5 3 12 0"
            stroke={HER.mouth}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
        )}
        <circle cx="63" cy="78" r="3.6" fill="#F0A8B8" opacity="0.5" />
        <circle cx="93" cy="78" r="3.6" fill="#F0A8B8" opacity="0.5" />
        {/* strands falling in front of her shoulders */}
        <path d="M53 74c-3 18-3 40-1 62h10c-3-21-4-42-2-60z" fill={HER.hair} />
        <path d="M101 72c4 18 5 40 3 64h-10c3-22 3-44 1-62z" fill={HER.hair} />
      </g>
    </g>
  );
}

/** Him: taller, cropped hair, navy shirt. */
function HimBust({ tilt = 0, eyes = 'open', smile = 'soft' }) {
  return (
    <g>
      <path d="M92 132c0-28 21-42 50-42s50 14 50 42z" fill={HIM.top} />
      <g transform={`rotate(${tilt} 146 86)`}>
        <rect x="138" y="64" width="17" height="22" rx="8" fill={HIM.neck} />
        <ellipse cx="146" cy="52" rx="21" ry="24" fill={HIM.skin} />
        <path
          d="M125 48c0-16 9-25 21-25s21 9 21 25c-4-9-9-12-21-12s-17 3-21 12z"
          fill={HIM.hair}
        />
        <path
          d="M136 44c2-1.7 5-1.7 7 0M150 44c2-1.7 5-1.7 7 0"
          stroke={HIM.hair}
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        {eyes === 'closed' ? (
          <path
            d="M135 52c1.9 2.8 5.7 2.8 7.6 0M150 52c1.9 2.8 5.7 2.8 7.6 0"
            stroke={HIM.hair}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <>
            <circle cx="139" cy="52" r="2.6" fill={HIM.hair} />
            <circle cx="154" cy="52" r="2.6" fill={HIM.hair} />
          </>
        )}
        {smile === 'kiss' ? (
          <ellipse cx="140" cy="63" rx="4" ry="3" fill={HIM.mouth} />
        ) : smile === 'wide' ? (
          <path d="M138 61c2 8 13 8 15 0z" fill={HIM.mouth} />
        ) : (
          <path
            d="M139 62c3.5 3.5 11 3.5 14.5 0"
            stroke={HIM.mouth}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </g>
    </g>
  );
}

/** A hand, placed wherever a pose needs one to land. */
function Hand({ x, y, rotate = 0, fill = HIM.skin }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d="M15 0c-4-4-11-4-15 0-3 3-2 8 2 10 5 3 12 3 17 0z" fill={fill} />
      <path
        d="M3 4h9M4 8h8"
        stroke="#C08A5C"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/**
 * One pose per memory, so six unlocks never show the same picture twice.
 * MemoryVisual picks by question id.
 */
const POSES = [
  // 0 — his arm around her, hand on her far shoulder
  () => (
    <>
      <HimBust tilt={-3} />
      <path
        d="M124 106c-20-12-46-12-66-2"
        stroke={HIM.top}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <HerBust tilt={9} />
      <Hand x={37} y={100} />
    </>
  ),

  // 1 — she holds the phone up: our first frame
  ({ reduceMotion }) => (
    <>
      <HimBust tilt={-9} />
      <g transform="translate(12 4)">
        <HerBust tilt={14} smile="wide" />
      </g>
      {/* her arm, raised out of frame toward the camera */}
      <path
        d="M52 124c-12-16-14-34-11-52"
        stroke={HER.top}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <g transform="translate(20 36) rotate(-14)">
        <rect x="0" y="0" width="19" height="29" rx="4.5" fill="#12182A" stroke="#E0C48A" strokeWidth="1.6" />
        <motion.rect
          x="3"
          y="3.5"
          width="13"
          height="22"
          rx="2.5"
          fill="#F0D9A0"
          initial={{ opacity: 0.35 }}
          animate={reduceMotion ? { opacity: 0.5 } : { opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </g>
      <Hand x={28} y={62} rotate={-24} fill={HER.skin} />
    </>
  ),

  // 2 — her head resting on his shoulder, eyes closed
  () => (
    <>
      <HimBust tilt={-8} />
      <path
        d="M126 108c-22-12-50-10-70 0"
        stroke={HIM.top}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <g transform="translate(18 8)">
        <HerBust tilt={24} eyes="closed" />
      </g>
      <Hand x={46} y={110} rotate={6} />
    </>
  ),

  // 3 — a full hug, both arms, both smiling into it
  () => (
    <>
      <HimBust tilt={-11} eyes="closed" />
      <path
        d="M128 104c-24-14-54-12-74 0"
        stroke={HIM.top}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <g transform="translate(16 3)">
        <HerBust tilt={16} eyes="closed" />
      </g>
      {/* her arm, across his back */}
      <path
        d="M106 126c18-6 42-9 62-6"
        stroke={HER.top}
        strokeWidth="9.5"
        strokeLinecap="round"
        fill="none"
      />
      <Hand x={150} y={116} rotate={10} fill={HER.skin} />
      <Hand x={40} y={104} rotate={-4} />
    </>
  ),

  // 4 — he leans down and kisses her forehead
  ({ reduceMotion }) => (
    <>
      <g transform="translate(-9 5)">
        <HimBust tilt={-16} eyes="closed" smile="kiss" />
      </g>
      <path
        d="M117 117c-22-10-48-8-64 2"
        stroke={HIM.top}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <g transform="translate(10 8)">
        <HerBust tilt={-7} eyes="closed" />
      </g>
      <Hand x={40} y={112} rotate={-8} />
      {[0, 1, 2].map((i) => (
        <motion.text
          key={i}
          x={104 + i * 13}
          y={40}
          fontSize="11"
          fill="#F0A8B8"
          initial={{ opacity: 0 }}
          animate={
            reduceMotion
              ? { opacity: 0.7 }
              : { opacity: [0, 0.9, 0], y: [40, 22, 8] }
          }
          transition={{
            duration: 3.2,
            repeat: Infinity,
            delay: 0.6 + i * 0.7,
            ease: 'easeOut',
          }}
        >
          ♥
        </motion.text>
      ))}
    </>
  ),

  // 5 — a little cake held between them
  ({ reduceMotion }) => (
    <>
      <HimBust tilt={-6} smile="wide" />
      <g transform="translate(8 2)">
        <HerBust tilt={7} smile="wide" />
      </g>
      <g transform="translate(0 -2)">
        <rect x="92" y="112" width="44" height="20" rx="4" fill="#F3E4C8" />
        <rect x="92" y="112" width="44" height="7" rx="3.5" fill="#C46A80" />
        <rect x="112" y="98" width="4.5" height="14" rx="2" fill="#E8B98F" />
        <motion.path
          d="M114.2 90c3 3 1.6 6-.1 8-1.7-2-3.1-5-.1-8z"
          fill="#F0D9A0"
          initial={{ opacity: 0.85 }}
          animate={
            reduceMotion
              ? { opacity: 0.9 }
              : { opacity: [0.7, 1, 0.75], scaleY: [1, 1.18, 1] }
          }
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '114px 98px' }}
        />
      </g>
      <Hand x={80} y={118} rotate={-10} fill={HER.skin} />
      <Hand x={130} y={116} rotate={8} />
    </>
  ),
];

/**
 * Drawn stand-in for the pair, in whichever pose this memory calls for.
 * Deliberately unalike: she is shorter with long dark hair and a rose top; he
 * is taller with cropped hair and a navy shirt — so nobody has to guess who is
 * who, in any pose.
 */
export function DrawnCouple({ reduceMotion, seed = 0 }) {
  const Pose = POSES[seed % POSES.length];

  return (
    <svg
      viewBox="0 0 220 132"
      className="h-full w-auto max-w-full"
      preserveAspectRatio="xMidYMax meet"
      aria-label="The two of us"
      role="img"
    >
      <Pose reduceMotion={reduceMotion} />
    </svg>
  );
}

/** Sparkles drifting up inside the card. */
function SparkleField({ reduceMotion, seed }) {
  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 12 }, (_, i) => {
        const size = 4 + ((i + seed) % 4) * 2;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#F0D9A0]"
            style={{
              left: `${((i * 23 + seed * 11) % 92) + 3}%`,
              bottom: -8,
              width: size,
              height: size,
              filter: 'blur(0.4px)',
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [-4, -170 - (i % 4) * 20],
              x: [0, i % 2 === 0 ? 16 : -14, 0],
              opacity: [0, 0.85, 0],
              scale: [0.6, 1.1, 0.5],
            }}
            transition={{
              duration: 5 + (i % 5) * 0.9,
              delay: (i % 6) * 0.55,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}

/** The memory note arrives a word at a time, like it's being said out loud. */
function RevealText({ text }) {
  const reduceMotion = useReducedMotion();
  const words = text.split(' ');

  if (reduceMotion) {
    return <p className="mt-2 text-sm leading-relaxed text-rose-muted">{text}</p>;
  }

  return (
    <p className="mt-2 text-sm leading-relaxed text-rose-muted">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.5 + i * 0.045 }}
        >
          {word}{i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </p>
  );
}
