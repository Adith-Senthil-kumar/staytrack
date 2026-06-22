export type RoomType = 'single' | 'double' | 'triple';
export type RoomStatus = 'occupied' | 'vacant' | 'pending' | 'reserved' | 'repair';

export interface Room {
  id: string;
  number: string;     // "301"
  floor: number;      // 3
  type: RoomType;
  baseRent: number;   // INR / month
  status: RoomStatus;
}

export type TenantStatus = 'active' | 'vacated';
export type FoodPreference = 'veg' | 'nonveg';

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  roomId: string | null;
  rent: number;       // INR / month
  deposit: number;
  joinDate: string;   // ISO "2026-06-01"
  status: TenantStatus;
  foodPreference: FoodPreference;
  // Legacy (pre-subcollection) inline scans — still read for backward compat, no
  // longer written. New scans live in the `documents` subcollection (TenantDocument).
  documents?: string[];
  documentPhotos?: Record<string, string>;
}

// One KYC scan, stored as its own doc under tenants/{id}/documents/{slug(label)}
// so the tenant doc stays small and list reads don't pull every photo.
export interface TenantDocument {
  id: string;
  label: string;   // e.g. "Aadhaar Card" (one of ALL_DOCS)
  photo: string;   // data URI (or, later, a Storage URL)
  uploadedAt?: unknown; // Firestore Timestamp
}

// `status` is DERIVED via dueStatus(); only these fields are stored.
export interface Due {
  id: string;
  tenantId: string;
  monthKey: string;   // "2026-06"
  amountDue: number;
  amountPaid: number;
  paidAt: unknown; // Firestore Timestamp (new) or legacy ISO string; null until paid
  method?: PaymentMethod;
}
export type NewDue = Omit<Due, 'id'>;
export type DueStatus = 'paid' | 'partial' | 'unpaid' | 'overdue';

export type PaymentMethod = 'upi' | 'cash' | 'bank';

export type ExpenseCategory =
  | 'mess' | 'staff' | 'utilities' | 'repairs' | 'supplies' | 'other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  vendor: string;
  note: string;
  date: string;       // ISO "2026-06-03"
}

export interface Property {
  name: string;
  address: string;
  rentDueDay: number; // day-of-month rent is due, e.g. 5
}

export interface UserDoc {
  email: string;
  onboardingComplete: boolean;
  property: Property | null;
  createdAt: string; // ISO
}

export type StaffRole = 'warden' | 'cook' | 'cleaner' | 'security' | 'manager' | 'other';
export interface StaffNote { date: string; text: string; type: 'praise' | 'complaint'; }
export interface Staff { id: string; name: string; role: StaffRole; phone: string; idProof: string; joinDate: string; salary: number; advance?: number; leave?: { cl: number; sl: number }; notes?: StaffNote[]; }

export type LeaveType = 'casual' | 'sick';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export interface LeaveRequest { id: string; staffId: string; type: LeaveType; from: string; to: string; days: number; reason: string; status: LeaveStatus; }

export type MaintCategory = 'electrical' | 'plumbing' | 'furniture' | 'appliance' | 'cleaning' | 'other';
export type MaintPriority = 'high' | 'medium' | 'low';
export type MaintStatus = 'open' | 'in_progress' | 'done';
// roomId is the live reference (resolve the current number for display); roomNumber
// is kept as a snapshot so legacy tickets and history still render.
export interface MaintTicket { id: string; roomId?: string | null; roomNumber: string; category: MaintCategory; issue: string; priority: MaintPriority; status: MaintStatus; createdDate: string; cost: number; vendorId?: string | null; resolvedDate?: unknown; photoUrl?: string | null; }

export type VendorTrade = 'plumber' | 'electrician' | 'carpenter' | 'ac' | 'other';
export interface Vendor { id: string; name: string; trade: VendorTrade; phone: string; jobs: number; }

export type SSStatus = 'available' | 'occupied' | 'cleaning';
// Booking-time fields (rate/advance/payMethod/idType/phone) are set when a room
// is booked and cleared on checkout. `rate` is the agreed daily rate for the
// current guest (defaults to dailyRate); advance is what they paid up front.
export interface SSRoom { id: string; number: string; dailyRate: number; status: SSStatus; guestName: string | null; checkIn: string | null; checkInTime?: string | null; checkOut: string | null; phone?: string | null; rate?: number | null; advance?: number | null; payMethod?: PaymentMethod | null; idType?: string | null; idPhotoUrl?: string | null; }
export interface SSStay { id: string; guestName: string; roomNumber: string; checkIn: string; checkOut: string; nights: number; total: number; createdAt: string; rate?: number; advance?: number; balance?: number; paymentMethod?: PaymentMethod; idPhotoUrl?: string | null; }

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'leave';
export interface Attendance { id: string; staffId: string; date: string; status: AttendanceStatus; }
export type Shift = 'morning' | 'evening' | 'night' | 'off';
export interface ScheduleEntry { id: string; staffId: string; day: number; shift: Shift; } // day: 0=Mon … 6=Sun
