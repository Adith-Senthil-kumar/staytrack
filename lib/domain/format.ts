function groupIndian(n: number): string {
  const s = String(n);
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  // group the remaining digits in pairs from the right (lakh/crore system)
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${grouped},${last3}`;
}

// Money is stored as integer PAISE (₹1 = 100 paise) so amounts stay exact.
// `formatINR` takes paise and renders whole rupees; `toPaise`/`toRupees` convert
// at the input/prefill boundaries.
export const toPaise = (rupees: number): number => Math.round(rupees * 100);
export const toRupees = (paise: number): number => Math.round(paise) / 100;

export function formatINR(paise: number): string {
  const rupees = Math.round(paise / 100); // display whole rupees (storage stays exact)
  const n = rupees === 0 ? 0 : rupees; // normalize -0 so we never show "-₹0"
  const sign = n < 0 ? '-' : '';
  return `${sign}₹${groupIndian(Math.abs(n))}`;
}

export function monthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// "2026-06" → "June"
export function monthName(monthKey: string): string {
  const m = Number(monthKey.split('-')[1]);
  return MONTHS[m - 1] ?? monthKey;
}
