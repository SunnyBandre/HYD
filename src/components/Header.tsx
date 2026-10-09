import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useCart } from "../context/CartContext";
import { useTheme } from "../theme/theme";
import Logo from "./Logo";

export default function Header() {
  const router = useRouter();
  const { count } = useCart();
  const { colors } = useTheme();
  const badgeScale = useSharedValue(1);

  // Little bounce on the cart badge whenever the count changes.
  useEffect(() => {
    if (count > 0) {
      badgeScale.value = withSequence(
        withSpring(1.35, { damping: 8 }),
        withSpring(1, { damping: 8 }),
      );
    }
  }, [badgeScale, count]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: colors.background, borderBottomColor: colors.border },
      ]}
    >
      <Logo height={36} />

      <Pressable
        onPress={() => router.push("/cart")}
        style={styles.cartButton}
        hitSlop={10}
      >
        <Ionicons name="cart-outline" size={30} color={colors.text} />
        {count > 0 && (
          <Animated.View
            style={[styles.badge, { backgroundColor: colors.accent }, badgeStyle]}
          >
            <Text style={styles.badgeText}>{count > 99 ? "99+" : count}</Text>
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  logo: { borderRadius: 12, marginRight: 8 },
  cartButton: { padding: 4 },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "800" },
});