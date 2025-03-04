import { User } from "@/models/user";
import router from "next/router";
import { create } from "zustand";

type AuthState = {
  logout: () => void;
  token: string | null;
  userId: string | null;
  setToken: (token: string, userId: string) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  userId: typeof window !== "undefined" ? localStorage.getItem("userId") : null,

  setToken: (token: string, userId: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    set({ token });
  },
  logout: () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    set({ token: null, userId: null });
  },
}));
