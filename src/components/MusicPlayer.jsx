import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../data/config';

/**
 * Lightweight romantic music player.
 * Drop an mp3 into /public/music/ and set musicSrc in src/data/config.js
 */
export default function MusicPlayer({ compact = false }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => setPlaying(false);
    const onError = () => {
      setError(true);
      setPlaying(false);
    };

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || error) return;

    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        await audio.play();
        setPlaying(true);
      }
    } catch {
      // Autoplay policies may block until another gesture — show gentle tip
      setError(true);
    }
  };

  return (
    <div className={compact ? '' : 'w-full max-w-xs'}>
      <audio ref={audioRef} src={siteConfig.musicSrc} loop preload="none" />
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
          <span className="block text-xs text-rose-muted">
            {error
              ? 'Add /public/music/romantic-song.mp3'
              : playing
                ? 'Playing softly…'
                : 'Tap to play'}
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
