import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, MONO, SANS, SERIF } from '../theme';
import { Backdrop, useFade } from '../ui';

const LinkRow: React.FC<{ label: string; value: string; op: number; delay: number }> = ({ label, value, op }) => (
  <div style={{ opacity: op, transform: `translateY(${interpolate(op, [0, 1], [16, 0])}px)`, display: 'flex', alignItems: 'center', gap: 22 }}>
    <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: C.gold, width: 168, textAlign: 'right' }}>{label}</span>
    <span style={{ width: 1, height: 30, background: C.surfaceLine }} />
    <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 32, color: C.cream }}>{value}</span>
  </div>
);

export const CTA = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useFade(120, 12, 16);

  const pop = spring({ frame: f, fps, config: { damping: 16, mass: 0.8 } });
  const nameY = interpolate(pop, [0, 1], [24, 0]);
  const tagOp = interpolate(f, [18, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ruleW = interpolate(spring({ frame: f - 10, fps, config: { damping: 20 } }), [0, 1], [0, 260]);
  const l1 = interpolate(f, [36, 52], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const l2 = interpolate(f, [46, 62], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: 'center', justifyContent: 'center' }}>
      <Backdrop />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', transform: `scale(${interpolate(pop, [0, 1], [0.7, 1])})`, opacity: pop }}>
          <div style={{ position: 'absolute', inset: -60, background: 'radial-gradient(circle, rgba(30,111,92,0.45) 0%, transparent 62%)' }} />
          <Img src={staticFile('staytrack-logo.png')} style={{ width: 108, height: 108, borderRadius: 26, position: 'relative' }} />
        </div>

        <div style={{ opacity: pop, transform: `translateY(${nameY}px)`, marginTop: 30, fontFamily: SERIF, fontWeight: 700, fontSize: 92, color: C.cream, letterSpacing: -1 }}>Adith</div>

        <div style={{ width: ruleW, height: 3, borderRadius: 2, background: C.gold, marginTop: 8 }} />

        <div style={{ opacity: tagOp, marginTop: 22, fontFamily: SANS, fontWeight: 400, fontSize: 38, color: C.muted }}>Designed &amp; built solo.</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 56 }}>
          <LinkRow label="LIVE DEMO" value="staytrack-ca1ac.web.app" op={l1} delay={0} />
          <LinkRow label="PORTFOLIO" value="adith-senthil-kumar.github.io/my-portfolio" op={l2} delay={1} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
