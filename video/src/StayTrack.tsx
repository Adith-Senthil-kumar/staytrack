import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { C } from './theme';
import { Title } from './scenes/Title';
import { Tour } from './scenes/Tour';
import { UnderHood } from './scenes/UnderHood';
import { Stack } from './scenes/Stack';
import { ThemeFlip } from './scenes/ThemeFlip';
import { CTA } from './scenes/CTA';

// 1110 frames @ 30fps = 37s
export const StayTrack = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Audio src={staticFile('music.wav')} />
    <Sequence durationInFrames={90}><Title /></Sequence>
    <Sequence from={90} durationInFrames={420}><Tour /></Sequence>
    <Sequence from={510} durationInFrames={300}><UnderHood /></Sequence>
    <Sequence from={810} durationInFrames={120}><Stack /></Sequence>
    <Sequence from={930} durationInFrames={60}><ThemeFlip /></Sequence>
    <Sequence from={990} durationInFrames={120}><CTA /></Sequence>
  </AbsoluteFill>
);
