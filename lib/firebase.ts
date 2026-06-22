import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  // @ts-ignore — getReactNativePersistence lacks types in some firebase@10 builds (#7584)
  getReactNativePersistence,
  indexedDBLocalPersistence,
} from 'firebase/auth';
import {
  initializeFirestore,
  memoryLocalCache,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth state persists across restarts everywhere: AsyncStorage (native), IndexedDB (web).
export const auth = initializeAuth(app, {
  persistence:
    Platform.OS === 'web'
      ? indexedDBLocalPersistence
      : getReactNativePersistence(AsyncStorage),
});

// Firestore cache: persistent on web (IndexedDB), in-memory on native (no IndexedDB).
export const db = initializeFirestore(app, {
  localCache:
    Platform.OS === 'web'
      ? persistentLocalCache({ tabManager: persistentMultipleTabManager() })
      : memoryLocalCache(),
});
