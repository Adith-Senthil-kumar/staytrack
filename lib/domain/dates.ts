// Format a stored event time as a "YYYY-MM-DD" date string. Accepts a Firestore
// Timestamp (new server-authoritative writes), a legacy ISO string, or null — so
// a collection that mixes both during/after the serverTimestamp() migration still
// renders correctly.
export function toDateStr(v: unknown): string {
  if (!v) return '—';
  if (typeof v === 'string') return v.slice(0, 10);
  if (typeof v === 'object' && typeof (v as { toDate?: () => Date }).toDate === 'function') {
    return (v as { toDate: () => Date }).toDate().toISOString().slice(0, 10);
  }
  return '—';
}
