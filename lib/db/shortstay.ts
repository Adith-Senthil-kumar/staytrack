import { addDoc, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { ssRoomsRef, ssStaysRef } from './refs';
import { bookingFinancials } from '../domain/shortstay';
import type { SSRoom, PaymentMethod } from '../../types';

export const addSSRoom = (uid: string, number: string, dailyRate: number) =>
  addDoc(ssRoomsRef(uid), { number, dailyRate, status: 'available', guestName: null, checkIn: null, checkOut: null } as SSRoom);

export const removeSSRoom = (uid: string, id: string) => deleteDoc(doc(ssRoomsRef(uid), id));

export type BookingInput = {
  guestName: string; phone?: string; checkIn: string; checkOut: string;
  rate: number; advance: number; payMethod: PaymentMethod; idType: string;
};

export const bookSSRoom = (uid: string, id: string, b: BookingInput) =>
  updateDoc(doc(ssRoomsRef(uid), id), {
    status: 'occupied', guestName: b.guestName, phone: b.phone ?? null,
    checkIn: b.checkIn, checkOut: b.checkOut,
    rate: b.rate, advance: b.advance, payMethod: b.payMethod, idType: b.idType,
  });

export async function checkoutSSRoom(uid: string, room: SSRoom, paymentMethod: PaymentMethod) {
  if (!room.guestName || !room.checkIn) return;
  const checkOut = new Date().toISOString().slice(0, 10);
  const { nights, rate, total, advance, balance } = bookingFinancials(room, checkOut);
  const batch = writeBatch(db);
  const stayData = {
    id: '', guestName: room.guestName, roomNumber: room.number,
    checkIn: room.checkIn, checkOut, nights, rate, total, advance, balance,
    paymentMethod, createdAt: new Date().toISOString(),
  };
  batch.set(doc(ssStaysRef(uid)), stayData);
  // Clear all booking fields when the room frees up.
  batch.update(doc(ssRoomsRef(uid), room.id), {
    status: 'cleaning', guestName: null, checkIn: null, checkOut: null,
    phone: null, rate: null, advance: null, payMethod: null, idType: null,
  });
  await batch.commit();
}

export const cleanSSRoom = (uid: string, id: string) => updateDoc(doc(ssRoomsRef(uid), id), { status: 'available' });
