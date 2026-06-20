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

export async function vacateTenant(uid: string, tenant: Tenant) {
  const batch = writeBatch(db);
  batch.update(doc(tenantsRef(uid), tenant.id), { status: 'vacated' });
  if (tenant.roomId) batch.update(doc(roomsRef(uid), tenant.roomId), { status: 'vacant' });
  await batch.commit();
}

export const updateTenant = (uid: string, id: string, patch: Partial<Tenant>) =>
  updateDoc(doc(tenantsRef(uid), id), patch);
