// app/stores/usuarioStore.ts
import { create } from 'zustand';

interface UserState {
  name: string | null;
  role: string | null;
  imageUrl: string | null;
  email: string | null;
  setUser: (name: string, role: string, imageUrl: string, email: string) => void;
  updateUser: (partial: Partial<Omit<UserState, 'setUser' | 'updateUser'>>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: null,
  role: null,
  imageUrl: null,
  email: null,
  setUser: (name, role, imageUrl, email) => set({ name, role, imageUrl, email }),
  updateUser: (partial) =>
    set((state) => ({ ...state, ...partial })),
  clearUser: () => set({ name: null, role: null, imageUrl: null, email: null }),
}));

