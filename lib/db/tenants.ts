import { addDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { tenantsRef, roomsRef } from './refs';
import type { Tenant } from '../../types';

type NewTenantInput = Omit<Tenant, 'id' | 'status' | 'joinDate'> & { joinDate?: string };

export async function addTenant(uid: string, input: NewTenantInput, roomType: 'single' | 'double') {
  const tenant = {
    ...input,
    joinDate: input.joinDate ?? new Date().toISOString().slice(0, 10),
    status: 'active' as const,
  };
  const ref = await addDoc(tenantsRef(uid), tenant as Tenant);
  if (input.roomId) {
    await updateDoc(doc(roomsRef(uid), input.roomId), { status: 'occupied', type: roomType });
  }
  return ref;
}

// freeRoom: mark the room vacant too. Pass false when roommates remain in a shared room.
export async function vacateTenant(uid: string, tenant: Tenant, freeRoom = true) {
  const batch = writeBatch(db);
  batch.update(doc(tenantsRef(uid), tenant.id), { status: 'vacated', roomId: null });
  if (tenant.roomId && freeRoom) batch.update(doc(roomsRef(uid), tenant.roomId), { status: 'vacant' });
  await batch.commit();
}

export const updateTenant = (uid: string, id: string, patch: Partial<Tenant>) =>
  updateDoc(doc(tenantsRef(uid), id), patch);

export const toggleTenantDocument = (uid: string, tenant: Tenant, label: string) => {
  const docs = tenant.documents ?? [];
  const next = docs.includes(label) ? docs.filter((d) => d !== label) : [...docs, label];
  return updateDoc(doc(tenantsRef(uid), tenant.id), { documents: next });
};

// Mark a document on file with its uploaded scan URL.
export const setTenantDocument = (uid: string, tenant: Tenant, label: string, photoUrl: string) => {
  const docs = tenant.documents ?? [];
  const next = docs.includes(label) ? docs : [...docs, label];
  const photos = { ...(tenant.documentPhotos ?? {}), [label]: photoUrl };
  return updateDoc(doc(tenantsRef(uid), tenant.id), { documents: next, documentPhotos: photos });
};

// Remove a document (and drop its stored scan).
export const removeTenantDocument = (uid: string, tenant: Tenant, label: string) => {
  const next = (tenant.documents ?? []).filter((d) => d !== label);
  const photos = { ...(tenant.documentPhotos ?? {}) };
  delete photos[label];
  return updateDoc(doc(tenantsRef(uid), tenant.id), { documents: next, documentPhotos: photos });
};
