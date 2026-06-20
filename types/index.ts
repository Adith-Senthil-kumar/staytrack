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
