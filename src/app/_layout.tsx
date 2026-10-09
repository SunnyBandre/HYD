import { CartProvider } from "@/context/CartContext";
import { useTheme } from "@/theme/theme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const { isDark } = useTheme();
  const [fontsLoaded] = useFonts({
    RozhaOne: require("../assets/fonts/RozhaOne-Regular.ttf"),
  });

  // Keep the native splash up until the brand font is ready.
  if (!fontsLoaded) return null;

  return (
    <CartProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}