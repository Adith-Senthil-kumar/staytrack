import { create } from 'zustand';

// A single app-wide confirm/notice dialog. Destructive actions route through
// `confirm(...)` so a stray tap can't permanently delete a record; `notify(...)`
// shows a blocking one-button notice (used when an action is disallowed).
export type ConfirmRequest = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm?: () => void; // omitted → notice (single OK button, no Cancel)
};

type ConfirmStore = {
  request: ConfirmRequest | null;
  confirm: (r: ConfirmRequest & { onConfirm: () => void }) => void;
  notify: (title: string, message?: string) => void;
  close: () => void;
};

export const useConfirmStore = create<ConfirmStore>((set) => ({
  request: null,
  confirm: (r) => set({ request: r }),
  notify: (title, message) => set({ request: { title, message } }),
  close: () => set({ request: null }),
}));

// Convenience helpers callable from any event handler without selecting the store.
export const confirmAction = (r: ConfirmRequest & { onConfirm: () => void }) => useConfirmStore.getState().confirm(r);
export const notify = (title: string, message?: string) => useConfirmStore.getState().notify(title, message);
