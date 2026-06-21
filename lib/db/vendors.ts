import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { vendorsRef } from './refs';
import type { Vendor } from '../../types';
export const addVendor = (uid: string, v: Omit<Vendor, 'id'>) => addDoc(vendorsRef(uid), v as Vendor);
export const updateVendor = (uid: string, id: string, patch: Partial<Vendor>) => updateDoc(doc(vendorsRef(uid), id), patch);
export const removeVendor = (uid: string, id: string) => deleteDoc(doc(vendorsRef(uid), id));
