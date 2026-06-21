// TEMPORARY dev-only verification harness. Enabled only when the build is made
// with EXPO_PUBLIC_DEMO=1 (web). Lets the real screens + shell + modals render
// with realistic seeded data so the UI can be verified logged-in. Off by default
// (dead code unless the env flag is set). Remove before shipping.
import type {
  Room, Tenant, Due, Expense, UserDoc, Staff, MaintTicket, SSRoom, SSStay,
  Attendance, ScheduleEntry, LeaveRequest, Vendor,
} from '../../types';

export const DEMO = process.env.EXPO_PUBLIC_DEMO === '1';

export const DEMO_USER = { uid: 'demo-uid', email: 'demo@staytrack.app' } as const;

const today = new Date().toISOString().slice(0, 10);
const ym = today.slice(0, 7);

export const DEMO_USERDOC: UserDoc = {
  email: 'demo@staytrack.app',
  onboardingComplete: true,
  property: { name: 'Sai Nilaya PG', address: '12, 4th Cross, Indiranagar, Bengaluru', rentDueDay: 5 },
  createdAt: '2025-01-01T00:00:00Z',
};

export const DEMO_ROOMS: Room[] = [
  { id: 'r301', number: '301', floor: 3, type: 'double', baseRent: 12000, status: 'occupied' },
  { id: 'r302', number: '302', floor: 3, type: 'single', baseRent: 8000, status: 'occupied' },
  { id: 'r303', number: '303', floor: 3, type: 'single', baseRent: 8000, status: 'vacant' },
  { id: 'r304', number: '304', floor: 3, type: 'double', baseRent: 12000, status: 'repair' },
  { id: 'r201', number: '201', floor: 2, type: 'triple', baseRent: 15000, status: 'occupied' },
  { id: 'r202', number: '202', floor: 2, type: 'double', baseRent: 12000, status: 'pending' },
  { id: 'r203', number: '203', floor: 2, type: 'single', baseRent: 8000, status: 'occupied' },
  { id: 'r204', number: '204', floor: 2, type: 'single', baseRent: 8000, status: 'reserved' },
  { id: 'r101', number: '101', floor: 1, type: 'double', baseRent: 12000, status: 'occupied' },
  { id: 'r102', number: '102', floor: 1, type: 'single', baseRent: 8000, status: 'vacant' },
  { id: 'r103', number: '103', floor: 1, type: 'triple', baseRent: 15000, status: 'occupied' },
];

export const DEMO_TENANTS: Tenant[] = [
  { id: 't1', name: 'Arjun Mehta', phone: '+91 90000 10001', roomId: 'r301', rent: 6000, deposit: 12000, joinDate: '2025-09-01', status: 'active', foodPreference: 'veg', documents: ['Aadhaar Card', 'PAN Card', 'Police Verification'] },
  { id: 't2', name: 'Rohit Sharma', phone: '+91 90000 10002', roomId: 'r301', rent: 6000, deposit: 12000, joinDate: '2025-10-15', status: 'active', foodPreference: 'nonveg', documents: ['Aadhaar Card'] },
  { id: 't3', name: 'Karthik Iyer', phone: '+91 90000 10003', roomId: 'r302', rent: 8000, deposit: 16000, joinDate: '2025-06-01', status: 'active', foodPreference: 'veg' },
  { id: 't4', name: 'Sandeep Reddy', phone: '+91 90000 10004', roomId: 'r201', rent: 5000, deposit: 10000, joinDate: '2026-01-10', status: 'active', foodPreference: 'nonveg' },
  { id: 't5', name: 'Vivek Nair', phone: '+91 90000 10005', roomId: 'r201', rent: 5000, deposit: 10000, joinDate: '2026-02-01', status: 'active', foodPreference: 'veg' },
  { id: 't6', name: 'Manish Gupta', phone: '+91 90000 10006', roomId: 'r203', rent: 8000, deposit: 16000, joinDate: '2025-11-20', status: 'active', foodPreference: 'veg' },
  { id: 't7', name: 'Aditya Rao', phone: '+91 90000 10007', roomId: 'r101', rent: 6000, deposit: 12000, joinDate: '2025-08-05', status: 'active', foodPreference: 'nonveg' },
  { id: 't8', name: 'Naveen Kumar', phone: '+91 90000 10008', roomId: 'r103', rent: 5000, deposit: 10000, joinDate: '2026-03-12', status: 'active', foodPreference: 'veg' },
];

export const DEMO_DUES: Due[] = [
  { id: 'd1', tenantId: 't1', monthKey: ym, amountDue: 6000, amountPaid: 6000, paidAt: `${ym}-03T10:00:00Z`, method: 'upi' },
  { id: 'd2', tenantId: 't2', monthKey: ym, amountDue: 6000, amountPaid: 0, paidAt: null },
  { id: 'd3', tenantId: 't3', monthKey: ym, amountDue: 8000, amountPaid: 4000, paidAt: `${ym}-08T10:00:00Z`, method: 'cash' },
  { id: 'd4', tenantId: 't4', monthKey: ym, amountDue: 5000, amountPaid: 5000, paidAt: `${ym}-02T10:00:00Z`, method: 'bank' },
  { id: 'd5', tenantId: 't5', monthKey: ym, amountDue: 5000, amountPaid: 0, paidAt: null },
  { id: 'd6', tenantId: 't6', monthKey: ym, amountDue: 8000, amountPaid: 8000, paidAt: `${ym}-05T10:00:00Z`, method: 'upi' },
  { id: 'd7', tenantId: 't7', monthKey: ym, amountDue: 6000, amountPaid: 0, paidAt: null },
  { id: 'd8', tenantId: 't8', monthKey: ym, amountDue: 5000, amountPaid: 2000, paidAt: `${ym}-10T10:00:00Z`, method: 'cash' },
];

export const DEMO_EXPENSES: Expense[] = [
  { id: 'e1', category: 'mess', amount: 18500, vendor: 'Anna Stores', note: 'Groceries — week 1-2', date: `${ym}-04` },
  { id: 'e2', category: 'staff', amount: 45000, vendor: 'Payroll', note: 'June salaries', date: `${ym}-01` },
  { id: 'e3', category: 'utilities', amount: 8200, vendor: 'BESCOM', note: 'Electricity', date: `${ym}-06` },
  { id: 'e4', category: 'repairs', amount: 1250, vendor: 'Mahesh Plumbing', note: 'Room 301 tap', date: `${ym}-09` },
  { id: 'e5', category: 'supplies', amount: 3400, vendor: 'CleanCo', note: 'Cleaning supplies', date: `${ym}-11` },
  { id: 'e6', category: 'utilities', amount: 1100, vendor: 'ACT Fibernet', note: 'Internet', date: `${ym}-07` },
  { id: 'e7', category: 'mess', amount: 9200, vendor: 'Anna Stores', note: 'Groceries — week 3', date: `${ym}-15` },
];

export const DEMO_STAFF: Staff[] = [
  { id: 's1', name: 'Lakshmi Devi', role: 'cook', phone: '+91 90000 11111', idProof: 'XXXX-1234', joinDate: '2025-01-10', salary: 18000, advance: 2000, leave: { cl: 12, sl: 6 }, notes: [{ date: '2026-06-10', text: 'Always punctual and keeps the kitchen spotless.', type: 'praise' }] },
  { id: 's2', name: 'Ramesh Kumar', role: 'security', phone: '+91 90000 22222', idProof: 'XXXX-5678', joinDate: '2024-11-02', salary: 15000 },
  { id: 's3', name: 'Anjali Rao', role: 'cleaner', phone: '+91 90000 33333', idProof: 'XXXX-9012', joinDate: '2025-03-20', salary: 12000 },
  { id: 's4', name: 'Suresh Babu', role: 'warden', phone: '+91 90000 44444', idProof: 'XXXX-3456', joinDate: '2024-07-15', salary: 22000 },
];

export const DEMO_ATTENDANCE: Attendance[] = [
  { id: 'a1', staffId: 's1', date: today, status: 'present' },
  { id: 'a2', staffId: 's2', date: today, status: 'late' },
  { id: 'a3', staffId: 's3', date: today, status: 'leave' },
  { id: 'a4', staffId: 's1', date: `${ym}-01`, status: 'present' },
  { id: 'a5', staffId: 's1', date: `${ym}-02`, status: 'present' },
  { id: 'a6', staffId: 's1', date: `${ym}-03`, status: 'late' },
  { id: 'a7', staffId: 's2', date: `${ym}-01`, status: 'present' },
  { id: 'a8', staffId: 's3', date: `${ym}-01`, status: 'absent' },
  { id: 'a9', staffId: 's4', date: today, status: 'present' },
];

export const DEMO_SCHEDULE: ScheduleEntry[] = [
  { id: 'sc1', staffId: 's1', day: 0, shift: 'morning' }, { id: 'sc2', staffId: 's1', day: 1, shift: 'evening' }, { id: 'sc3', staffId: 's1', day: 2, shift: 'night' },
  { id: 'sc4', staffId: 's2', day: 0, shift: 'night' }, { id: 'sc5', staffId: 's3', day: 3, shift: 'morning' }, { id: 'sc6', staffId: 's4', day: 0, shift: 'morning' },
];

export const DEMO_LEAVE: LeaveRequest[] = [
  { id: 'l1', staffId: 's1', type: 'casual', from: '24 Jun', to: '25 Jun', days: 2, reason: 'Village function', status: 'pending' },
  { id: 'l2', staffId: 's2', type: 'sick', from: '21 Jun', to: '21 Jun', days: 1, reason: 'Fever', status: 'pending' },
  { id: 'l3', staffId: 's3', type: 'casual', from: '12 Jun', to: '12 Jun', days: 1, reason: 'Bank work', status: 'approved' },
];

export const DEMO_VENDORS: Vendor[] = [
  { id: 'v1', name: 'Mahesh Plumbing', trade: 'plumber', phone: '+91 99016 22890', jobs: 7 },
  { id: 'v2', name: 'Sri Sai Electricals', trade: 'electrician', phone: '+91 98456 71203', jobs: 5 },
  { id: 'v3', name: 'Anil Carpenter', trade: 'carpenter', phone: '+91 97411 30562', jobs: 3 },
  { id: 'v4', name: 'CoolCare AC Service', trade: 'ac', phone: '+91 90080 44519', jobs: 4 },
];

export const DEMO_TICKETS: MaintTicket[] = [
  { id: 'tk1', roomNumber: '12', category: 'plumbing', issue: 'Leaking tap in bathroom', priority: 'high', status: 'done', createdDate: '2026-06-10', cost: 850, vendorId: 'v1', resolvedDate: '2026-06-12', photo: true },
  { id: 'tk2', roomNumber: '12', category: 'electrical', issue: 'Ceiling fan not working', priority: 'medium', status: 'done', createdDate: '2026-06-05', cost: 400, vendorId: 'v2', resolvedDate: '2026-06-06' },
  { id: 'tk3', roomNumber: '07', category: 'furniture', issue: 'Broken study chair', priority: 'low', status: 'in_progress', createdDate: '2026-06-18', cost: 0, vendorId: 'v3' },
  { id: 'tk4', roomNumber: '03', category: 'appliance', issue: 'AC not cooling', priority: 'high', status: 'open', createdDate: '2026-06-20', cost: 0, vendorId: null, photo: true },
  { id: 'tk5', roomNumber: '201', category: 'plumbing', issue: 'Low water pressure', priority: 'medium', status: 'open', createdDate: '2026-06-19', cost: 0, vendorId: 'v1' },
];

export const DEMO_SSROOMS: SSRoom[] = [
  { id: 'ss1', number: 'A1', dailyRate: 1200, status: 'available', guestName: null, checkIn: null, checkOut: null },
  { id: 'ss2', number: 'A2', dailyRate: 1200, status: 'occupied', guestName: 'Vikram Singh', checkIn: '2026-06-19', checkOut: '2026-06-23' },
  { id: 'ss3', number: 'B1', dailyRate: 1500, status: 'cleaning', guestName: null, checkIn: null, checkOut: null },
  { id: 'ss4', number: 'B2', dailyRate: 1500, status: 'available', guestName: null, checkIn: null, checkOut: null },
];

export const DEMO_SSSTAYS: SSStay[] = [
  { id: 'st1', guestName: 'Priya Menon', roomNumber: 'A1', checkIn: '2026-06-15', checkOut: '2026-06-18', nights: 3, total: 3600, createdAt: '2026-06-18T10:00:00Z' },
  { id: 'st2', guestName: 'Rahul Verma', roomNumber: 'B1', checkIn: '2026-06-10', checkOut: '2026-06-12', nights: 2, total: 3000, createdAt: '2026-06-12T10:00:00Z' },
];
