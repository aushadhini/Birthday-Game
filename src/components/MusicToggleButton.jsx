import { motion } from 'framer-motion';
import { siteConfig } from '../data/config';
import { useMusic } from '../context/musicContext';

/**
 * Fixed mini play/pause for our song — present on every screen so the music
 * can be started or stopped from anywhere. Mirrors the same shared audio as
 * the full MusicPlayer cards on the welcome and finale screens.
 */
export default function MusicToggleButton() {
  const { playing, error, toggle } = useMusic();

  const label = error
    ? `Song file missing — add public${siteConfig.musicSrc}`
    : playing
      ? `Pause “${siteConfig.musicTitle}”`
      : `Play “${siteConfig.musicTitle}” — ${siteConfig.musicLabel}`;

  return (
    <div className="pointer-events-none fixed bottom-5 left-4 z-40 sm:bottom-7 sm:left-6">
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={label}
        aria-pressed={playing}
        title={label}
        className="pointer-events-auto group relative flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A86C] shadow-[0_0_20px_rgba(201,168,108,0.35)] backdrop-blur-md sm:h-14 sm:w-14"
        style={{
          background: 'linear-gradient(135deg, rgba(11,18,32,0.92) 0%, rgba(9,14,26,0.95) 100%)',
          opacity: error ? 0.55 : 1,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: error ? 1 : 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Soft pulsing halo while the song plays */}
        {playing && (
          <motion.span
            className="absolute inset-0 rounded-full border border-[#C9A86C]"
            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}

        {playing ? (
          // Pause bars
          <svg viewBox="0 0 24 24" fill="none" stroke="#C9A86C" strokeWidth="1.8" className="relative z-10 h-5 w-5">
            <path d="M9 4v16M15 4v16" strokeLinecap="round" />
          </svg>
        ) : (
          // Music note
          <svg viewBox="0 0 24 24" fill="none" stroke="#C9A86C" strokeWidth="1.5" className="relative z-10 h-5 w-5 transition-transform group-hover:scale-110">
            <circle cx="7" cy="18" r="3" />
            <circle cx="17" cy="16" r="3" />
            <path d="M10 18V6l10-2v12" strokeLinecap="round" />
          </svg>
        )}

        <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-full border border-[#C9A86C]/40 bg-[#0B1220]/90 px-3.5 py-1.5 text-[11px] tracking-wide text-[#F3EEE6] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block">
          {error ? 'Song file missing' : playing ? 'Pause our song' : 'Play our song'}
        </span>
      </motion.button>
    </div>
  );
}
