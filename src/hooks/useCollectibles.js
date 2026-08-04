import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'birthday_storybook_unlocked_v6';

/**
 * Shared progress for the 29 floating collectibles.
 * Lives in App so both QuestScreen (Level 1 UI) and LoveNotesButton
 * (the floating objects + storybook modal) read the same state.
 */
export const TOTAL_COLLECTIBLES = 29;

export default function useCollectibles() {
  const [collectedIds, setCollectedIds] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCollectedIds(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const persist = useCallback((ids) => {
    setCollectedIds(ids);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const collect = useCallback((id) => {
    setCollectedIds((prev) => {
      if (prev.includes(id)) return prev;
      const nextIds = [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
      } catch (e) {
        console.error(e);
      }
      return nextIds;
    });
  }, []);

  const reset = useCallback(() => persist([]), [persist]);

  return {
    collectedIds,
    collectedCount: collectedIds.length,
    isQuestComplete: collectedIds.length >= TOTAL_COLLECTIBLES,
    collect,
    reset,
  };
}
