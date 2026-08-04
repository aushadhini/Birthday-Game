import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PasswordGate from './components/PasswordGate';
import WelcomeScreen from './components/WelcomeScreen';
import QuestScreen from './components/QuestScreen';
import MemoryQuiz from './components/MemoryQuiz';
import FinalSurprise from './components/FinalSurprise';
import PhotoGallery from './components/PhotoGallery';
import LoveNotesButton from './components/LoveNotesButton';
import useCollectibles from './hooks/useCollectibles';

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

export default function App() {
  const [screen, setScreen] = useState(SCREENS.PASSWORD);
  const unlocked = screen !== SCREENS.PASSWORD;
  const { collectedIds, collectedCount, collect, reset } = useCollectibles();

  return (
    <div className="app-shell relative min-h-dvh text-rose-ink">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
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
            />
          )}

          {screen === SCREENS.LEVEL2 && (
            <MemoryQuiz onComplete={() => setScreen(SCREENS.LEVEL3)} />
          )}

          {screen === SCREENS.LEVEL3 && (
            <FinalSurprise onReplay={() => setScreen(SCREENS.WELCOME)} />
          )}

          {screen === SCREENS.GALLERY && (
            <PhotoGallery onBack={() => setScreen(SCREENS.WELCOME)} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Fixed floating surprise — available on every screen after unlock.
          The 29 collectibles themselves only float on Level 1. */}
      <LoveNotesButton
        visible={unlocked}
        screen={screen}
        collectedIds={collectedIds}
        onCollect={collect}
        onReset={reset}
      />
    </div>
  );
}
