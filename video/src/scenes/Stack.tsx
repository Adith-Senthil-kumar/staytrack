import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, SANS, SERIF } from '../theme';
import { Backdrop, useFade } from '../ui';

const BADGES = ['TypeScript', 'React Native', 'Expo SDK 56', 'Expo Router', 'NativeWind', 'Zustand', 'Firebase', 'Jest'];

export const Stack = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useFade(120, 10, 14);

  const headOp = interpolate(f, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const capOp = interpolate(f, [70, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: 'center', justifyContent: 'center', padding: '80px 110px' }}>
      <Backdrop />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div style={{ opacity: headOp, fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: C.gold, marginBottom: 14 }}>THE STACK</div>
      <div style={{ opacity: headOp, fontFamily: SERIF, fontWeight: 700, fontSize: 58, color: C.cream, marginBottom: 52 }}>One codebase, end to end.</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, justifyContent: 'center', maxWidth: 1340 }}>
        {BADGES.map((b, i) => {
          const s = spring({ frame: f - 14 - i * 5, fps, config: { damping: 16, mass: 0.7 } });
          return (
            <div key={b} style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px) scale(${interpolate(s, [0, 1], [0.9, 1])})`, display: 'flex', alignItems: 'center', gap: 16, padding: '20px 34px', borderRadius: 999, background: C.surface, border: `1px solid ${C.surfaceLine}` }}>
              <div style={{ width: 13, height: 13, borderRadius: 99, background: C.teal }} />
              <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, color: C.cream }}>{b}</span>
            </div>
          );
        })}
      </div>

      <div style={{ opacity: capOp, marginTop: 56, fontFamily: SANS, fontWeight: 400, fontSize: 36, color: C.muted }}>
        7 functional modules · one codebase · web + mobile.
      </div>
      </div>
    </AbsoluteFill>
  );
};
