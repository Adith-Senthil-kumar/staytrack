import { doc, setDoc } from 'firebase/firestore';
import { attendanceRef, scheduleRef } from './refs';
import type { AttendanceStatus, Shift } from '../../types';
export const markAttendance = (uid: string, staffId: string, date: string, status: AttendanceStatus) =>
  setDoc(doc(attendanceRef(uid), `${staffId}_${date}`), { staffId, date, status } as any);
export const setShift = (uid: string, staffId: string, day: number, shift: Shift) =>
  setDoc(doc(scheduleRef(uid), `${staffId}_${day}`), { staffId, day, shift } as any);
