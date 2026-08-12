import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PasswordGate from './components/PasswordGate';
import WelcomeScreen from './components/WelcomeScreen';
import QuestScreen from './components/QuestScreen';
import MemoryQuiz from './components/MemoryQuiz';
import FinalSurprise from './components/FinalSurprise';
import PhotoGallery from './components/PhotoGallery';
import LoveNotesButton from './components/LoveNotesButton';
import MusicToggleButton from './components/MusicToggleButton';
import AmbientBackdrop from './components/AmbientBackdrop';
import SecretLetter from './components/SecretLetter';
import BackButton from './components/BackButton';
import useCollectibles from './hooks/useCollectibles';
import useIsPhone from './hooks/useIsPhone';

/**
 * Screen flow:
 * password → welcome → level1 (collect 29 objects) → level2 (quiz) → level3 (finale)
 * Gallery can open from welcome and return back.
 * Floating Love Notes button appears after unlock.
 */
const SCREENS = {
  PASSWORD: 'password',
  WELCOME: 'welcome',
  LEVEL1: 'level1', // QuestScreen — the 29 floating collectibles
  LEVEL2: 'level2', // MemoryQuiz
  LEVEL3: 'level3', // FinalSurprise
  GALLERY: 'gallery',
};

/* Where the phone's back button goes from each screen. The finale is left out —
   its own "Play it again" is the way out. */
const BACK_TO = {
  [SCREENS.LEVEL1]: { screen: SCREENS.WELCOME, label: 'Back' },
  [SCREENS.LEVEL2]: { screen: SCREENS.LEVEL1, label: 'Level 1' },
  [SCREENS.GALLERY]: { screen: SCREENS.WELCOME, label: 'Back' },
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.PASSWORD);
  const unlocked = screen !== SCREENS.PASSWORD;
  const isPhone = useIsPhone();
  const back = BACK_TO[screen];

  // Every screen starts at the top. Clicking a button near the bottom of one
  // screen leaves the page scrolled, and the next screen inherited that offset —
  // which slid the gallery's heading up underneath the fixed ✦ in the corner.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [screen]);
  const { collectedIds, collectedCount, collect, reset } = useCollectibles();
  // Level 1's playing field — QuestScreen measures its card and publishes the
  // node plus one slot per object, so the collectibles land around the card
  // instead of on top of it. Null on every other screen.
  const [questField, setQuestField] = useState(null);
  // The storybook letter opens itself on every collect; Level 1 waits for it to
  // close before it celebrates the finished heart.
  const [letterOpen, setLetterOpen] = useState(false);

  return (
    <div className="app-shell relative min-h-dvh text-rose-ink">
      {/* Starfield, aurora, grain and vignette — one persistent atmosphere */}
      <AmbientBackdrop />

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          className="relative z-10"
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {screen === SCREENS.PASSWORD && (
            <PasswordGate onUnlock={() => setScreen(SCREENS.WELCOME)} />
          )}

          {screen === SCREENS.WELCOME && (
            <WelcomeScreen
              onStart={() => setScreen(SCREENS.LEVEL1)}
              onOpenGallery={() => setScreen(SCREENS.GALLERY)}
            />
          )}

          {screen === SCREENS.LEVEL1 && (
            <QuestScreen
              collectedCount={collectedCount}
              collectedIds={collectedIds}
              onUnlock={() => setScreen(SCREENS.LEVEL2)}
              onField={setQuestField}
              letterOpen={letterOpen}
            />
          )}

          {screen === SCREENS.LEVEL2 && (
            <MemoryQuiz onComplete={() => setScreen(SCREENS.LEVEL3)} />
          )}

          {screen === SCREENS.LEVEL3 && (
            <FinalSurprise onReplay={() => setScreen(SCREENS.WELCOME)} />
          )}

          {screen === SCREENS.GALLERY && (
            <PhotoGallery onBack={() => setScreen(SCREENS.WELCOME)} inlineBack={!isPhone} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Play/pause our song from any screen — the audio itself lives in
          MusicProvider, so it never stops when the screen changes. */}
      <MusicToggleButton />

      {/* Easter egg: type their name anywhere, or long-press the corner ✦ */}
      <SecretLetter />

      {/* Phones only — the desktop layouts are never this hemmed in */}
      {isPhone && back && <BackButton label={back.label} onBack={() => setScreen(back.screen)} />}

      {/* Fixed floating surprise — available on every screen after unlock.
          The 29 collectibles themselves only float on Level 1. */}
      <LoveNotesButton
        visible={unlocked}
        screen={screen}
        collectedIds={collectedIds}
        onCollect={collect}
        onReset={reset}
        field={screen === SCREENS.LEVEL1 ? questField : null}
        onLetterOpenChange={setLetterOpen}
      />
    </div>
  );
}
