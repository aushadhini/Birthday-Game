import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { loveReasons } from '../data/loveReasons';

/* ─── WEB AUDIO API SYNTHESIZER ─── */
const playPaperSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Generate low-frequency rustle noise
    const bufferSize = ctx.sampleRate * 0.45;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.4);
    filter.Q.setValueAtTime(3, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start(now);
  } catch (e) {
    console.warn('Audio Context error:', e);
  }
};

const playSparkleSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const notes = [987.77, 1174.66, 1318.51, 1567.98, 1975.53, 2349.32]; // Chime notes
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.04);

      gain.gain.setValueAtTime(0.08, now + index * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.04 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.04);
      osc.stop(now + index * 0.04 + 0.4);
    });
  } catch (e) {
    console.warn('Audio Context error:', e);
  }
};

/* ─── 29 MAGICAL COLLECTIBLES DATA ─────────────────────────────────────────
   All 29 objects float on Level 1 only — that level is nothing but the hunt.
   Positions hug the edges of the viewport so the quest card stays readable. */
const COLLECTIBLES_CONFIG = [
  // Top row
  { id: 1, name: "Wax-sealed love letter", screen: "level1", top: "4%", left: "5%" },
  { id: 2, name: "Birthday cake", screen: "level1", top: "4%", left: "19%" },
  { id: 3, name: "Gift box with ribbon", screen: "level1", top: "4%", left: "33%" },
  { id: 4, name: "Balloon", screen: "level1", top: "4%", right: "33%" },
  { id: 5, name: "Sparkles", screen: "level1", top: "4%", right: "19%" },
  { id: 6, name: "Butterfly", screen: "level1", top: "4%", right: "5%" },

  // Upper side columns
  { id: 7, name: "Rose", screen: "level1", top: "15%", left: "2%" },
  { id: 8, name: "Golden key", screen: "level1", top: "15%", left: "15%" },
  { id: 9, name: "Star", screen: "level1", top: "15%", right: "15%" },
  { id: 10, name: "Candle", screen: "level1", top: "15%", right: "2%" },

  { id: 11, name: "Tiny crown", screen: "level1", top: "27%", left: "4%" },
  { id: 12, name: "Lucky clover", screen: "level1", top: "27%", left: "16%" },
  { id: 13, name: "Crystal heart", screen: "level1", top: "27%", right: "16%" },
  { id: 14, name: "Moon", screen: "level1", top: "27%", right: "4%" },

  // Middle side columns
  { id: 15, name: "Shooting star", screen: "level1", top: "39%", left: "2%" },
  { id: 16, name: "Teddy bear", screen: "level1", top: "39%", left: "14%" },
  { id: 17, name: "Music note", screen: "level1", top: "39%", right: "14%" },
  { id: 18, name: "Ribbon", screen: "level1", top: "39%", right: "2%" },

  { id: 19, name: "Small present tag", screen: "level1", top: "51%", left: "4%" },
  { id: 20, name: "Celebration confetti", screen: "level1", top: "51%", left: "16%" },
  { id: 21, name: "Compass", screen: "level1", top: "51%", right: "16%" },
  { id: 22, name: "Diamond Ring", screen: "level1", top: "51%", right: "4%" },

  // Lower side columns
  { id: 23, name: "Anchor", screen: "level1", top: "63%", left: "2%" },
  { id: 24, name: "Hourglass", screen: "level1", top: "63%", left: "14%" },
  { id: 25, name: "Magic wand", screen: "level1", top: "63%", right: "14%" },
  { id: 26, name: "Envelope", screen: "level1", top: "63%", right: "2%" },

  // Bottom row
  { id: 27, name: "Feathery pen", screen: "level1", top: "88%", left: "8%" },
  { id: 28, name: "Dove", screen: "level1", top: "88%", left: "45%" },
  { id: 29, name: "Infinite loop", screen: "level1", top: "88%", right: "8%" }
];

/* ─── PREMIUM SVG ILLUSTRATIONS ─── */
export function CollectibleIcon({ id, className = "h-full w-full" }) {
  const gold = "#D4AF37";
  const rose = "#E8A0A8";
  const ivory = "#FFF8E7";

  switch (id) {
    case 1: // Wax-sealed love letter
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <rect x="2" y="5" width="20" height="14" rx="2" stroke={gold} />
          <path d="M2 7l10 7 10-7" stroke={gold} />
          <circle cx="12" cy="12" r="3" fill={rose} stroke={gold} strokeWidth="1" />
        </svg>
      );
    case 2: // Birthday cake
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M4 18h16v3H4zm2-6h12v6H6zm3-5h6v5H9z" />
          <path d="M12 2v3M9 3v2M15 3v2" stroke={rose} />
        </svg>
      );
    case 3: // Gift box
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <rect x="3" y="9" width="18" height="12" rx="2" />
          <path d="M2 6h20v3H2z" />
          <path d="M12 6c0-2-1-4-3-4s-3 2-1 4h4zm0 0c0-2 1-4 3-4s3 2 1 4h-4z" fill={rose} opacity="0.4" />
          <path d="M12 9v12M3 14h18" />
        </svg>
      );
    case 4: // Balloon
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M12 18c3.5 0 6.5-3 6.5-7S15 4 12 4s-6 3-6 7 3 7 6 7z" fill={rose} opacity="0.3" />
          <path d="M12 18l-1 2h2z" fill={gold} />
          <path d="M12 20c-1 2-2 1-3 3" />
        </svg>
      );
    case 5: // Sparkles
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" fill={ivory} opacity="0.6" />
          <path d="M6 16l1 2.5L9.5 19.5 7 20.5 6 23l-1-2.5-2.5-1 2.5-1L6 16zm12-2l.5 2 2 .5-2 .5-.5 2-.5-2-2-.5 2-.5.5-2z" />
        </svg>
      );
    case 6: // Butterfly
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M12 5C10 2 5 2 4 6s4 7 8 4c4 3 7 0 8-4s-6-4-8-1z" fill={rose} opacity="0.4" />
          <path d="M12 9c-2 2-5 3-6 6s3 3 6-1c3 4 8 4 6 1s-4-4-6-6z" />
          <path d="M12 21V4M10 3c0-1 1-2 2-2s2 1 2 2" />
        </svg>
      );
    case 7: // Rose
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M12 13c3-3 1-7-2-8-3-1-6 2-4 5s4 4 6 3zm0 0c-3 3-1 7 2 8 3 1 6-2 4-5s-4-4-6-3z" fill={rose} opacity="0.3" />
          <path d="M12 13v8M9 16c-2 0-3 1-3 2M15 17c2 0 3 1 3 2" />
        </svg>
      );
    case 8: // Golden key
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <circle cx="6" cy="12" r="4" />
          <path d="M6 10a2 2 0 100 4 2 2 0 000-4z" fill={ivory} opacity="0.3" />
          <path d="M10 12h12v4h-3v-4h-3v4h-3v-4" />
        </svg>
      );
    case 9: // Star
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={ivory} opacity="0.4" />
        </svg>
      );
    case 10: // Candle
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <rect x="9" y="8" width="6" height="13" rx="1" />
          <path d="M12 3c1 1 1 3 0 4s-1-3 0-4z" fill={rose} />
          <path d="M8 21h8" />
        </svg>
      );
    case 11: // Tiny crown
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M3 18l2-11 5 4 2-6 2 6 5-4 2 11H3z" fill={rose} opacity="0.25" />
          <circle cx="5" cy="7" r="1" fill={gold} />
          <circle cx="12" cy="5" r="1" fill={gold} />
          <circle cx="19" cy="7" r="1" fill={gold} />
        </svg>
      );
    case 12: // Lucky clover
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M12 12c2-3 5-3 5 0s-3 3-5 0zm0 0c-2 3-5 3-5 0s3-3 5 0zm0 0c-3-2-3-5 0-5s3 3 0 5zm0 0c3 2 3 5 0 5s-3-3 0-5z" fill={ivory} opacity="0.4" />
          <path d="M12 12c-1 3-3 5-3 6" />
        </svg>
      );
    case 13: // Crystal heart
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M12 21s-7.2-4.6-9.4-8.6C1.2 9.6 2.6 6 6.2 6c1.9 0 3.4 1 4.3 2.3C11.4 7 12.9 6 14.8 6c3.6 0 5 3.6 3.6 6.4C19.2 16.4 12 21 12 21Z" fill={rose} opacity="0.3" />
          <path d="M12 8L6 12.5M12 8l6 4.5M12 21V8" opacity="0.6" />
        </svg>
      );
    case 14: // Moon
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M12 3a9 9 0 109 9c0-.5 0-1-.1-1.5A7 7 0 0113.5 4.1c.5-.1 1-.1 1.5-.1A9 9 0 0012 3z" fill={rose} opacity="0.25" />
          <path d="M19 3l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z" fill={gold} />
        </svg>
      );
    case 15: // Shooting star
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M17 7l3.09 6.26L27 14.27l-5 4.87 1.18 6.88L17 22.77l-6.18 3.25L12 19.14 7 14.27l6.91-1.01L17 7z" fill={ivory} opacity="0.4" />
          <path d="M2 2l11 11M5 2l8 8M2 5l8 8" opacity="0.5" />
        </svg>
      );
    case 16: // Teddy bear
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <circle cx="12" cy="13" r="6" />
          <circle cx="12" cy="7" r="4" fill={rose} opacity="0.2" />
          <circle cx="8" cy="4" r="1.5" />
          <circle cx="16" cy="4" r="1.5" />
          <path d="M10 13c0-1 1.5-1.5 2-1.5s2 .5 2 1.5" />
        </svg>
      );
    case 17: // Music note
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <circle cx="6" cy="18" r="3" />
          <circle cx="16" cy="16" r="3" />
          <path d="M9 18V6l10-2v12M9 10l10-2" />
        </svg>
      );
    case 18: // Ribbon
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M4 21c4-6 4-12 8-12s4 6 8 12" />
          <path d="M12 9c2 0 4-2 4-4s-2-3-4-3-4 1-4 3 2 4 4 4z" fill={rose} opacity="0.3" />
        </svg>
      );
    case 19: // Small present tag
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M6 3h10l5 5v13H6z" />
          <circle cx="11" cy="7" r="1.5" fill={rose} />
          <path d="M10 12h4M9 16h6" />
        </svg>
      );
    case 20: // Celebration confetti
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <circle cx="6" cy="6" r="1.5" fill={rose} />
          <rect x="15" y="4" width="3" height="3" transform="rotate(45 16.5 5.5)" />
          <path d="M5 16l3 1M16 16l-2 3M11 10v4" />
        </svg>
      );
    case 21: // Compass
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v12M6 12h12" opacity="0.4" />
          <path d="M12 9l2 3-2 3-2-3 2-3z" fill={rose} />
        </svg>
      );
    case 22: // Diamond Ring
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <circle cx="12" cy="14" r="6" />
          <path d="M12 8l-3-3h6l-3 3z" fill={ivory} opacity="0.6" />
          <path d="M9 5l3-3 3 3" />
        </svg>
      );
    case 23: // Anchor
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v10M8 12H16M5 13c0 4 3 7 7 7s7-3 7-7M4 12l2 2M20 12l-2 2" />
        </svg>
      );
    case 24: // Hourglass
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M6 4h12M6 20h12M6 4l6 8 6-8M6 20l6-8 6 8" />
          <circle cx="12" cy="16" r="1.5" fill={rose} opacity="0.4" />
        </svg>
      );
    case 25: // Magic wand
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M19 5l2-2-4.5 4.5M4 20l11-11" />
          <path d="M18 2l.5 1 .5-1M21 5l.5 1 .5-1" stroke={rose} />
        </svg>
      );
    case 26: // Envelope
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M2 19h20V9H2v10z" />
          <path d="M2 9l10 6 10-6" />
          <path d="M6 9V5h12v4" />
        </svg>
      );
    case 27: // Feathery pen
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M20 4c-3 1-8 6-9 11l-2 5 4-2c4-1 6-5 7-9 1-2.5 1-4.5 0-5z" fill={rose} opacity="0.35" />
          <path d="M13 11l5-5M9 15l2.5-2.5" />
        </svg>
      );
    case 28: // Dove
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M20 7c-2 0-4 .5-6 1.5S9 11 7 13l-4-1 2-2C7 8 9 7 12 7c2-1 3-3 5-4s3 2 3 4z" fill={ivory} opacity="0.4" />
          <path d="M13 9l1 5-4-3" />
        </svg>
      );
    case 29: // Infinite loop
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" className={className}>
          <path d="M7 9c-2.5 0-4.5 1.5-4.5 3s2 3 4.5 3 4.5-3 6-4.5c1.5-1.5 3.5-4.5 6-4.5s4.5 1.5 4.5 3-2 3-4.5 3-4.5-3-6-4.5C11.5 12 9.5 9 7 9z" fill={rose} opacity="0.25" />
        </svg>
      );
    default:
      return null;
  }
}

export default function LoveNotesButton({
  visible = true,
  screen = "welcome",
  collectedIds = [],
  onCollect,
  onReset,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activePage, setActivePage] = useState(0);

  // Unlocking/collecting animation state
  const [collectingId, setCollectingId] = useState(null);
  const [collectingPos, setCollectingPos] = useState({ top: "50%", left: "50%" });

  // Sound active settings
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleCollect = (collectible, event) => {
    if (collectedIds.includes(collectible.id)) return;
    if (collectingId !== null) return; // Prevent multiple simultaneous clicks

    // Get click position for custom zoom animation
    const rect = event.currentTarget.getBoundingClientRect();
    setCollectingPos({
      top: rect.top + rect.height / 2,
      left: rect.left + rect.width / 2
    });

    setCollectingId(collectible.id);

    // Play sparkle sound instantly
    if (soundEnabled) playSparkleSound();

    // After animation zooms to center, transform it into envelope
    setTimeout(() => {
      if (soundEnabled) playPaperSound();

      onCollect?.(collectible.id);

      // Open modal automatically at the new unlocked page index
      setActivePage(collectedIds.length);
      setCollectingId(null);
      setModalOpen(true);
    }, 1200);
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to lock the storybook and start the magical discovery again?")) {
      onReset?.();
      setModalOpen(false);
      setActivePage(0);
    }
  };

  if (!visible) return null;

  // Filter collectibles for the currently active screen that haven't been collected yet
  const activeScreenCollectibles = COLLECTIBLES_CONFIG.filter(
    (c) => c.screen === screen && !collectedIds.includes(c.id)
  );

  return (
    <>
      {/* ─── FLOATING COLLECTIBLES ON THE SCREEN ─── */}
      <AnimatePresence>
        {activeScreenCollectibles.map((item) => {
          // Unique slight speed and rotation for each
          const rotSeed = (item.id * 13) % 20 - 10; // -10 to 10 deg
          const durSeed = 6 + (item.id % 5) * 1.5; // 6s to 12s
          const delaySeed = (item.id % 3) * 0.4;

          return (
            <motion.button
              key={item.id}
              onClick={(e) => handleCollect(item, e)}
              className="absolute pointer-events-auto z-30 flex h-11 w-11 items-center justify-center rounded-full border p-2 cursor-pointer focus:outline-none sm:h-14 sm:w-14"
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
                borderColor: 'rgba(212, 175, 55, 0.45)',
                background: 'radial-gradient(circle, rgba(11,29,58,0.85) 0%, rgba(5,15,30,0.95) 100%)',
                boxShadow: '0 0 16px rgba(212,175,55,0.25), inset 0 0 12px rgba(212,175,55,0.1)',
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [0, -12, 0],
                rotate: [rotSeed, rotSeed + 8, rotSeed - 8, rotSeed],
              }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{
                scale: 1.15,
                borderColor: 'rgba(212, 175, 55, 0.95)',
                boxShadow: '0 0 24px rgba(212,175,55,0.65), 0 0 40px rgba(232,160,168,0.3)',
              }}
              transition={{
                y: {
                  duration: durSeed,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delaySeed
                },
                rotate: {
                  duration: durSeed * 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delaySeed
                },
                scale: { duration: 0.3 },
                opacity: { duration: 0.3 }
              }}
            >
              {/* Soft glow trail inside */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/5 to-[#E8A0A8]/10 animate-pulse pointer-events-none" />
              
              <CollectibleIcon id={item.id} />

              {/* Sparkle particle trail */}
              <span className="absolute -top-1 -right-1 text-[8px] text-[#FFF8E7] animate-ping opacity-60">✦</span>
              <span className="absolute -bottom-1 -left-1 text-[8px] text-[#E8A0A8] animate-pulse">♥</span>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* ─── COLLECTION ANIMATION PORTAL LAYER ─── */}
      <AnimatePresence>
        {collectingId !== null && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-[#0B1D3A]/40 backdrop-blur-[2px]">
            <motion.div
              initial={{
                position: 'fixed',
                top: collectingPos.top,
                left: collectingPos.left,
                transform: 'translate(-50%, -50%)',
                scale: 1,
                rotate: 0,
              }}
              animate={{
                top: '50%',
                left: '50%',
                scale: [1, 2.5, 1.8],
                rotate: [0, 360, 720],
                boxShadow: [
                  '0 0 20px rgba(212,175,55,0.4)',
                  '0 0 60px rgba(212,175,55,0.9), 0 0 100px rgba(232,160,168,0.7)',
                  '0 0 40px rgba(212,175,55,0.6)',
                ]
              }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37] bg-[#0B1D3A]"
            >
              <CollectibleIcon id={collectingId} className="h-10 w-10" />
              
              {/* Sparkle burst circles */}
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-[#FFF8E7]"
                initial={{ scale: 0.8, opacity: 0.9 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full border border-[#E8A0A8]"
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2.8, opacity: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── FIXED LEDGER BUTTON (BOTTOM-RIGHT) ─── */}
      <div className="pointer-events-none fixed bottom-5 right-4 z-40 sm:bottom-7 sm:right-6">
        <motion.button
          type="button"
          onClick={() => {
            if (soundEnabled) playPaperSound();
            setModalOpen(true);
          }}
          aria-label="Open Love Storybook"
          title="Open Love Storybook"
          className="pointer-events-auto group relative flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37] text-lg shadow-[0_0_20px_rgba(212,175,55,0.35)] backdrop-blur-md sm:h-16 sm:w-16 sm:text-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(11,29,58,0.92) 0%, rgba(5,15,30,0.95) 100%)',
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Circular book SVG */}
          <svg viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" className="h-6 w-6 relative z-10 transition-transform group-hover:scale-110">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20M4 19.5V3.5A2.5 2.5 0 016.5 1H20v16H6.5a2.5 2.5 0 00-2.5 2.5z" />
            <path d="M10 5h6M10 9h6" strokeWidth="1" strokeLinecap="round" />
          </svg>

          {/* Badge count of found collectibles */}
          <div 
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-[#0B1D3A]"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #FFF8E7 100%)',
              boxShadow: '0 0 8px rgba(212,175,55,0.6)'
            }}
          >
            {collectedIds.length}
          </div>

          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full border border-[#D4AF37]/40 bg-[#0B1D3A]/90 px-3.5 py-1.5 text-[11px] tracking-wide text-[#FFF8E7] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block">
            Open Storybook
          </span>
        </motion.button>
      </div>

      {/* ─── ELEGANT JOURNAL/LETTER MODAL ─── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Dark glass backdrop */}
            <motion.button
              type="button"
              className="absolute inset-0 bg-[#0B1D3A]/85 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
            />

            {/* Letter card container */}
            <motion.div
              role="dialog"
              aria-modal="true"
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-[#D4AF37]/35 shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
              style={{
                // Ivory parchment styled background
                backgroundColor: '#FFF8E7',
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 0%, rgba(255,248,231,0.9) 100%)'
              }}
              initial={{ opacity: 0, y: 50, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 35, scale: 0.95 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
            >
              {/* Paper texture overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                }}
              />

              {/* Gentle floating sparkles in modal background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                {[...Array(6)].map((_, i) => (
                  <span 
                    key={i} 
                    className="absolute text-xs text-[#D4AF37] animate-pulse"
                    style={{
                      left: `${15 + i * 16}%`,
                      top: `${20 + (i * 12) % 60}%`,
                      animationDelay: `${i * 0.4}s`
                    }}
                  >
                    ✦
                  </span>
                ))}
              </div>

              {/* Inner content border */}
              <div className="relative m-4 border border-[#D4AF37]/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-between" style={{ minHeight: '420px' }}>
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-3">
                  <div>
                    <h3 className="font-display italic text-[#D4AF37] text-lg sm:text-xl">
                      A Birthday Letter
                    </h3>
                    <p className="text-[10px] tracking-widest uppercase text-[#0B1D3A]/60">
                      Page {collectedIds.length === 0 ? "00" : String(activePage + 1).padStart(2, '0')} / 29
                    </p>
                  </div>
                  <button 
                    onClick={() => setModalOpen(false)}
                    className="text-xs tracking-wider uppercase border border-[#0B1D3A]/25 rounded-full px-3 py-1 text-[#0B1D3A]/70 hover:bg-[#0B1D3A]/5 hover:text-[#0B1D3A] transition"
                  >
                    Close
                  </button>
                </div>

                {/* Main letter body */}
                <div className="flex-1 flex flex-col justify-center py-6">
                  {collectedIds.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mx-auto h-16 w-16 text-[#D4AF37] mb-4">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
                        </svg>
                      </div>
                      <h4 className="font-display italic text-[#0B1D3A] text-xl mb-2">Magical Quest Locked</h4>
                      <p className="text-xs text-[#0B1D3A]/60 max-w-xs mx-auto leading-relaxed">
                        Search the screen to find and collect floating magical objects. Each object reveals a new page of my handwritten birthday letter!
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activePage}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="text-[#0B1D3A]"
                      >
                        <h4 className="font-display italic text-[#D4AF37] text-2xl text-center mb-4">
                          {loveReasons[activePage]?.title || "Chapter Unlocked"}
                        </h4>
                        
                        {/* Elegant cursive quote styling */}
                        <p className="font-display text-lg sm:text-xl text-[#0B1D3A]/90 leading-relaxed text-center italic max-w-md mx-auto px-2">
                          &ldquo;{loveReasons[activePage]?.message}&rdquo;
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>

                {/* Footer Controls */}
                {collectedIds.length > 0 && (
                  <div className="border-t border-[#D4AF37]/25 pt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          if (activePage > 0) {
                            if (soundEnabled) playPaperSound();
                            setActivePage(p => p - 1);
                          }
                        }}
                        disabled={activePage === 0}
                        className="text-xs tracking-wider uppercase border border-[#0B1D3A]/15 rounded-full px-4 py-2 text-[#0B1D3A]/70 hover:bg-[#0B1D3A]/5 disabled:opacity-30 disabled:pointer-events-none transition"
                      >
                        ← Previous
                      </button>

                      {/* Sound Control Indicator */}
                      <button 
                        onClick={() => setSoundEnabled(!soundEnabled)} 
                        className="text-[#0B1D3A]/40 hover:text-[#0B1D3A]/70 transition p-1"
                        title={soundEnabled ? "Mute Sounds" : "Unmute Sounds"}
                      >
                        {soundEnabled ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                            <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                            <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          if (activePage < collectedIds.length - 1) {
                            if (soundEnabled) playPaperSound();
                            setActivePage(p => p + 1);
                          }
                        }}
                        disabled={activePage === collectedIds.length - 1}
                        className="text-xs tracking-wider uppercase bg-[#0B1D3A] text-[#FFF8E7] rounded-full px-5 py-2 hover:bg-[#0B1D3A]/90 disabled:opacity-30 disabled:pointer-events-none transition"
                        style={{
                          boxShadow: '0 4px 12px rgba(11,29,58,0.2)'
                        }}
                      >
                        Next →
                      </button>
                    </div>

                    {/* Progress feedback */}
                    <div className="flex items-center justify-between text-[10px] text-[#0B1D3A]/50">
                      <span>Unlocked: {collectedIds.length} of 29 objects</span>
                      <button 
                        onClick={resetProgress}
                        className="hover:text-red-700 underline transition cursor-pointer"
                      >
                        Reset progress
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
