import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { roomsRef } from './refs';
import type { Room, RoomStatus, RoomType } from '../../types';

export const addRoom = (uid: string, room: Omit<Room, 'id'>) => addDoc(roomsRef(uid), room as Room);
export const updateRoom = (uid: string, id: string, patch: Partial<Room>) =>
  updateDoc(doc(roomsRef(uid), id), patch);
export const setRoomStatus = (uid: string, id: string, status: RoomStatus) =>
  updateDoc(doc(roomsRef(uid), id), { status });
export const setRoomType = (uid: string, id: string, type: RoomType) =>
  updateDoc(doc(roomsRef(uid), id), { type });
export const removeRoom = (uid: string, id: string) => deleteDoc(doc(roomsRef(uid), id));
