export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  const n = Math.round((b - a) / 86400000);
  return n < 1 ? 1 : n;
}

// Single source of truth for a stay's money: nights × agreed rate, minus the
// advance already collected. Used by both the checkout modal (preview) and the
// checkout write (record), so they can never disagree.
export function bookingFinancials(
  room: { dailyRate: number; rate?: number | null; advance?: number | null; checkIn: string | null },
  checkOut: string,
): { nights: number; rate: number; total: number; advance: number; balance: number } {
  const nights = nightsBetween(room.checkIn ?? checkOut, checkOut);
  const rate = room.rate ?? room.dailyRate;
  const total = nights * rate;
  const advance = room.advance ?? 0;
  const balance = Math.max(0, total - advance);
  return { nights, rate, total, advance, balance };
}
