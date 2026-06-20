import { create } from 'zustand';
import { type User, type Unsubscribe } from 'firebase/auth';

type AuthState = {
  user: User | null;
  initializing: boolean;
  init: () => Unsubscribe;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  init: () => {
    // Guard against SSR / Node environments where Firebase Auth cannot run
    if (typeof window === 'undefined') {
      return () => {};
    }
    // Lazy-require to avoid running initializeAuth during SSR module evaluation
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { onAuthStateChanged } = require('firebase/auth') as typeof import('firebase/auth');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { auth } = require('../lib/firebase') as typeof import('../lib/firebase');
    return onAuthStateChanged(auth, (user) => set({ user, initializing: false }));
  },
}));
