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

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "2026-06-19" → "19 Jun" (compact, readable on a phone).
export function fmtDateShort(iso?: string | null): string {
  if (!iso) return '—';
  const p = iso.slice(0, 10).split('-');
  if (p.length < 3) return iso;
  return `${Number(p[2])} ${MON[Number(p[1]) - 1] ?? p[1]}`;
}

// "14:30" → "2:30 PM".
export function fmtTime12(hhmm?: string | null): string {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h)) return '';
  const ap = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m || 0).padStart(2, '0')} ${ap}`;
}
