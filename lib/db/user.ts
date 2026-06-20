import { getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { userRef } from './refs';
import type { Property } from '../../types';

export async function ensureUserDoc(uid: string, email: string) {
  const ref = userRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { email, onboardingComplete: false, property: null, createdAt: new Date().toISOString() });
  }
}
export const setProperty = (uid: string, property: Property) => updateDoc(userRef(uid), { property });
export const completeOnboarding = (uid: string) => updateDoc(userRef(uid), { onboardingComplete: true });
