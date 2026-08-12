import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { palette } from '../data/theme';

/**
 * Replaces the flat sticker grid on Level 1.
 *
 * The 29 collectibles are 29 stars laid out on a parametric heart curve.
 * Collecting an object lights its star; when two neighbouring stars are both
 * lit the line between them is drawn — so the heart literally draws itself
 * as they find the objects, and the last object closes the outline.
 */
const VIEW_W = 200;
const VIEW_H = 150;

/**
 * @param showHeader  false for the phone's background constellation, which is
 *   scenery rather than a readout and shouldn't carry a label.
 * @param drawStep  seconds of delay per segment. Non-zero makes the outline
 *   draw itself around the loop instead of all at once — used by the
 *   completion celebration, where the drawing *is* the moment.
 */
export default function ConstellationBook({ total = 29, collectedIds = [], showHeader = true, drawStep = 0 }) {
  const points = useMemo(() => buildHeartPoints(total), [total]);
  const collected = new Set(collectedIds);

  return (
    <div className="relative">
      {showHeader && (
        <div className="mb-2 flex items-baseline justify-between">
          <p className="text-[10px] uppercase tracking-[0.18em] text-rose-muted">Your constellation</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-rose-muted/70">
            {collectedIds.length === total ? 'Complete' : `${total - collectedIds.length} stars dark`}
          </p>
        </div>
      )}

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        role="img"
        aria-label={`Constellation: ${collectedIds.length} of ${total} stars lit`}
      >
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor={palette.goldGlow} stopOpacity="0.9" />
            <stop offset="100%" stopColor={palette.goldGlow} stopOpacity="0" />
          </radialGradient>
          <filter id="starBlur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>

        {/* Faint guide outline of the full shape — a hint of what they're building */}
        <path
          d={`${points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')} Z`}
          fill="none"
          stroke={palette.line}
          strokeWidth="0.6"
          strokeDasharray="2 3"
          opacity="0.55"
        />

        {/* Lines appear only between two lit neighbours */}
        {points.map((point, index) => {
          const next = points[(index + 1) % points.length];
          const bothLit = collected.has(point.id) && collected.has(next.id);
          if (!bothLit) return null;

          return (
            <motion.line
              key={`line-${point.id}`}
              x1={point.x}
              y1={point.y}
              x2={next.x}
              y2={next.y}
              stroke={palette.goldLight}
              strokeWidth="0.9"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.85 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: index * drawStep }}
              style={{ filter: 'drop-shadow(0 0 2px rgba(224,196,138,0.8))' }}
            />
          );
        })}

        {/* Stars */}
        {points.map((point, index) => {
          const isLit = collected.has(point.id);

          return (
            <g key={point.id}>
              {isLit && (
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="url(#starGlow)"
                  filter="url(#starBlur)"
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: [0.35, 0.7, 0.35], scale: 1 }}
                  transition={{
                    opacity: {
                      duration: 3 + (index % 4),
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * drawStep,
                    },
                    scale: { duration: 0.5, ease: 'backOut', delay: index * drawStep },
                  }}
                />
              )}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={isLit ? 1.9 : 1.1}
                fill={isLit ? palette.goldGlow : palette.line}
                stroke={isLit ? palette.goldLight : 'transparent'}
                strokeWidth="0.5"
                initial={false}
                animate={{ r: isLit ? 1.9 : 1.1 }}
                transition={{ duration: 0.4, ease: 'backOut' }}
              >
                <title>{isLit ? `Star ${point.id} — found` : `Star ${point.id} — still dark`}</title>
              </motion.circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Classic parametric heart, sampled `count` times and normalised into the
 * viewBox with padding. Deterministic — same layout on every render.
 */
function buildHeartPoints(count) {
  const raw = Array.from({ length: count }, (_, i) => {
    // Offset so star 1 lands on the bottom point of the heart
    const t = Math.PI + (i / count) * Math.PI * 2;
    return {
      id: i + 1,
      x: 16 * Math.sin(t) ** 3,
      y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    };
  });

  const xs = raw.map((p) => p.x);
  const ys = raw.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const padX = 14;
  const padY = 12;
  const scaleX = (VIEW_W - padX * 2) / (maxX - minX);
  const scaleY = (VIEW_H - padY * 2) / (maxY - minY);
  const scale = Math.min(scaleX, scaleY);
  const offsetX = (VIEW_W - (maxX - minX) * scale) / 2;
  const offsetY = (VIEW_H - (maxY - minY) * scale) / 2;

  return raw.map((p) => ({
    id: p.id,
    x: (p.x - minX) * scale + offsetX,
    y: (p.y - minY) * scale + offsetY,
  }));
}
