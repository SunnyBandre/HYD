import { useColorScheme } from "react-native";

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceSoft: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryDeep: string;
  accent: string;
  accentSoft: string;
  border: string;
  danger: string;
  whatsapp: string;
  skeleton: string;
  onPrimary: string;
};

/** Hyderabadi palette — Charminar brick maroon, royal gold, warm cream. */
export const lightColors: ThemeColors = {
  background: "#FBF2E1",
  surface: "#FFFFFF",
  surfaceSoft: "#F1E2C0",
  text: "#33130B",
  textMuted: "#8A6B50",
  primary: "#6E1E2B",
  primaryDeep: "#4A0F18",
  accent: "#C9962E",
  accentSoft: "#F5E7C4",
  border: "#E5D2AC",
  danger: "#B3261E",
  whatsapp: "#25D366",
  skeleton: "#E4CA9B",
  onPrimary: "#FFF6E5",
};

export const darkColors: ThemeColors = {
  background: "#1B110A",
  surface: "#2A1A10",
  surfaceSoft: "#3A2613",
  text: "#F6EBD9",
  textMuted: "#BE9F7E",
  primary: "#A14557",
  primaryDeep: "#562031",
  accent: "#D9A94A",
  accentSoft: "#422F17",
  border: "#4A331E",
  danger: "#E5524A",
  whatsapp: "#25D366",
  skeleton: "#4A3220",
  onPrimary: "#FFF6E5",
};

export const SPLASH_BG = "#4A0F18";

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  return { colors: isDark ? darkColors : lightColors, isDark };
}