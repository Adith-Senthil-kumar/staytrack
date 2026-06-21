import { addDoc, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { ssRoomsRef, ssStaysRef } from './refs';
import { nightsBetween } from '../domain/shortstay';
import type { SSRoom } from '../../types';

export const addSSRoom = (uid: string, number: string, dailyRate: number) =>
  addDoc(ssRoomsRef(uid), { number, dailyRate, status: 'available', guestName: null, checkIn: null, checkOut: null } as SSRoom);

export const removeSSRoom = (uid: string, id: string) => deleteDoc(doc(ssRoomsRef(uid), id));

export const bookSSRoom = (uid: string, id: string, guestName: string, checkIn: string, checkOut: string) =>
  updateDoc(doc(ssRoomsRef(uid), id), { status: 'occupied', guestName, checkIn, checkOut });

export async function checkoutSSRoom(uid: string, room: SSRoom) {
  if (!room.guestName || !room.checkIn) return;
  const checkOut = new Date().toISOString().slice(0, 10);
  const nights = nightsBetween(room.checkIn, checkOut);
  const batch = writeBatch(db);
  const stayData = { id: '', guestName: room.guestName, roomNumber: room.number, checkIn: room.checkIn, checkOut, nights, total: nights * room.dailyRate, createdAt: new Date().toISOString() };
  batch.set(doc(ssStaysRef(uid)), stayData);
  batch.update(doc(ssRoomsRef(uid), room.id), { status: 'cleaning', guestName: null, checkIn: null, checkOut: null });
  await batch.commit();
}

export const cleanSSRoom = (uid: string, id: string) => updateDoc(doc(ssRoomsRef(uid), id), { status: 'available' });
