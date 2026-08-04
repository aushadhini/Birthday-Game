import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Premium ambient décor — floating pink hearts + white sparkles.
 */
export default function FloatingDecorations({ density = 'normal' }) {
  const count = density === 'dense' ? 20 : 14;

  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const kind = i % 3 === 0 ? 'sparkle' : 'heart';
        return {
          id: i,
          kind,
          left: `${(i * 17 + 7) % 94}%`,
          delay: (i % 9) * 0.5,
          duration: 12 + (i % 6) * 1.6,
          size: kind === 'heart' ? 11 + (i % 5) * 3 : 5 + (i % 4) * 2,
          drift: (i % 2 === 0 ? 1 : -1) * (8 + (i % 5) * 4),
          // Soft pink hearts
          rose: ['#F0A8B8', '#FFB6C8', '#E891A8', '#F5C0CC'][i % 4],
        };
      }),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute bottom-[-8%] select-none"
          style={{
            left: item.left,
            width: item.size,
            height: item.size,
            color: item.kind === 'sparkle' ? '#FFFFFF' : item.rose,
            filter:
              item.kind === 'sparkle'
                ? 'drop-shadow(0 0 4px rgba(255,255,255,0.8))'
                : 'drop-shadow(0 0 6px rgba(240,168,184,0.45))',
          }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: ['0%', '-115vh'],
            x: [0, item.drift, -item.drift * 0.35, 0],
            opacity:
              item.kind === 'sparkle'
                ? [0, 0.9, 0.35, 0.85, 0]
                : [0, 0.55, 0.4, 0],
            scale: item.kind === 'sparkle' ? [0.6, 1.2, 0.8, 1.15, 0.5] : [1, 1.05, 1],
            rotate: [0, 10, -8, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {item.kind === 'heart' ? (
            <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
              <path d="M12 21s-7.2-4.6-9.4-8.6C1.2 9.6 2.6 6 6.2 6c1.9 0 3.4 1 4.3 2.3C11.4 7 12.9 6 14.8 6c3.6 0 5 3.6 3.6 6.4C19.2 16.4 12 21 12 21Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
              <path d="M12 2l1.2 7.3L20 12l-6.8 2.7L12 22l-1.2-7.3L4 12l6.8-2.7L12 2Z" />
            </svg>
          )}
        </motion.span>
      ))}
    </div>
  );
}
