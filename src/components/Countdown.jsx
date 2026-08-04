import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '../data/config';

/**
 * Live countdown to Adeesha's birthday (August 14).
 * If the date has passed this year, it targets next year's birthday.
 */
export default function Countdown() {
  const [remaining, setRemaining] = useState(getRemaining());

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  if (remaining.isToday) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-display text-2xl text-rose-ink md:text-3xl">
          It&apos;s your birthday today
        </p>
        <p className="mt-1 text-sm text-rose-muted">Let the celebration begin</p>
      </motion.div>
    );
  }

  const units = [
    { label: 'Days', value: remaining.days },
    { label: 'Hours', value: remaining.hours },
    { label: 'Mins', value: remaining.minutes },
    { label: 'Secs', value: remaining.seconds },
  ];

  return (
    <div className="w-full max-w-md">
      <p className="mb-3 text-center text-xs uppercase tracking-[0.25em] text-rose-muted">
        Countdown to August 14
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((unit) => (
          <div key={unit.label} className="text-center">
            <div className="rounded-2xl border border-rose-line/80 bg-white/5 px-2 py-3 shadow-soft backdrop-blur-sm">
              <motion.span
                key={unit.value}
                initial={{ opacity: 0.4, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-2xl text-rose-accent sm:text-3xl"
              >
                {String(unit.value).padStart(2, '0')}
              </motion.span>
            </div>
            <p className="mt-1.5 text-[10px] uppercase tracking-widest text-rose-muted">
              {unit.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getRemaining() {
  const now = new Date();
  let target = new Date(
    now.getFullYear(),
    siteConfig.birthdayMonth,
    siteConfig.birthdayDay,
    0,
    0,
    0,
  );

  // After birthday night, roll to next year
  if (now > new Date(target.getTime() + 24 * 60 * 60 * 1000 - 1)) {
    target = new Date(
      now.getFullYear() + 1,
      siteConfig.birthdayMonth,
      siteConfig.birthdayDay,
      0,
      0,
      0,
    );
  }

  const diff = target - now;
  const isToday =
    now.getMonth() === siteConfig.birthdayMonth &&
    now.getDate() === siteConfig.birthdayDay;

  if (isToday || diff <= 0) {
    return { isToday: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { isToday: false, days, hours, minutes, seconds };
}
