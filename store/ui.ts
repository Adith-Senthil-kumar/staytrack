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
}));
