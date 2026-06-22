import { doc, updateDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { duesRef } from './refs';
import type { Due, NewDue, PaymentMethod } from '../../types';

export async function createDues(uid: string, dues: NewDue[]) {
  if (dues.length === 0) return;
  const batch = writeBatch(db);
  // Deterministic id per tenant+month → idempotent. A duplicate run (e.g. dev
  // StrictMode double-invoke or a render race) overwrites the same doc instead
  // of creating a second one, so a tenant can never accrue duplicate dues.
  for (const d of dues) batch.set(doc(duesRef(uid), `${d.tenantId}_${d.monthKey}`), d as Due);
  await batch.commit();
}

export const recordPayment = (uid: string, id: string, amountPaid: number, method?: PaymentMethod) =>
  updateDoc(doc(duesRef(uid), id), { amountPaid, paidAt: serverTimestamp(), ...(method ? { method } : {}) });
