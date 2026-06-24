import { loadFont as loadSans } from '@remotion/google-fonts/IBMPlexSans';
import { loadFont as loadSerif } from '@remotion/google-fonts/IBMPlexSerif';
import { loadFont as loadMono } from '@remotion/google-fonts/IBMPlexMono';

// Match the app's typography: IBM Plex Sans / Serif / Mono.
export const SANS = loadSans('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin'] }).fontFamily;
export const SERIF = loadSerif('normal', { weights: ['600', '700'], subsets: ['latin'] }).fontFamily;
export const MONO = loadMono('normal', { weights: ['400', '500', '600'], subsets: ['latin'] }).fontFamily;

// Exact StayTrack brand colors (from the NativeWind theme + logo mark).
export const C = {
  bg: '#0A1310',        // sidebar / darkest green-black
  bg2: '#0E2E27',       // deep green
  surface: '#15231E',
  surfaceLine: '#243029',
  cream: '#FBF9F2',     // surface / primary text on dark
  cream2: '#ECE7DA',
  ink: '#13352C',       // brand deep green
  green: '#1E6F5C',     // accent
  greenLt: '#2E8B72',
  gold: '#E7B45A',      // logo glyph accent
  teal: '#7FBBA8',
  muted: '#8DA098',     // dark-theme muted text
  muted2: '#6F8379',
};
