import * as Haptics from "expo-haptics";
import { memo, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { MenuItem } from "../data/menu";
import { useTheme } from "../theme/theme";
import MenuImage from "./MenuImage";

type Props = {
  item: MenuItem;
  qty: number;
  onAdd: (item: MenuItem) => void;
  onRemove: (item: MenuItem) => void;
};

function MenuItemCard({ item, qty, onAdd, onRemove }: Props) {
  const { colors } = useTheme();
  const pop = useSharedValue(1);

  // Subtle "pop" whenever the quantity changes (do-6 animation).
  useEffect(() => {
    if (qty > 0) {
      pop.value = withSequence(
        withTiming(1.28, { duration: 130 }),
        withTiming(1, { duration: 130 }),
      );
    }
  }, [pop, qty]);

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));

  const handleAdd = () => {
    onAdd(item);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const handleRemove = () => {
    onRemove(item);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {item.image ? (
        <MenuImage source={item.image} style={styles.photo} />
      ) : (
        <View style={[styles.photo, { backgroundColor: colors.surfaceSoft }]}>
          <Text style={styles.emoji}>🍽️</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        {item.note && (
          <Text style={[styles.note, { color: colors.textMuted }]}>
            {item.note}
          </Text>
        )}
        <Text style={[styles.price, { color: colors.accent }]}>
          {item.price}
        </Text>
      </View>

      {qty === 0 ? (
        <Pressable
          style={[styles.addBtn, { borderColor: colors.accent }]}
          onPress={handleAdd}
        >
          <Text style={[styles.addText, { color: colors.accent }]}>+ Add</Text>
        </Pressable>
      ) : (
        <Animated.View
          style={[
            styles.stepper,
            { backgroundColor: colors.primary },
            popStyle,
          ]}
        >
          <Pressable onPress={handleRemove} style={styles.stepBtn}>
            <Text style={styles.stepText}>−</Text>
          </Pressable>
          <Text style={styles.qty}>{qty}</Text>
          <Pressable onPress={handleAdd} style={styles.stepBtn}>
            <Text style={styles.stepText}>+</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  photo: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  emoji: { fontSize: 28 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  note: { fontSize: 12, marginTop: 2 },
  price: { fontSize: 15, fontWeight: "700", marginTop: 4 },
  addBtn: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  addText: { fontWeight: "700" },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    marginLeft: 8,
  },
  stepBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  stepText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  qty: {
    color: "#fff",
    fontWeight: "700",
    minWidth: 18,
    textAlign: "center",
  },
});

export default memo(MenuItemCard);