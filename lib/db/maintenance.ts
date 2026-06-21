import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { maintRef } from './refs';
import type { MaintTicket, MaintStatus } from '../../types';

export const addTicket = (uid: string, t: Omit<MaintTicket, 'id'>) =>
  addDoc(maintRef(uid), t as MaintTicket);
export const setTicketStatus = (uid: string, id: string, status: MaintStatus) =>
  updateDoc(doc(maintRef(uid), id), { status });
export const removeTicket = (uid: string, id: string) =>
  deleteDoc(doc(maintRef(uid), id));
