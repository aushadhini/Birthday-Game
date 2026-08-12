import { useState } from 'react';
import { motion } from 'framer-motion';
import { memories } from '../data/memories';

/**
 * Memory gallery — midnight romantic presentation.
 * Add photos via src/data/memories.js and /public/photos/
 */
export default function PhotoGallery({ onBack }) {
  // Photos not added to /public/photos/ yet fall back to the gradient card.
  const [missing, setMissing] = useState([]);

  return (
    <section className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 text-sm text-rose-muted transition hover:text-rose-accent"
        >
          ← Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-[0.28em] text-rose-accent">Our story</p>
          <h2 className="mt-2 font-display text-3xl text-rose-ink sm:text-4xl">
            📸 Our Memories
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-rose-muted">
            Moments that still feel warm. 
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {memories.map((memory, i) => {
            const showPhoto = memory.src && !missing.includes(memory.id);

            return (
              <motion.article
                key={memory.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-rose-line bg-white/5 shadow-soft backdrop-blur-sm"
              >
                {showPhoto ? (
                  <img
                    src={memory.src}
                    alt={memory.title}
                    onError={() =>
                      setMissing((prev) =>
                        prev.includes(memory.id) ? prev : [...prev, memory.id],
                      )
                    }
                    className="aspect-[4/5] w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex aspect-[4/5] w-full items-end p-5"
                    style={{
                      background: `linear-gradient(160deg, ${memory.accent} 0%, #0B1220 100%)`,
                    }}
                  >
                    <span className="text-soft-rose/80">♥</span>
                  </div>
                )}
                <div className="flex flex-1 flex-col px-4 py-4">
                  <h3 className="font-display text-xl text-rose-ink">{memory.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-rose-muted">
                    {memory.caption}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
