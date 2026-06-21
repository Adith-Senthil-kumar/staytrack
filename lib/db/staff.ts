import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { staffRef } from './refs';
import type { Staff } from '../../types';
export const addStaff = (uid: string, staff: Omit<Staff, 'id'>) => addDoc(staffRef(uid), staff as Staff);
export const updateStaff = (uid: string, id: string, patch: Partial<Staff>) => updateDoc(doc(staffRef(uid), id), patch);
export const removeStaff = (uid: string, id: string) => deleteDoc(doc(staffRef(uid), id));
