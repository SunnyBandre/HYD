import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import MenuItemCard from "../components/MenuItemCard";
import { useCart } from "../context/CartContext";
import { MenuItem, menu } from "../data/menu";
import { useTheme } from "../theme/theme";

export default function MenuScreen() {
  const router = useRouter();
  const { add, remove, qtyOf, count, total } = useCart();
  const { colors } = useTheme();
  const [selected, setSelected] = useState(0);
  const category = menu[selected];

  const renderItem = useCallback(
    ({ item }: { item: MenuItem }) => (
      <MenuItemCard item={item} qty={qtyOf(item)} onAdd={add} onRemove={remove} />
    ),
    [add, qtyOf, remove],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <Text style={[styles.title, { color: colors.text }]}>Our Menu</Text>

      <View style={{ height: 52 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {menu.map((c, i) => (
            <Pressable
              key={c.title}
              onPress={() => setSelected(i)}
              style={[
                styles.chip,
                { backgroundColor: colors.surfaceSoft },
                i === selected && { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: colors.text },
                  i === selected && { color: colors.onPrimary },
                ]}
              >
                {c.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={category.items}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        renderItem={renderItem}
      />

      {count > 0 && (
        <Pressable
          style={[styles.cartBar, { backgroundColor: colors.primaryDeep }]}
          onPress={() => router.push("/cart")}
        >
          <Text style={styles.cartBarText}>
            View Cart · {count} item{count > 1 ? "s" : ""}
          </Text>
          <Text style={styles.cartBarText}>${total.toFixed(2)}</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontFamily: "RozhaOne",
    fontSize: 28,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  chips: { paddingHorizontal: 12, alignItems: "center" },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  chipText: { fontWeight: "600" },
  cartBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cartBarText: { color: "#FFF6E5", fontWeight: "700", fontSize: 16 },
});