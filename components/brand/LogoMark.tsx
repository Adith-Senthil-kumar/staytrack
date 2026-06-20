import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Polygon, Rect } from 'react-native-svg';

export function LogoMark({ size = 44 }: { size?: number }) {
  const radius = size * 0.25;
  return (
    <LinearGradient
      colors={['#1E6F5C', '#0E2E27']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: radius, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' }}
    >
      <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
        <Polygon points="12,3 17,9 7,9" fill="#E7B45A" />
        <Rect x={7.5} y={11} width={2.6} height={9} fill="#E7B45A" />
        <Rect x={10.7} y={11} width={2.6} height={9} fill="#7FBBA8" />
        <Rect x={13.9} y={11} width={2.6} height={9} fill="#E7B45A" />
      </Svg>
    </LinearGradient>
  );
}
