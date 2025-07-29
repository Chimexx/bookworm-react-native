import { User } from "@/interfaces";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/api";

// Define the shape of the register response
interface RegisterRes {
  success: boolean;
  error?: string | null;
}

// Define the shape of your Zustand store
interface AuthState {
  user: User | null;
  token: string;
  isLoading: boolean;
  error: string;
  isAuthChecked: boolean;
  isCheckingAuth: boolean;
  setUser: (user: User) => void;
  setIsLoading: (loading: boolean) => void;
  checkAuth: () => void;
  logOut: () => void;
  login: (email: string, password: string) => Promise<RegisterRes>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<RegisterRes>;
}

// Create Zustand store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: "",
  isLoading: false,
  isAuthChecked: false,
  isCheckingAuth: true,
  error: "",

  setUser: (user: User) => {
    set({ user });
  },

  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  register: async (
    userName: string,
    email: string,
    password: string
  ): Promise<RegisterRes> => {
    set({ isLoading: true, error: "" });

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register user");
      }

      set({ user: data.user, token: data.token });
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ isLoading: false });

      return { success: true };
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  login: async (email: string, password: string): Promise<RegisterRes> => {
    set({ isLoading: true, error: "" });

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to login user");
      }

      set({ user: data.user, token: data.token });
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ isLoading: false });

      return { success: true };
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  checkAuth: async () => {
    try {
      const token = (await AsyncStorage.getItem("token")) || "";
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      set({ token, user, isAuthChecked: true });
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  logOut: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ token: "", user: null });
  },
}));
