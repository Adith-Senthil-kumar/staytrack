import { addDoc, deleteDoc, doc, updateDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { staffRef, attendanceRef, scheduleRef, leaveRef } from './refs';
import type { Staff } from '../../types';

export const addStaff = (uid: string, staff: Omit<Staff, 'id'>) => addDoc(staffRef(uid), staff as Staff);
export const updateStaff = (uid: string, id: string, patch: Partial<Staff>) => updateDoc(doc(staffRef(uid), id), patch);

// Hard-delete a staff member and cascade: their attendance, schedule and leave
// records (all keyed by staffId) are removed too so nothing is left orphaned.
export async function removeStaff(uid: string, id: string) {
  const [att, sch, lv] = await Promise.all([
    getDocs(query(attendanceRef(uid), where('staffId', '==', id))),
    getDocs(query(scheduleRef(uid), where('staffId', '==', id))),
    getDocs(query(leaveRef(uid), where('staffId', '==', id))),
  ]);
  const batch = writeBatch(db);
  batch.delete(doc(staffRef(uid), id));
  att.forEach((d) => batch.delete(d.ref));
  sch.forEach((d) => batch.delete(d.ref));
  lv.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}
