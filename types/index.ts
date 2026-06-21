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
  documents?: string[]; // labels of docs on file (subset of ALL_DOCS)
}

// `status` is DERIVED via dueStatus(); only these fields are stored.
export interface Due {
  id: string;
  tenantId: string;
  monthKey: string;   // "2026-06"
  amountDue: number;
  amountPaid: number;
  paidAt: string | null; // ISO timestamp of last payment
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
export interface MaintTicket { id: string; roomNumber: string; category: MaintCategory; issue: string; priority: MaintPriority; status: MaintStatus; createdDate: string; cost: number; vendorId?: string | null; resolvedDate?: string | null; photo?: boolean; }

export type VendorTrade = 'plumber' | 'electrician' | 'carpenter' | 'ac' | 'other';
export interface Vendor { id: string; name: string; trade: VendorTrade; phone: string; jobs: number; }

export type SSStatus = 'available' | 'occupied' | 'cleaning';
export interface SSRoom { id: string; number: string; dailyRate: number; status: SSStatus; guestName: string | null; checkIn: string | null; checkOut: string | null; }
export interface SSStay { id: string; guestName: string; roomNumber: string; checkIn: string; checkOut: string; nights: number; total: number; createdAt: string; }

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'leave';
export interface Attendance { id: string; staffId: string; date: string; status: AttendanceStatus; }
export type Shift = 'morning' | 'evening' | 'night' | 'off';
export interface ScheduleEntry { id: string; staffId: string; day: number; shift: Shift; } // day: 0=Mon … 6=Sun
