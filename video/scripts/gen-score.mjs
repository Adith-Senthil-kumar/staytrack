// Synthesizes a subtle ambient score for the StayTrack video and writes it to
// public/score.wav. Pure Node, no dependencies — royalty-free by construction.
//
// Design: a slow evolving pad (A-minor family) whose chords crossfade at the
// scene boundaries, plus soft celesta accents on the cuts and low filtered-noise
// swells at the major section changes. Kept deliberately quiet — it's a bed.
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const SR = 44100;
const DUR = 35.2; // a hair past the 35.0s video; Remotion trims to composition
const N = Math.round(SR * DUR);
const L = new Float32Array(N);
const R = new Float32Array(N);
const TAU = Math.PI * 2;
const smooth = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };

// ---- chord pad ---------------------------------------------------------------
// note frequencies (Hz)
const F = { F2: 87.31, G2: 98.0, A2: 110.0, C3: 130.81, E3: 164.81, G3: 196.0, A3: 220.0, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63 };
const Am = [F.A2, F.E3, F.A3, F.C4, F.E4];
const Fmaj7 = [F.F2, F.A3, F.C4, F.E4];
const Cadd9 = [F.C3, F.E3, F.G3, F.C4, F.D4];
const Gmaj = [F.G2, F.G3, F.B3, F.D4];
const Gsus = [F.G2, F.G3, F.C4, F.D4];

// segments overlap (~0.5s) so attack/release envelopes crossfade the chords.
const SEGS = [
  { s: 0.0, e: 5.0, ch: Am },     // Title
  { s: 4.5, e: 9.0, ch: Fmaj7 },  // Tour
  { s: 8.5, e: 13.5, ch: Cadd9 },
  { s: 13.0, e: 17.5, ch: Gmaj }, // into Under the Hood
  { s: 17.0, e: 21.5, ch: Cadd9 },
  { s: 21.0, e: 25.5, ch: Fmaj7 },
  { s: 25.0, e: 29.5, ch: Am },   // Stack
  { s: 29.0, e: 31.5, ch: Gsus }, // Theme flip
  { s: 31.0, e: DUR, ch: Am },    // CTA resolve
];
const ATK = 0.9, REL = 1.0;
const arEnv = (lt, dur) => {
  if (lt < 0 || lt > dur) return 0;
  if (lt < ATK) return smooth(lt / ATK);
  if (lt > dur - REL) return smooth((dur - lt) / REL);
  return 1;
};

for (let i = 0; i < N; i++) {
  const t = i / SR;
  let l = 0, r = 0;
  for (let g = 0; g < SEGS.length; g++) {
    const seg = SEGS[g];
    if (t < seg.s || t > seg.e) continue;
    const env = arEnv(t - seg.s, seg.e - seg.s);
    if (env <= 0) continue;
    const breathe = 1 + 0.08 * Math.sin(TAU * 0.13 * t + g);
    const amp = 0.085 * env * breathe;
    for (let k = 0; k < seg.ch.length; k++) {
      const f = seg.ch[k];
      const oct = 0.10 * Math.sin(TAU * 2 * f * t);
      l += amp * (Math.sin(TAU * f * 1.0015 * t) + oct);
      r += amp * (Math.sin(TAU * f * 0.9985 * t) + oct);
    }
  }
  L[i] += l; R[i] += r;
}

// ---- celesta accents ---------------------------------------------------------
function pluck(te, freq, pan, amp) {
  const dur = 0.75;
  const th = (pan + 1) * Math.PI / 4; // equal-power pan
  const gL = Math.cos(th), gR = Math.sin(th);
  const i0 = Math.round(te * SR), i1 = Math.min(N, Math.round((te + dur) * SR));
  for (let i = i0; i < i1; i++) {
    const lt = (i - i0) / SR;
    const e = Math.exp(-lt * 5.5);
    const tone = Math.sin(TAU * freq * lt)
      + 0.35 * Math.sin(TAU * 2 * freq * lt) * Math.exp(-lt * 8)
      + 0.15 * Math.sin(TAU * 3 * freq * lt) * Math.exp(-lt * 12);
    const v = amp * e * tone;
    L[i] += v * gL; R[i] += v * gR;
  }
}

// ---- low swell (filtered noise) ---------------------------------------------
function swell(tw, amp) {
  const dur = 1.3;
  const i0 = Math.round(tw * SR), i1 = Math.min(N, Math.round((tw + dur) * SR));
  let y = 0, seed = (i0 % 9973) + 1;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff * 2 - 1; };
  for (let i = i0; i < i1; i++) {
    const lt = (i - i0) / SR;
    y += (rnd() - y) * 0.04; // one-pole low-pass → dull whoosh
    const env = smooth(Math.min(1, lt / 0.12)) * Math.exp(-Math.max(0, lt - 0.12) * 2.2);
    const v = amp * y * env;
    L[i] += v; R[i] += v;
  }
}

// A single soft "bloom" accent on the two brand reveals only — the opening
// title and the closing name. Slow 80ms attack + long ring so it settles into
// the pad rather than ticking like the old per-page celesta.
function chime(te, freq, amp) {
  const dur = 2.2;
  const i0 = Math.round(te * SR), i1 = Math.min(N, Math.round((te + dur) * SR));
  for (let i = i0; i < i1; i++) {
    const lt = (i - i0) / SR;
    const atk = smooth(Math.min(1, lt / 0.08));
    const dec = Math.exp(-lt * 2.2);
    const tone = Math.sin(TAU * freq * lt)
      + 0.40 * Math.sin(TAU * 2 * freq * lt) * Math.exp(-lt * 3)
      + 0.18 * Math.sin(TAU * 3 * freq * lt) * Math.exp(-lt * 5);
    const v = amp * atk * dec * tone;
    L[i] += v; R[i] += v;
  }
}
void pluck;
chime(1.1, 880.0, 0.12);   // opening title reveal (A5)
chime(31.3, 880.0, 0.11);  // closing name reveal (A5)
// soft swells at the MAJOR section boundaries (no per-page ticks)
[[3.0, 0.085], [15.0, 0.09], [25.0, 0.08], [29.0, 0.11], [31.0, 0.07]].forEach(([t, a]) => swell(t, a));

// ---- master: fades + soft-clip ----------------------------------------------
const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  let fade = 1;
  if (t < 1.5) fade = smooth(t / 1.5);
  if (t > 33.4) fade = Math.min(fade, smooth((34.9 - t) / 1.5));
  const sc = fade * 0.95;
  const lo = Math.tanh(L[i] * sc) * 0.62;
  const ro = Math.tanh(R[i] * sc) * 0.62;
  data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(lo * 32767))), i * 4);
  data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(ro * 32767))), i * 4 + 2);
}

// ---- WAV (PCM 16-bit stereo) -------------------------------------------------
const header = Buffer.alloc(44);
header.write('RIFF', 0); header.writeUInt32LE(36 + data.length, 4); header.write('WAVE', 8);
header.write('fmt ', 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22); header.writeUInt32LE(SR, 24); header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32); header.writeUInt16LE(16, 34);
header.write('data', 36); header.writeUInt32LE(data.length, 40);

const out = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'score.wav');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.concat([header, data]));
console.log(`wrote ${out} (${(data.length / 1e6).toFixed(1)} MB, ${DUR}s, ${N} frames)`);
