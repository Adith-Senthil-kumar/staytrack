import { useEffect, useState } from 'react';
import { onSnapshot, query, where } from 'firebase/firestore';
import { useAuthStore } from '../../store/auth';
import { roomsRef, tenantsRef, duesRef, expensesRef, userRef, staffRef, maintRef, ssRoomsRef, ssStaysRef, attendanceRef, scheduleRef, leaveRef, vendorsRef } from './refs';
import type { Room, Tenant, Due, Expense, UserDoc, Staff, MaintTicket, SSRoom, SSStay, Attendance, ScheduleEntry, LeaveRequest, Vendor } from '../../types';
import { DEMO, DEMO_USERDOC, DEMO_ROOMS, DEMO_TENANTS, DEMO_DUES, DEMO_EXPENSES, DEMO_STAFF, DEMO_TICKETS, DEMO_SSROOMS, DEMO_SSSTAYS, DEMO_ATTENDANCE, DEMO_SCHEDULE, DEMO_LEAVE, DEMO_VENDORS } from '../dev/demo';

function useCollection<T>(makeRef: ((uid: string) => any) | null, demo?: T[]) {
  const uid = useAuthStore((s) => s.user?.uid);
  const [data, setData] = useState<T[]>(DEMO && demo ? demo : []);
  const [loading, setLoading] = useState(!DEMO);
  useEffect(() => {
    if (DEMO) { setData(demo ?? []); setLoading(false); return; }
    if (!uid || !makeRef) { setData([]); setLoading(false); return; }
    setLoading(true);
    const unsub = onSnapshot(makeRef(uid), (snap: any) => {
      setData(snap.docs.map((d: any) => d.data() as T));
      setLoading(false);
    });
    return unsub;
  }, [uid]);
  return { data, loading };
}

export function useRooms() { const r = useCollection<Room>(roomsRef, DEMO_ROOMS); return { rooms: r.data, loading: r.loading }; }
export function useTenants() { const r = useCollection<Tenant>(tenantsRef, DEMO_TENANTS); return { tenants: r.data, loading: r.loading }; }
export function useExpenses() { const r = useCollection<Expense>(expensesRef, DEMO_EXPENSES); return { expenses: r.data, loading: r.loading }; }
export function useStaff() { const r = useCollection<Staff>(staffRef, DEMO_STAFF); return { staff: r.data, loading: r.loading }; }
export function useMaintenance() { const r = useCollection<MaintTicket>(maintRef, DEMO_TICKETS); return { tickets: r.data, loading: r.loading }; }
export function useSSRooms() { const r = useCollection<SSRoom>(ssRoomsRef, DEMO_SSROOMS); return { rooms: r.data, loading: r.loading }; }
export function useSSStays() { const r = useCollection<SSStay>(ssStaysRef, DEMO_SSSTAYS); return { stays: r.data, loading: r.loading }; }
export function useAttendance() { const r = useCollection<Attendance>(attendanceRef, DEMO_ATTENDANCE); return { attendance: r.data, loading: r.loading }; }
export function useSchedule() { const r = useCollection<ScheduleEntry>(scheduleRef, DEMO_SCHEDULE); return { schedule: r.data, loading: r.loading }; }
export function useLeave() { const r = useCollection<LeaveRequest>(leaveRef, DEMO_LEAVE); return { leave: r.data, loading: r.loading }; }
export function useVendors() { const r = useCollection<Vendor>(vendorsRef, DEMO_VENDORS); return { vendors: r.data, loading: r.loading }; }

export function useDues(monthKey?: string) {
  const uid = useAuthStore((s) => s.user?.uid);
  const [dues, setDues] = useState<Due[]>(DEMO ? DEMO_DUES : []);
  const [loading, setLoading] = useState(!DEMO);
  useEffect(() => {
    if (DEMO) { setDues(DEMO_DUES); setLoading(false); return; }
    if (!uid) { setDues([]); setLoading(false); return; }
    setLoading(true);
    const ref = monthKey ? query(duesRef(uid), where('monthKey', '==', monthKey)) : duesRef(uid);
    const unsub = onSnapshot(ref, (snap) => { setDues(snap.docs.map((d) => d.data())); setLoading(false); });
    return unsub;
  }, [uid, monthKey]);
  return { dues, loading };
}

export function useUserDoc() {
  const uid = useAuthStore((s) => s.user?.uid);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(DEMO ? DEMO_USERDOC : null);
  const [loading, setLoading] = useState(!DEMO);
  useEffect(() => {
    if (DEMO) { setUserDoc(DEMO_USERDOC); setLoading(false); return; }
    if (!uid) { setUserDoc(null); setLoading(false); return; }
    setLoading(true);
    const unsub = onSnapshot(userRef(uid), (snap) => { setUserDoc(snap.exists() ? snap.data() : null); setLoading(false); });
    return unsub;
  }, [uid]);
  return { userDoc, loading };
}
