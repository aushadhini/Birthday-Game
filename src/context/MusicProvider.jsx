import { useCallback, useEffect, useRef, useState } from 'react';
import { siteConfig } from '../data/config';
import { MusicContext } from './musicContext';

/**
 * One single <audio> element for the whole app.
 * It lives above the screen router, so our song keeps playing (and keeps its
 * position) while you move between the password gate, welcome, levels and
 * gallery — and every play/pause control anywhere shares this state.
 */
export function MusicProvider({ children }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onError = () => {
      setError(true);
      setPlaying(false);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || error) return;

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch {
      // Autoplay policies may block until another gesture — show gentle tip
      setError(true);
    }
  }, [error]);

  return (
    <MusicContext.Provider value={{ playing, error, toggle }}>
      <audio ref={audioRef} src={siteConfig.musicSrc} loop preload="none" />
      {children}
    </MusicContext.Provider>
  );
}
