import { create } from 'zustand';

interface UIState {
  isOnline: boolean;
  theme: 'light' | 'dark';
  searchQuery: string;
  selectedCategory: string | null;
  showOrderSuccess: boolean;

  setOnline: (online: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setShowOrderSuccess: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isOnline: true,
  theme: 'light',
  searchQuery: '',
  selectedCategory: null,
  showOrderSuccess: false,

  setOnline: (online) => set({ isOnline: online }),
  setTheme: (theme) => set({ theme }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setShowOrderSuccess: (show) => set({ showOrderSuccess: show }),
}));
