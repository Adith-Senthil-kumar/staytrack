import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
  IBMPlexSans_700Bold,
} from '@expo-google-fonts/ibm-plex-sans';
import {
  IBMPlexSerif_600SemiBold,
  IBMPlexSerif_700Bold,
} from '@expo-google-fonts/ibm-plex-serif';
import {
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
} from '@expo-google-fonts/ibm-plex-mono';
import { useThemeStore } from '../store/theme';
import { useAuthStore } from '../store/auth';
import { ensureUserDoc } from '../lib/db/user';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
    IBMPlexSans_700Bold,
    IBMPlexSerif_600SemiBold,
    IBMPlexSerif_700Bold,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  const hydrateTheme = useThemeStore((s) => s.hydrate);
  useEffect(() => { hydrateTheme(); }, [hydrateTheme]);

  const initAuth = useAuthStore((s) => s.init);
  useEffect(() => {
    const unsub = initAuth();
    return unsub;
  }, [initAuth]);

  // Bootstrap the Firestore user doc whenever a user is authenticated. This runs
  // regardless of which route is active (fresh login goes auth→app→onboarding,
  // never mounting index.tsx), so the doc always exists before onboarding writes.
  const user = useAuthStore((s) => s.user);
  useEffect(() => {
    if (user) ensureUserDoc(user.uid, user.email ?? '').catch(() => {});
  }, [user]);

  if (!loaded && !error) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
