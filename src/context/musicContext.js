import { createContext, useContext } from 'react';

/** Shared playback state for our song. Provided by <MusicProvider>. */
export const MusicContext = createContext(null);

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used inside <MusicProvider>');
  }
  return context;
}
