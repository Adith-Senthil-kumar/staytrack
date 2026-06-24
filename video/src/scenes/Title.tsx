import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, SANS, SERIF } from '../theme';
import { Backdrop, useFade } from '../ui';

export const Title = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useFade(90, 8, 12);

  const pop = spring({ frame: f, fps, config: { damping: 14, mass: 0.8 } });
  const logoScale = interpolate(pop, [0, 1], [0.6, 1]);
  const titleY = interpolate(spring({ frame: f - 6, fps, config: { damping: 18 } }), [0, 1], [26, 0]);
  const subOp = interpolate(f, [22, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tagOp = interpolate(f, [34, 52], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: 'center', justifyContent: 'center' }}>
      <Backdrop />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <div style={{ position: 'relative', transform: `scale(${logoScale})` }}>
          <div style={{ position: 'absolute', inset: -90, background: 'radial-gradient(circle, rgba(30,111,92,0.5) 0%, transparent 60%)' }} />
          <Img src={staticFile('staytrack-logo.png')} style={{ width: 168, height: 168, borderRadius: 38, position: 'relative' }} />
        </div>
        <div style={{ transform: `translateY(${titleY}px)`, opacity: interpolate(pop, [0, 1], [0, 1]), fontFamily: SERIF, fontWeight: 700, fontSize: 104, color: C.cream, letterSpacing: -1 }}>
          StayTrack
        </div>
        <div style={{ opacity: subOp, fontFamily: SANS, fontWeight: 400, fontSize: 36, color: C.muted }}>
          Cross-platform property management, built end-to-end.
        </div>
        <div style={{ opacity: tagOp, marginTop: 10, fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.teal, letterSpacing: 2 }}>
          React Native · Expo · TypeScript · Firebase
        </div>
      </div>
    </AbsoluteFill>
  );
};
