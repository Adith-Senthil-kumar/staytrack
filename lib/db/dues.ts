import { addDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { duesRef } from './refs';
import type { Due, NewDue } from '../../types';

export async function createDues(uid: string, dues: NewDue[]) {
  if (dues.length === 0) return;
  const batch = writeBatch(db);
  for (const d of dues) batch.set(doc(duesRef(uid)), d as Due);
  await batch.commit();
}

export const recordPayment = (uid: string, id: string, amountPaid: number) =>
  updateDoc(doc(duesRef(uid), id), { amountPaid, paidAt: new Date().toISOString() });
