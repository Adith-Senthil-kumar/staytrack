import { useEffect, useState } from 'react';
import { onSnapshot, query, where } from 'firebase/firestore';
import { useAuthStore } from '../../store/auth';
import { roomsRef, tenantsRef, duesRef, expensesRef, userRef, staffRef } from './refs';
import type { Room, Tenant, Due, Expense, UserDoc, Staff } from '../../types';

function useCollection<T>(makeRef: ((uid: string) => any) | null) {
  const uid = useAuthStore((s) => s.user?.uid);
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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

export function useRooms() { const r = useCollection<Room>(roomsRef); return { rooms: r.data, loading: r.loading }; }
export function useTenants() { const r = useCollection<Tenant>(tenantsRef); return { tenants: r.data, loading: r.loading }; }
export function useExpenses() { const r = useCollection<Expense>(expensesRef); return { expenses: r.data, loading: r.loading }; }
export function useStaff() { const r = useCollection<Staff>(staffRef); return { staff: r.data, loading: r.loading }; }

export function useDues(monthKey?: string) {
  const uid = useAuthStore((s) => s.user?.uid);
  const [dues, setDues] = useState<Due[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!uid) { setUserDoc(null); setLoading(false); return; }
    setLoading(true);
    const unsub = onSnapshot(userRef(uid), (snap) => { setUserDoc(snap.exists() ? snap.data() : null); setLoading(false); });
    return unsub;
  }, [uid]);
  return { userDoc, loading };
}
