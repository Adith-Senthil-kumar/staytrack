import { addDoc, deleteDoc, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { maintRef, vendorsRef } from './refs';
import { addExpense } from './expenses';
import type { MaintTicket, MaintStatus } from '../../types';

export const addTicket = (uid: string, t: Omit<MaintTicket, 'id'>) =>
  addDoc(maintRef(uid), t as MaintTicket);
export const setTicketStatus = (uid: string, id: string, status: MaintStatus) =>
  updateDoc(doc(maintRef(uid), id), { status });
export const removeTicket = (uid: string, id: string) =>
  deleteDoc(doc(maintRef(uid), id));
export const setTicketPhoto = (uid: string, id: string, photoUrl: string | null) =>
  updateDoc(doc(maintRef(uid), id), { photoUrl });

export const startTicket = (uid: string, id: string) =>
  updateDoc(doc(maintRef(uid), id), { status: 'in_progress' });

export const reopenTicket = (uid: string, id: string) =>
  updateDoc(doc(maintRef(uid), id), { status: 'open', resolvedDate: null });

export async function resolveTicket(
  uid: string,
  ticket: MaintTicket,
  cost: number,
  vendorName: string,
) {
  const today = new Date().toISOString().slice(0, 10);
  await updateDoc(doc(maintRef(uid), ticket.id), { status: 'done', cost, resolvedDate: serverTimestamp() });
  await addExpense(uid, {
    category: 'repairs',
    amount: cost,
    vendor: vendorName || 'Vendor',
    note: `Room ${ticket.roomNumber} — ${ticket.issue}`,
    date: today,
  });
  if (ticket.vendorId) {
    try {
      await updateDoc(doc(vendorsRef(uid), ticket.vendorId), { jobs: increment(1) });
    } catch {}
  }
}
