import { User } from "@/interfaces";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";


const baseUrl = process.env.BASE_URL;

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
  setUser: (user: User) => void;
  setIsLoading: (loading: boolean) => void;
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
      const response = await fetch(`${baseUrl}auth/register`, {
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
}));
