import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorScheme } from 'nativewind';

export type ThemePref = 'light' | 'dark' | 'system';
const KEY = 'staytrack.theme';

type ThemeState = {
  pref: ThemePref;
  setPref: (p: ThemePref) => void;
  hydrate: () => Promise<void>;
};

export const useThemeStore = create<ThemeState>((set) => ({
  pref: 'system',
  setPref: (p) => {
    colorScheme.set(p);
    AsyncStorage.setItem(KEY, p).catch(() => {});
    set({ pref: p });
  },
  hydrate: async () => {
    const saved = (await AsyncStorage.getItem(KEY)) as ThemePref | null;
    const pref = saved ?? 'system';
    colorScheme.set(pref);
    set({ pref });
  },
}));
