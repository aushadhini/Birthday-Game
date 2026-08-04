import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../data/config';
import { useMusic } from '../context/musicContext';

/**
 * Full-width control for our song.
 * The audio itself lives in MusicProvider, so this is just a view over the
 * shared playback state — pausing here also pauses the mini control, and the
 * track keeps playing when you change screens.
 * Drop the mp3 into /public/music/ and set musicSrc in src/data/config.js
 */
export default function MusicPlayer({ compact = false }) {
  const { playing, error, toggle } = useMusic();

  return (
    <div className={compact ? '' : 'w-full max-w-xs'}>
      <button
        type="button"
        onClick={toggle}
        className="group flex w-full items-center gap-3 rounded-full border border-rose-line bg-white/5 px-4 py-2.5 text-left shadow-soft backdrop-blur-md transition hover:border-rose-accent/50 hover:bg-white/[0.07]"
        aria-label={playing ? 'Pause music' : 'Play music'}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F0D9A0] to-[#C9A86C] text-[#1A1420] shadow-[0_0_16px_rgba(201,168,108,0.5)]">
          {playing ? (
            <span className="flex gap-0.5">
              <span className="h-3 w-0.5 animate-pulse bg-[#1A1420]" />
              <span className="h-3 w-0.5 animate-pulse bg-[#1A1420] [animation-delay:150ms]" />
            </span>
          ) : (
            <span className="ml-0.5 border-y-[6px] border-l-[10px] border-y-transparent border-l-[#1A1420]" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-rose-ink">
            🎵 {siteConfig.musicTitle}
          </span>
          <span className="block truncate text-xs text-rose-muted">
            {error
              ? `Add public${siteConfig.musicSrc}`
              : playing
                ? `${siteConfig.musicLabel} · playing softly…`
                : `${siteConfig.musicLabel} · ${siteConfig.musicArtist} · tap to play`}
          </span>
        </span>
        <AnimatePresence>
          {playing && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-rose-accent"
            >
              ♪
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
