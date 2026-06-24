import { Composition } from 'remotion';
import { StayTrack } from './StayTrack';

export const RemotionRoot = () => (
  <Composition
    id="StayTrack"
    component={StayTrack}
    durationInFrames={1110}
    fps={30}
    width={1920}
    height={1080}
  />
);
