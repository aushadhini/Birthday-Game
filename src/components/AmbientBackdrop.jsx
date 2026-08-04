import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * The room the whole game sits in — mounted once above the screen router so
 * the atmosphere never restarts on a screen change.
 *
 * Four stacked layers, back to front:
 *   1. slow-drifting aurora blooms (gold / rose / deep blue)
 *   2. a three-depth starfield that twinkles and parallaxes with the pointer
 *   3. film grain
 *   4. vignette
 */
export default function AmbientBackdrop() {
  const reduceMotion = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  // Deterministic starfield — a seeded pseudo-random so it never reshuffles.
  const stars = useMemo(() => {
    let seed = 20260814;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    return Array.from({ length: 110 }, (_, i) => {
      const depth = i % 3; // 0 = far, 2 = near
      return {
        id: i,
        depth,
        top: rand() * 100,
        left: rand() * 100,
        size: 0.7 + depth * 0.55 + rand() * 0.6,
        baseOpacity: 0.18 + depth * 0.16 + rand() * 0.2,
        twinkle: 2.6 + rand() * 4.5,
        delay: rand() * 5,
        warm: rand() > 0.72, // a few champagne-tinted stars
      };
    });
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    // Pointer parallax only makes sense with a real pointer
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (e) => {
      setPointer({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduceMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* 1 — Aurora blooms */}
      {!reduceMotion && (
        <>
          <motion.div
            className="absolute -left-[15%] -top-[10%] h-[55vmax] w-[55vmax] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(201,168,108,0.16) 0%, transparent 62%)',
              filter: 'blur(30px)',
            }}
            animate={{ x: [0, 60, -30, 0], y: [0, 40, 20, 0], scale: [1, 1.08, 0.96, 1] }}
            transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -right-[12%] top-[8%] h-[45vmax] w-[45vmax] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(240,168,184,0.13) 0%, transparent 60%)',
              filter: 'blur(34px)',
            }}
            animate={{ x: [0, -50, 25, 0], y: [0, 55, -20, 0], scale: [1, 1.05, 1.1, 1] }}
            transition={{ duration: 41, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[-18%] left-[20%] h-[60vmax] w-[60vmax] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(40,70,120,0.3) 0%, transparent 62%)',
              filter: 'blur(40px)',
            }}
            animate={{ x: [0, 40, -45, 0], y: [0, -30, 15, 0] }}
            transition={{ duration: 47, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* 2 — Starfield: three depth layers, each parallaxing as one element.
             Twinkle is a CSS animation so nothing runs per-star in JS. */}
      {[0, 1, 2].map((depth) => {
        const shift = (depth + 1) * 6; // near stars travel further
        return (
          <motion.div
            key={depth}
            className="absolute inset-0"
            animate={{
              x: reduceMotion ? 0 : pointer.x * -shift,
              y: reduceMotion ? 0 : pointer.y * -shift,
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 60, mass: 1.2 }}
          >
            {stars
              .filter((star) => star.depth === depth)
              .map((star) => (
                <span
                  key={star.id}
                  className={`star${star.warm ? ' star-warm' : ''}${depth === 2 ? ' star-near' : ''}`}
                  style={{
                    top: `${star.top}%`,
                    left: `${star.left}%`,
                    width: star.size,
                    height: star.size,
                    '--tw-dur': `${star.twinkle}s`,
                    '--tw-delay': `${star.delay}s`,
                    '--tw-min': star.baseOpacity,
                    '--tw-max': Math.min(1, star.baseOpacity * 1.9),
                  }}
                />
              ))}
          </motion.div>
        );
      })}

      {/* 3 — Film grain */}
      <div className="layer-grain absolute inset-0" />

      {/* 4 — Vignette */}
      <div className="layer-vignette absolute inset-0" />
    </div>
  );
}
