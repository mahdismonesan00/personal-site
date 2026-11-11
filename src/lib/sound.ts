/**
 * Tiny WebAudio synth — every sound is tied to something visible on screen
 * (heart pop, quiz answer, lap complete, chat reply, UI commit).
 * Enabled by default, one global mute in the header. No loops, no ambience.
 */
const KEY = "mm.sound";
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;
const listeners = new Set<(on: boolean) => void>();

try {
  const stored = localStorage.getItem(KEY);
  if (stored !== null) enabled = stored === "1";
} catch {
  /* storage blocked */
}

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.16;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function soundEnabled() {
  return enabled;
}

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l(on));
  if (on) play("on");
}

export function onSoundChange(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

type Voice = { f: number; to?: number; d: number; type?: OscillatorType; gain?: number; delay?: number };

const RECIPES: Record<string, Voice[]> = {
  tap: [{ f: 620, to: 720, d: 0.06, type: "triangle", gain: 0.5 }],
  on: [{ f: 520, to: 880, d: 0.12, type: "sine", gain: 0.6 }],
  heart: [
    { f: 660, to: 990, d: 0.1, type: "sine", gain: 0.8 },
    { f: 990, to: 1320, d: 0.12, type: "sine", gain: 0.5, delay: 0.07 },
  ],
  unheart: [{ f: 520, to: 300, d: 0.12, type: "sine", gain: 0.5 }],
  correct: [
    { f: 740, d: 0.09, type: "triangle", gain: 0.7 },
    { f: 988, d: 0.1, type: "triangle", gain: 0.7, delay: 0.08 },
    { f: 1319, d: 0.16, type: "triangle", gain: 0.6, delay: 0.16 },
  ],
  wrong: [
    { f: 220, to: 150, d: 0.22, type: "sawtooth", gain: 0.35 },
    { f: 160, to: 110, d: 0.26, type: "square", gain: 0.16, delay: 0.05 },
  ],
  tick: [{ f: 1400, d: 0.03, type: "square", gain: 0.16 }],
  lap: [
    { f: 880, d: 0.08, type: "square", gain: 0.35 },
    { f: 1175, d: 0.09, type: "square", gain: 0.35, delay: 0.07 },
    { f: 1568, d: 0.18, type: "square", gain: 0.3, delay: 0.14 },
  ],
  message: [
    { f: 880, to: 1180, d: 0.09, type: "sine", gain: 0.5 },
    { f: 1180, d: 0.1, type: "sine", gain: 0.35, delay: 0.08 },
  ],
  badge: [
    { f: 659, d: 0.1, type: "triangle", gain: 0.6 },
    { f: 880, d: 0.1, type: "triangle", gain: 0.6, delay: 0.09 },
    { f: 1047, d: 0.12, type: "triangle", gain: 0.6, delay: 0.18 },
    { f: 1568, d: 0.28, type: "triangle", gain: 0.5, delay: 0.27 },
  ],
  whoosh: [{ f: 180, to: 900, d: 0.18, type: "sine", gain: 0.28 }],
};

export function play(name: keyof typeof RECIPES | string) {
  if (!enabled) return;
  const recipe = RECIPES[name];
  if (!recipe) return;
  const ac = ensure();
  if (!ac || !master) return;
  const now = ac.currentTime;
  for (const v of recipe) {
    const t0 = now + (v.delay ?? 0);
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = v.type ?? "sine";
    osc.frequency.setValueAtTime(v.f, t0);
    if (v.to) osc.frequency.exponentialRampToValueAtTime(Math.max(30, v.to), t0 + v.d);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, v.gain ?? 0.5), t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + v.d);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t0);
    osc.stop(t0 + v.d + 0.04);
  }
}