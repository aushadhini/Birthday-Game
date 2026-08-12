import { useEffect, useState } from 'react';

import { ANCHOR, questAnchor } from '../data/collectibleLayout';

/**
 * True on the viewports that get the phone layout — the same test Level 1 uses
 * to pick its HUD bar, so "mobile" means one thing across the app. A CSS
 * breakpoint alone would miss a landscape phone, which is wide but very short.
 */
const read = () =>
  typeof window === 'undefined'
    ? false
    : questAnchor(window.innerWidth, window.innerHeight) === ANCHOR.TOP;

export default function useIsPhone() {
  const [isPhone, setIsPhone] = useState(read);

  useEffect(() => {
    const update = () => setIsPhone(read());
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return isPhone;
}
