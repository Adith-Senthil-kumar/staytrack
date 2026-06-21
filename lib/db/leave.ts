import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { leaveRef } from './refs';
import type { LeaveRequest, LeaveStatus } from '../../types';

export const addLeave = (uid: string, req: Omit<LeaveRequest, 'id'>) =>
  addDoc(leaveRef(uid), req as LeaveRequest);

export const setLeaveStatus = (uid: string, id: string, status: LeaveStatus) =>
  updateDoc(doc(leaveRef(uid), id), { status });

export const removeLeave = (uid: string, id: string) =>
  deleteDoc(doc(leaveRef(uid), id));
