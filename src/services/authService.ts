import { User } from "@/models/user";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export const login = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password }); ///auth/login
  console.log(response.data);
  return response.data;
};

export const register = async (userData: User) => {
  const response = await api.post("", userData);
  return response.data;
};

export const logout = () => {
  (useAuthStore.getState() as { logout: () => void }).logout();
};

export const getUserProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};