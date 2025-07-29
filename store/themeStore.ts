import { create } from "zustand";
import { IColor, OCEAN } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeState {
  COLORS: IColor;
  setColors: (color: IColor) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  COLORS: OCEAN,

  setColors: async(color: IColor) => {
    await AsyncStorage.setItem ("COLORS", JSON.stringify(color));
    set({ COLORS: color });
  },
}));

const getCurrentColors = () => useThemeStore.getState().COLORS;
export const COLORS = getCurrentColors();


