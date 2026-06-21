import { create } from 'zustand';

type UiState = {
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  selectedTenantId: string | null;
  selectTenant: (id: string) => void;
  clearSelection: () => void;
  selectedStaffId: string | null;
  selectStaff: (id: string) => void;
  clearStaffSelection: () => void;
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
  payslipStaffId: string | null;
  openPayslip: (id: string) => void;
  closePayslip: () => void;
  showLogLeave: boolean;
  openLogLeave: () => void;
  closeLogLeave: () => void;
  vendorModalId: string | 'new' | null;
  openAddVendor: () => void;
  openEditVendor: (id: string) => void;
  closeVendor: () => void;
  selectedTicketId: string | null;
  selectTicket: (id: string) => void;
  clearTicketSelection: () => void;
  ssReceiptStayId: string | null;
  openSSReceipt: (id: string) => void;
  closeSSReceipt: () => void;
  showAddTenant: boolean;
  assignRoomId: string | null;
  openAddTenant: (roomId?: string) => void;
  closeAddTenant: () => void;
  showManageRooms: boolean;
  openManageRooms: () => void;
  closeManageRooms: () => void;
  selectedRoomId: string | null;
  selectRoom: (id: string) => void;
  clearRoomSelection: () => void;
  searchTerm: string;
  setSearch: (t: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  drawerOpen: false,
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  selectedTenantId: null,
  selectTenant: (id) => set({ selectedTenantId: id }),
  clearSelection: () => set({ selectedTenantId: null }),
  selectedStaffId: null,
  selectStaff: (id) => set({ selectedStaffId: id }),
  clearStaffSelection: () => set({ selectedStaffId: null }),
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
  payslipStaffId: null,
  openPayslip: (id) => set({ payslipStaffId: id }),
  closePayslip: () => set({ payslipStaffId: null }),
  showLogLeave: false,
  openLogLeave: () => set({ showLogLeave: true }),
  closeLogLeave: () => set({ showLogLeave: false }),
  vendorModalId: null,
  openAddVendor: () => set({ vendorModalId: 'new' }),
  openEditVendor: (id) => set({ vendorModalId: id }),
  closeVendor: () => set({ vendorModalId: null }),
  selectedTicketId: null,
  selectTicket: (id) => set({ selectedTicketId: id }),
  clearTicketSelection: () => set({ selectedTicketId: null }),
  ssReceiptStayId: null,
  openSSReceipt: (id) => set({ ssReceiptStayId: id }),
  closeSSReceipt: () => set({ ssReceiptStayId: null }),
  showAddTenant: false,
  assignRoomId: null,
  openAddTenant: (roomId) => set({ showAddTenant: true, assignRoomId: roomId ?? null }),
  closeAddTenant: () => set({ showAddTenant: false, assignRoomId: null }),
  showManageRooms: false,
  openManageRooms: () => set({ showManageRooms: true }),
  closeManageRooms: () => set({ showManageRooms: false }),
  selectedRoomId: null,
  selectRoom: (id) => set({ selectedRoomId: id }),
  clearRoomSelection: () => set({ selectedRoomId: null }),
  searchTerm: '',
  setSearch: (t) => set({ searchTerm: t }),
}));
