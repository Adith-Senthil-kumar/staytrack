import {
  collection, doc, type CollectionReference, type DocumentReference,
  type FirestoreDataConverter,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Room, Tenant, Due, Expense, UserDoc, Staff, MaintTicket, SSRoom, SSStay, Attendance, ScheduleEntry, LeaveRequest, Vendor } from '../../types';

function converter<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore: (data) => data as object,
    // id LAST so the real document id always wins — a stale stored `id` field
    // (from legacy/imported docs) can never override it and collide with another row.
    fromFirestore: (snap) => ({ ...snap.data(), id: snap.id }) as T,
  };
}

export const userRef = (uid: string): DocumentReference<UserDoc> =>
  doc(db, 'users', uid).withConverter(converter<UserDoc>());

export const roomsRef = (uid: string): CollectionReference<Room> =>
  collection(db, 'users', uid, 'rooms').withConverter(converter<Room>());
export const tenantsRef = (uid: string): CollectionReference<Tenant> =>
  collection(db, 'users', uid, 'tenants').withConverter(converter<Tenant>());
export const duesRef = (uid: string): CollectionReference<Due> =>
  collection(db, 'users', uid, 'dues').withConverter(converter<Due>());
export const expensesRef = (uid: string): CollectionReference<Expense> =>
  collection(db, 'users', uid, 'expenses').withConverter(converter<Expense>());
export const staffRef = (uid: string): CollectionReference<Staff> =>
  collection(db, 'users', uid, 'staff').withConverter(converter<Staff>());
export const maintRef = (uid: string): CollectionReference<MaintTicket> =>
  collection(db, 'users', uid, 'maintenance').withConverter(converter<MaintTicket>());
export const ssRoomsRef = (uid: string): CollectionReference<SSRoom> =>
  collection(db, 'users', uid, 'ssRooms').withConverter(converter<SSRoom>());
export const ssStaysRef = (uid: string): CollectionReference<SSStay> =>
  collection(db, 'users', uid, 'ssStays').withConverter(converter<SSStay>());
export const attendanceRef = (uid: string): CollectionReference<Attendance> =>
  collection(db, 'users', uid, 'attendance').withConverter(converter<Attendance>());
export const scheduleRef = (uid: string): CollectionReference<ScheduleEntry> =>
  collection(db, 'users', uid, 'schedule').withConverter(converter<ScheduleEntry>());
export const leaveRef = (uid: string): CollectionReference<LeaveRequest> =>
  collection(db, 'users', uid, 'leave').withConverter(converter<LeaveRequest>());
export const vendorsRef = (uid: string): CollectionReference<Vendor> =>
  collection(db, 'users', uid, 'vendors').withConverter(converter<Vendor>());
