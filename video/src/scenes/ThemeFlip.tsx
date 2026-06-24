import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, SANS } from '../theme';
import { useFade } from '../ui';

const Tag: React.FC<{ side: 'left' | 'right'; label: string; op: number }> = ({ side, label, op }) => (
  <div style={{ position: 'absolute', bottom: 70, [side]: 84, opacity: op, padding: '12px 26px', borderRadius: 999, background: 'rgba(10,19,16,0.72)', border: `1px solid ${C.surfaceLine}`, backdropFilter: 'blur(4px)', fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.cream, letterSpacing: 1 }}>
    {label}
  </div>
);

export const ThemeFlip = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useFade(60, 8, 12);

  const s = spring({ frame: f, fps, config: { damping: 18, mass: 0.9 } });
  const p = interpolate(s, [0, 1], [110, 45]); // diagonal split position (%)
  const tagOp = interpolate(f, [18, 32], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fade, backgroundColor: C.bg }}>
      {/* light theme base */}
      <Img src={staticFile('product-1.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* dark theme revealed by a diagonal wipe */}
      <AbsoluteFill style={{ clipPath: `polygon(${p}% 0, 100% 0, 100% 100%, ${p - 12}% 100%)` }}>
        <Img src={staticFile('product-5.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* glowing seam */}
      <div style={{ position: 'absolute', top: '-10%', left: `${p - 6}%`, height: '120%', width: 10, transform: 'skewX(-6deg)', background: `linear-gradient(to bottom, transparent, ${C.gold}, transparent)`, boxShadow: `0 0 40px 8px rgba(231,180,90,0.5)` }} />

      <Tag side="left" label="Light" op={tagOp} />
      <Tag side="right" label="Dark" op={tagOp} />
    </AbsoluteFill>
  );
};
