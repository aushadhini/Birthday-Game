import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../data/config';
import { palette } from '../data/theme';
import { ageTurning } from '../data/birthdayMath';

/**
 * Blow out the candles — with your actual breath.
 *
 * Opens the microphone, watches for the low-frequency broadband rush that a
 * puff of air makes (a blow is loud AND bass-heavy, unlike speech or music),
 * and snuffs one candle at a time while they keep blowing.
 *
 * Nothing is recorded, nothing leaves the device, and the stream is torn down
 * the moment the candles are out or the component unmounts. There's a tap
 * fallback for browsers/devices that refuse the mic.
 */
const BLOW_THRESHOLD = 0.16; // normalised low-band energy
const SNUFF_INTERVAL = 170; // ms between snuffs — a hard blow takes several at once

export default function CandleBlowOut({ onAllOut }) {
  // One candle per year, unless config overrides it
  const candleCount = siteConfig.candleCount ?? ageTurning() ?? 12;

  const [lit, setLit] = useState(() => Array.from({ length: candleCount }, () => true));
  const [micState, setMicState] = useState('idle'); // idle | asking | live | denied | unsupported
  const [blowStrength, setBlowStrength] = useState(0);
  const [wishMade, setWishMade] = useState(false);

  const audioRef = useRef({ ctx: null, stream: null, raf: null, lastSnuff: 0 });
  const litRef = useRef(lit);
  litRef.current = lit;

  const allOut = lit.every((flame) => !flame);

  const teardown = useCallback(() => {
    const audio = audioRef.current;
    if (audio.raf) cancelAnimationFrame(audio.raf);
    audio.raf = null;
    audio.stream?.getTracks().forEach((track) => track.stop());
    audio.stream = null;
    if (audio.ctx && audio.ctx.state !== 'closed') audio.ctx.close();
    audio.ctx = null;
    setBlowStrength(0);
  }, []);

  useEffect(() => teardown, [teardown]);

  // Fire the celebration once, and close the mic — the moment is over.
  // The guard is load-bearing, not defensive: onAllOut is typically an inline
  // arrow, so it's a new identity on every parent render. Without the ref, the
  // parent re-rendering in response to this call re-runs the effect, which
  // calls it again — a render loop that never settles.
  const celebratedRef = useRef(false);
  useEffect(() => {
    if (!allOut || celebratedRef.current) return;
    celebratedRef.current = true;
    setWishMade(true);
    setMicState((state) => (state === 'live' ? 'idle' : state));
    teardown();
    onAllOut?.();
  }, [allOut, onAllOut, teardown]);

  /** Snuff `count` candles at once — a harder blow takes out more of them. */
  const snuff = useCallback((count = 1) => {
    setLit((prev) => {
      if (!prev.some(Boolean)) return prev;
      const next = [...prev];
      let remaining = count;
      for (let i = 0; i < next.length && remaining > 0; i++) {
        if (next[i]) {
          next[i] = false;
          remaining--;
        }
      }
      return next;
    });
    if (navigator.vibrate) navigator.vibrate(18);
  }, []);

  const startListening = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || !(window.AudioContext || window.webkitAudioContext)) {
      setMicState('unsupported');
      return;
    }

    setMicState('asking');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false, // noise suppression eats the puff of air
          autoGainControl: false,
        },
      });

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.55;
      source.connect(analyser);

      audioRef.current.ctx = ctx;
      audioRef.current.stream = stream;
      setMicState('live');

      const freqData = new Uint8Array(analyser.frequencyBinCount);
      const timeData = new Uint8Array(analyser.fftSize);
      const binHz = ctx.sampleRate / analyser.fftSize;
      const lowBins = Math.max(4, Math.round(350 / binHz)); // ~0–350 Hz
      const highStart = Math.round(2000 / binHz);

      const tick = () => {
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(timeData);

        // Overall loudness (RMS around the 128 midpoint)
        let sumSquares = 0;
        for (let i = 0; i < timeData.length; i++) {
          const v = (timeData[i] - 128) / 128;
          sumSquares += v * v;
        }
        const rms = Math.sqrt(sumSquares / timeData.length);

        // Energy split: breath is bottom-heavy, speech/music has far more top end
        let low = 0;
        for (let i = 0; i < lowBins; i++) low += freqData[i];
        low /= lowBins * 255;

        let high = 0;
        let highCount = 0;
        for (let i = highStart; i < freqData.length; i++) {
          high += freqData[i];
          highCount++;
        }
        high = highCount ? high / (highCount * 255) : 0;

        const isBreath = low > high * 1.6;
        const strength = isBreath ? Math.min(1, low * 1.35 + rms * 1.1) : rms * 0.25;
        setBlowStrength(strength);

        const now = performance.now();
        if (
          strength > BLOW_THRESHOLD &&
          isBreath &&
          now - audioRef.current.lastSnuff > SNUFF_INTERVAL &&
          litRef.current.some(Boolean)
        ) {
          audioRef.current.lastSnuff = now;
          // Scale with lung power: a gentle puff takes one, a real blow sweeps
          // several — otherwise 29 candles would need ~10s of solid blowing.
          snuff(1 + Math.floor((strength / BLOW_THRESHOLD - 1) * 2));
        }

        audioRef.current.raf = requestAnimationFrame(tick);
      };

      audioRef.current.raf = requestAnimationFrame(tick);
    } catch {
      setMicState('denied');
      teardown();
    }
  }, [snuff, teardown]);

  const litCount = lit.filter(Boolean).length;

  /**
   * Candle placement. Odd indices go to a back row that sits slightly higher
   * and burns smaller, so 29 candles read as a crowded real cake instead of a
   * smear of overlapping flames. Alternating rows also means they go out in a
   * pleasing zigzag rather than sweeping left to right.
   */
  const candles = useMemo(() => {
    const front = [];
    const back = [];
    for (let i = 0; i < candleCount; i++) (i % 2 ? back : front).push(i);

    const place = (indices, baseY, x0, x1, isBack) =>
      indices.map((index, position) => ({
        index,
        isBack,
        baseY,
        x:
          indices.length === 1
            ? (x0 + x1) / 2
            : x0 + (position * (x1 - x0)) / (indices.length - 1),
      }));

    // Back row drawn first so the front row overlaps it. The y values sit on
    // the far and near rims of the tier's elliptical top (cy 84, ry 5.5).
    return [
      ...place(back, 80.5, 32, 168, true),
      ...place(front, 87.5, 24, 176, false),
    ];
  }, [candleCount]);

  return (
    <div className="w-full">
      {/* ── The cake ── */}
      <div className="relative mx-auto w-full max-w-xs">
        <svg viewBox="0 0 200 150" className="w-full" role="img" aria-label={`Birthday cake with ${litCount} candles still lit`}>
          <defs>
            <linearGradient id="cakeTier" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A3A56" />
              <stop offset="100%" stopColor="#16233A" />
            </linearGradient>
            <linearGradient id="cakeIcing" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={palette.goldDeep} />
              <stop offset="45%" stopColor={palette.goldGlow} />
              <stop offset="100%" stopColor={palette.gold} />
            </linearGradient>
            <radialGradient id="flameGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#FFE9A8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFB347" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Candles + flames */}
          {candles.map(({ index, x, baseY, isBack }) => {
            const isLit = lit[index];
            const height = isBack ? 15 : 17;
            const candleTop = baseY - height;
            const wax = isBack ? 2.2 : 2.6;
            const flame = isBack ? 0.82 : 1;

            return (
              <g key={index} opacity={isBack ? 0.88 : 1}>
                {/* Wax */}
                <rect
                  x={x - wax / 2}
                  y={candleTop}
                  width={wax}
                  height={height}
                  rx={wax / 2}
                  fill={index % 3 === 0 ? palette.rose : palette.ivory}
                  opacity="0.9"
                />
                {/* Wick */}
                <path d={`M${x} ${candleTop} v-2`} stroke="#5A5040" strokeWidth="0.7" />

                <AnimatePresence>
                  {isLit && (
                    <motion.g
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.2, y: -4 }}
                      transition={{ duration: 0.35 }}
                      style={{ transformOrigin: `${x}px ${candleTop - 3}px` }}
                    >
                      <circle cx={x} cy={candleTop - 4} r={5 * flame} fill="url(#flameGlow)" />
                      <motion.path
                        d={`M${x} ${candleTop - 8 * flame} C${x + 2 * flame} ${candleTop - 5 * flame} ${x + 1.7 * flame} ${candleTop - 1.6} ${x} ${candleTop - 1.6} C${x - 1.7 * flame} ${candleTop - 1.6} ${x - 2 * flame} ${candleTop - 5 * flame} ${x} ${candleTop - 8 * flame} Z`}
                        fill="#FFD27A"
                        animate={{
                          scaleY: [1, 1.18, 0.92, 1],
                          scaleX: [1, 0.9, 1.08, 1],
                          x: [0, 0.6, -0.5, 0],
                        }}
                        transition={{
                          duration: 0.85 + (index % 5) * 0.13,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        style={{ transformOrigin: `${x}px ${candleTop - 1.6}px` }}
                      />
                    </motion.g>
                  )}
                  {/* Wisp of smoke as it goes out */}
                  {!isLit && (
                    <motion.path
                      key={`smoke-${index}`}
                      d={`M${x} ${candleTop - 3} c1.6 -4 -2.4 -6.5 0 -11`}
                      stroke="#8B93A6"
                      strokeWidth="0.9"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ opacity: 0.5, y: 0 }}
                      animate={{ opacity: 0, y: -13 }}
                      transition={{ duration: 1.6, ease: 'easeOut' }}
                    />
                  )}
                </AnimatePresence>
              </g>
            );
          })}

          {/* Top tier — the elliptical top gives the back row of candles a
              surface to stand on instead of floating above a flat edge */}
          <rect x="18" y="84" width="164" height="26" fill="url(#cakeTier)" />
          <ellipse cx="100" cy="84" rx="82" ry="5.5" fill="#22314C" stroke={palette.gold} strokeWidth="0.7" />
          <path d="M18 84 v26 h164 V84" fill="none" stroke={palette.gold} strokeWidth="0.7" />
          <path d="M18 88 q12 8 24 0 q12 8 24 0 q12 8 24 0 q12 8 24 0 q12 8 24 0 q12 8 24 0 v-6 H18 Z" fill="url(#cakeIcing)" opacity="0.85" />
          {/* Bottom tier */}
          <rect x="8" y="110" width="184" height="30" rx="6" fill="url(#cakeTier)" stroke={palette.gold} strokeWidth="0.7" />
          <path d="M8 114 q14 9 28 0 q14 9 28 0 q14 9 28 0 q14 9 28 0 q14 9 28 0 q14 9 28 0 v-6 H8 Z" fill="url(#cakeIcing)" opacity="0.7" />
          {/* Plate */}
          <ellipse cx="100" cy="143" rx="96" ry="5" fill={palette.gold} opacity="0.22" />
        </svg>
      </div>

      {/* ── Controls / state ── */}
      <div className="mt-4 text-center">
        <AnimatePresence mode="wait">
          {wishMade ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              <p className="font-display text-xl text-foil">Every candle out. Every wish yours.</p>
              <p className="text-xs text-rose-muted">
                I hope this year gives you everything you just wished for.
              </p>
            </motion.div>
          ) : micState === 'live' ? (
            <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <p className="text-sm text-rose-ink">Now blow — softly, like you mean it 🕯️</p>
              {/* Live breath meter */}
              <div className="mx-auto h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${palette.gold}, ${palette.goldGlow})`,
                  }}
                  animate={{ width: `${Math.min(100, blowStrength * 100 / BLOW_THRESHOLD / 1.2)}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <p className="text-[11px] text-rose-muted">
                {litCount} candle{litCount === 1 ? '' : 's'} left · nothing is recorded
              </p>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <p className="text-sm text-rose-muted">
                {micState === 'denied'
                  ? 'No microphone, no problem — tap the candles out instead.'
                  : micState === 'unsupported'
                    ? 'This browser will not share a microphone — tap the candles out instead.'
                    : `${candleCount} candles, one for every year. Make a wish, ${siteConfig.recipientName} — you can really blow these out.`}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {micState !== 'denied' && micState !== 'unsupported' && (
                  <button type="button" onClick={startListening} className="btn-primary" disabled={micState === 'asking'}>
                    {micState === 'asking' ? 'Waiting for the mic…' : 'Blow out the candles'}
                  </button>
                )}
                {/* 29 candles would be 29 taps — take a handful per press */}
                <button type="button" onClick={() => snuff(4)} className="btn-ghost">
                  {litCount > 4 ? 'Snuff them by hand' : 'Snuff the last few'}
                </button>
              </div>
              {micState === 'idle' && (
                <p className="text-[11px] text-rose-muted/70">
                  Your browser will ask for the microphone. Nothing is recorded or sent anywhere.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
