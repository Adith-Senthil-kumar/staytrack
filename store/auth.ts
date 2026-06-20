import { create } from 'zustand';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';

type AuthState = {
  user: User | null;
  initializing: boolean;
  init: () => () => void; // returns unsubscribe
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  init: () =>
    onAuthStateChanged(auth, (user) => set({ user, initializing: false })),
}));
