import type { VendorTrade } from '../types';
export const VENDOR_TRADE_UI: Record<VendorTrade, { label: string; color: string }> = {
  plumber: { label: 'Plumber', color: '#3A5A78' },
  electrician: { label: 'Electrician', color: '#C67A1E' },
  carpenter: { label: 'Carpenter', color: '#7A4E8C' },
  ac: { label: 'AC Service', color: '#1E6F5C' },
  other: { label: 'General', color: '#85897C' },
};
export const VENDOR_TRADE_KEYS = Object.keys(VENDOR_TRADE_UI) as VendorTrade[];
