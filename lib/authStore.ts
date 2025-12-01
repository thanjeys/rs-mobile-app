import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import api, { setApiToken } from "./api";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

// Storage helpers that work on both native and web
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: true,

  restoreSession: async () => {
    const token = await storage.getItem("token");
    setApiToken(token);
    set({ token, isLoading: false });
  },

  login: async (username, password) => {
    try {
      const res = await api.post("auth/login", { username, password });
      const token = res.data.accessToken;

      await storage.setItem("token", token);
      setApiToken(token);
      set({ token });
      return true;
    } catch (err) {
      return false;
    }
  },

  logout: async () => {
    await storage.removeItem("token");
    setApiToken(null);
    set({ token: null });
  },
}));
