import { create } from 'zustand';

type UiState = {
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  selectedTenantId: string | null;
  selectTenant: (id: string) => void;
  clearSelection: () => void;
  payDueId: string | null;
  openPay: (dueId: string) => void;
  closePay: () => void;
  showExpense: boolean;
  openExpense: () => void;
  closeExpense: () => void;
  showManage: boolean;
  openManage: () => void;
  closeManage: () => void;
  showAddStaff: boolean;
  openAddStaff: () => void;
  closeAddStaff: () => void;
  showLogTicket: boolean;
  openLogTicket: () => void;
  closeLogTicket: () => void;
  ssAddRoomOpen: boolean;
  openSSAddRoom: () => void;
  closeSSAddRoom: () => void;
  bookingRoomId: string | null;
  openBooking: (id: string) => void;
  closeBooking: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  drawerOpen: false,
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  selectedTenantId: null,
  selectTenant: (id) => set({ selectedTenantId: id }),
  clearSelection: () => set({ selectedTenantId: null }),
  payDueId: null,
  openPay: (dueId) => set({ payDueId: dueId }),
  closePay: () => set({ payDueId: null }),
  showExpense: false,
  openExpense: () => set({ showExpense: true }),
  closeExpense: () => set({ showExpense: false }),
  showManage: false,
  openManage: () => set({ showManage: true }),
  closeManage: () => set({ showManage: false }),
  showAddStaff: false,
  openAddStaff: () => set({ showAddStaff: true }),
  closeAddStaff: () => set({ showAddStaff: false }),
  showLogTicket: false,
  openLogTicket: () => set({ showLogTicket: true }),
  closeLogTicket: () => set({ showLogTicket: false }),
  ssAddRoomOpen: false,
  openSSAddRoom: () => set({ ssAddRoomOpen: true }),
  closeSSAddRoom: () => set({ ssAddRoomOpen: false }),
  bookingRoomId: null,
  openBooking: (id) => set({ bookingRoomId: id }),
  closeBooking: () => set({ bookingRoomId: null }),
}));
