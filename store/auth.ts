import { create } from 'zustand';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { DEMO, DEMO_USER } from '../lib/dev/demo';

type AuthState = {
  user: User | null;
  initializing: boolean;
  init: () => () => void; // returns unsubscribe
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  init: () => {
    if (DEMO) {
      set({ user: DEMO_USER as unknown as User, initializing: false });
      return () => {};
    }
    return onAuthStateChanged(auth, (user) => set({ user, initializing: false }));
  },
}));
