import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase';
import { authErrorMessage } from './firebaseErrors';

export async function signInWithEmail(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  } catch (e) {
    throw new Error(authErrorMessage((e as { code?: string }).code));
  }
}

export async function sendReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (e) {
    throw new Error(authErrorMessage((e as { code?: string }).code));
  }
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}
