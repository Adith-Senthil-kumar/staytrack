import { getDoc, setDoc } from 'firebase/firestore';
import { userRef } from './refs';
import type { Property } from '../../types';

export async function ensureUserDoc(uid: string, email: string) {
  const ref = userRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { email, onboardingComplete: false, property: null, createdAt: new Date().toISOString() });
  }
}

// setDoc(merge) so these create-or-update — they succeed even if the user doc
// hasn't been created yet (e.g. before ensureUserDoc has run on a fresh login).
export const setProperty = (uid: string, property: Property) =>
  setDoc(userRef(uid), { property }, { merge: true });
export const completeOnboarding = (uid: string) =>
  setDoc(userRef(uid), { onboardingComplete: true }, { merge: true });
