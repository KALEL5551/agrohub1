import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  mobileNavOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  toggleMobileNav: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  closeMobileNav: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  mobileNavOpen: false,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
  setTheme: (theme) => set({ theme }),
  closeMobileNav: () => set({ mobileNavOpen: false }),
}));
