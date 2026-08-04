import { useState } from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '../data/config';
import FloatingDecorations from './FloatingDecorations';

/**
 * Password gate — midnight romantic entry.
 * Password is configured in src/data/config.js
 */
export default function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const normalized = value.trim().toLowerCase().replace(/\s+/g, '');
    const expected = siteConfig.password.trim().toLowerCase().replace(/\s+/g, '');

    if (normalized === expected) {
      setError(false);
      onUnlock?.();
      return;
    }

    setError(true);
    setShaking(true);
    setTimeout(() => setShaking(false), 450);
  };

  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6">
      <FloatingDecorations />
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />

      <motion.form
        onSubmit={submit}
        animate={shaking ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.4em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.2 }}
          className="text-xs uppercase text-rose-accent"
        >
          Private invitation
        </motion.p>
        <h1 className="mt-3 font-display text-3xl text-rose-ink sm:text-4xl">
          Birthday Quest for Adeesha
        </h1>
        <p className="mt-3 text-sm text-rose-muted">{siteConfig.passwordHint}</p>

        <label className="mt-8 block">
          <span className="sr-only">Password</span>
          <input
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            autoComplete="off"
            placeholder="Enter the password"
            className="w-full rounded-2xl border border-rose-line bg-white/5 px-5 py-3.5 text-center text-rose-ink outline-none backdrop-blur-md transition placeholder:text-rose-muted/50 focus:border-rose-accent focus:ring-2 focus:ring-rose-accent/20"
          />
        </label>

        {error && (
          <p className="mt-3 text-sm text-soft-rose">Hmm, not quite. Try again.</p>
        )}

        <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
          Enter
        </button>
      </motion.form>
    </section>
  );
}
