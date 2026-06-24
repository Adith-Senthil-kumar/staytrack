import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { C } from './theme';

// Fade in/out to the scene background so transitions never flash black.
export const useFade = (dur: number, inF = 10, outF = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [0, inF, dur - outF, dur], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const Glow: React.FC<{ x?: string; y?: string; color?: string; spread?: number }> = ({
  x = '50%',
  y = '44%',
  color = 'rgba(30,111,92,0.55)',
  spread = 46,
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(circle at ${x} ${y}, ${color} 0%, transparent ${spread}%)`,
    }}
  />
);

// Faint diagonal-gradient backdrop used on text scenes (matches the logo gradient).
export const Backdrop: React.FC = () => (
  <>
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${C.bg2} 0%, ${C.bg} 60%)` }} />
    <Glow color="rgba(30,111,92,0.4)" x="22%" y="30%" spread={50} />
    <Glow color="rgba(231,180,90,0.10)" x="82%" y="78%" spread={42} />
  </>
);
