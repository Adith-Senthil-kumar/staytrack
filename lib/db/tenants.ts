import { addDoc, doc, updateDoc, deleteDoc, setDoc, getDocs, query, where, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { tenantsRef, roomsRef, duesRef, tenantDocsRef } from './refs';
import type { Tenant } from '../../types';

type NewTenantInput = Omit<Tenant, 'id' | 'status' | 'joinDate'> & { joinDate?: string };

export async function addTenant(uid: string, input: NewTenantInput) {
  const tenant = {
    ...input,
    joinDate: input.joinDate ?? new Date().toISOString().slice(0, 10),
    status: 'active' as const,
  };
  const ref = await addDoc(tenantsRef(uid), tenant as Tenant);
  // Mark the room occupied — but NEVER change its type/capacity. The room's
  // sharing is fixed in Manage Rooms; a tenant just fills a slot in it.
  if (input.roomId) {
    await updateDoc(doc(roomsRef(uid), input.roomId), { status: 'occupied' });
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

// Place an existing (unassigned/vacated) tenant into a room — the counterpart
// to addTenant, which creates a brand-new record. Reactivates the tenant and
// marks the room occupied, without ever changing the room's type/capacity.
export async function assignTenantToRoom(uid: string, tenant: Tenant, roomId: string) {
  const batch = writeBatch(db);
  batch.update(doc(tenantsRef(uid), tenant.id), { roomId, status: 'active' });
  batch.update(doc(roomsRef(uid), roomId), { status: 'occupied' });
  await batch.commit();
}

// Hard-delete a tenant record (distinct from vacate, which keeps the record).
// Frees the room only when no other active tenant remains in it, and cascades:
// the tenant's dues and document scans are deleted too so nothing is orphaned.
export async function removeTenant(uid: string, tenant: Tenant, freeRoom = true) {
  const [dues, docs] = await Promise.all([
    getDocs(query(duesRef(uid), where('tenantId', '==', tenant.id))),
    getDocs(tenantDocsRef(uid, tenant.id)),
  ]);
  const batch = writeBatch(db);
  batch.delete(doc(tenantsRef(uid), tenant.id));
  if (tenant.roomId && freeRoom) batch.update(doc(roomsRef(uid), tenant.roomId), { status: 'vacant' });
  dues.forEach((d) => batch.delete(d.ref));
  docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

export const updateTenant = (uid: string, id: string, patch: Partial<Tenant>) =>
  updateDoc(doc(tenantsRef(uid), id), patch);

const docSlug = (label: string) => label.replace(/\s+/g, '_').toLowerCase();

// Store a KYC scan as its own doc under tenants/{id}/documents — keeps the tenant
// doc small (a 5-scan tenant could otherwise approach Firestore's 1 MiB limit) and
// means tenant-list reads don't download every photo.
export const setTenantDocument = (uid: string, tenant: Tenant, label: string, photoUrl: string) =>
  setDoc(doc(tenantDocsRef(uid, tenant.id), docSlug(label)), { label, photo: photoUrl, uploadedAt: serverTimestamp() } as any);

// Remove a scan: delete the subcollection doc, and also drop any legacy inline
// copy (from before the subcollection migration) so it can't reappear.
export async function removeTenantDocument(uid: string, tenant: Tenant, label: string) {
  await deleteDoc(doc(tenantDocsRef(uid, tenant.id), docSlug(label)));
  if (tenant.documentPhotos?.[label] || tenant.documents?.includes(label)) {
    const photos = { ...(tenant.documentPhotos ?? {}) };
    delete photos[label];
    const documents = (tenant.documents ?? []).filter((d) => d !== label);
    await updateDoc(doc(tenantsRef(uid), tenant.id), { documentPhotos: photos, documents });
  }
}
