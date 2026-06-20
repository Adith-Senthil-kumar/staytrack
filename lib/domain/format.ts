function groupIndian(n: number): string {
  const s = String(n);
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  // group the remaining digits in pairs from the right (lakh/crore system)
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${grouped},${last3}`;
}

export function formatINR(amount: number): string {
  const rounded = Math.round(amount);
  const n = rounded === 0 ? 0 : rounded; // normalize -0 so we never show "-₹0"
  const sign = n < 0 ? '-' : '';
  return `${sign}₹${groupIndian(Math.abs(n))}`;
}

export function monthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}
