import { create } from "zustand";

export interface Toast {
  id: string;
  type: "success" | "error" | "achievement" | "reminder" | "info";
  title: string;
  message?: string;
  duration?: number;
  icon?: string;
}

interface UIState {
  toasts: Toast[];
  modalOpen: string | null;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  confettiActive: boolean;

  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  openModal: (key: string) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  triggerConfetti: () => void;
  stopConfetti: () => void;
}

let toastId = 0;

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  modalOpen: null,
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  confettiActive: false,

  addToast: (toast) => {
    const id = `toast-${++toastId}`;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    const duration = toast.duration ?? 4000;
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  openModal: (key) => set({ modalOpen: key }),
  closeModal: () => set({ modalOpen: null }),

  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

  toggleMobileSidebar: () =>
    set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),

  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),

  triggerConfetti: () => {
    set({ confettiActive: true });
    setTimeout(() => set({ confettiActive: false }), 4000);
  },

  stopConfetti: () => set({ confettiActive: false }),
}));
