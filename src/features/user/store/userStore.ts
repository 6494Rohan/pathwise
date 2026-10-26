import { create } from 'zustand';

interface UserState {
  currentUserId: string | null;
  accessToken: string | null;
  signIn: (userId: string, accessToken: string) => void;
  signOut: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUserId: null,
  accessToken: null,
  signIn: (currentUserId, accessToken) => set({ currentUserId, accessToken }),
  signOut: () => set({ currentUserId: null, accessToken: null }),
}));
