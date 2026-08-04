/**
 * Single source of truth for colours used inside SVG / inline styles.
 * CSS-side equivalents live in src/index.css (@theme block) — keep both in sync.
 *
 * Before this file existed the app ran two palettes at once: champagne gold
 * (#C9A86C) in the buttons/countdown and a brighter gold (#D4AF37) in the
 * collectibles, plus two different navies and two ivories. One palette only.
 */
export const palette = {
  gold: '#C9A86C',
  goldLight: '#E0C48A',
  goldGlow: '#F0D9A0',
  goldDeep: '#A8894E',

  ivory: '#F3EEE6',
  rose: '#F0A8B8',
  roseDeep: '#E891A8',

  navy: '#0B1220',
  navyMid: '#121C2E',
  navySoft: '#152238',
  line: '#2E3F5A',
};

/** rgba() helpers for glows — avoids hardcoding the same colour twice. */
export const goldAlpha = (a) => `rgba(201, 168, 108, ${a})`;
export const roseAlpha = (a) => `rgba(240, 168, 184, ${a})`;
export const navyAlpha = (a) => `rgba(11, 18, 32, ${a})`;
