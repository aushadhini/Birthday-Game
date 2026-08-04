import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '../data/config';

/**
 * "Us, so far" — a live ticker of how long you have been together, down to the
 * second, plus a running count of their heartbeats in that time. Set
 * `relationshipStart` in src/data/config.js.
 */
export default function TimeTogether() {
  const [elapsed, setElapsed] = useState(() => measure());

  useEffect(() => {
    if (!siteConfig.relationshipStart) return;
    const id = setInterval(() => setElapsed(measure()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!elapsed) return null;

  return (
    <div className="w-full max-w-md">
      <p className="mb-3 text-center text-[11px] uppercase tracking-[0.25em] text-rose-muted">
        Us, so far
      </p>

      <div className="rounded-2xl border border-rose-line/70 bg-white/[0.04] px-5 py-4 text-center shadow-soft backdrop-blur-sm">
        <p className="font-display text-xl leading-snug text-rose-ink sm:text-2xl">
          <span className="tabular text-rose-accent">{elapsed.years}</span> years,{' '}
          <span className="tabular text-rose-accent">{elapsed.months}</span> months,{' '}
          <span className="tabular text-rose-accent">{elapsed.days}</span> days
        </p>

        <p className="mt-2 text-xs tracking-wide text-rose-muted">
          <span className="tabular">{elapsed.totalDays.toLocaleString()}</span> days
        </p>

        <p className="mt-3 border-t border-rose-line/60 pt-3 text-[11px] leading-relaxed text-rose-muted/85">
          Your heart has beaten about{' '}
          <motion.span
            key={elapsed.heartbeats}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="tabular text-rose-accent"
          >
            {elapsed.heartbeats.toLocaleString()}
          </motion.span>{' '}
          times since then — and I have loved every single one.
        </p>
      </div>
    </div>
  );
}

function measure() {
  const start = parseLocalDate(siteConfig.relationshipStart);
  if (!start) return null;

  const now = new Date();
  if (now < start) return null;

  // Calendar-accurate years/months/days
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = now - start;
  const totalSeconds = Math.floor(diffMs / 1000);

  return {
    years,
    months,
    days,
    totalDays: Math.floor(diffMs / 86400000),
    // ~72 bpm, a gentle resting heart rate
    heartbeats: Math.floor((totalSeconds / 60) * 72),
  };
}

/**
 * `new Date('2021-02-14')` is parsed as UTC midnight, so west of Greenwich it
 * lands on the 13th at 19:00 local and every day/month figure below shifts by
 * one. Build the date from its parts instead so "the day we started" means
 * that day wherever they open this.
 */
function parseLocalDate(value) {
  if (!value) return null;

  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(value).trim());
  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
