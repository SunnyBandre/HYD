import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { menu } from "../data/menu";

export default function MenuScreen() {
  const router = useRouter();
  const { add, remove, qtyOf, count, total } = useCart();
  const [selected, setSelected] = useState(0);
  const category = menu[selected];

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.title}>Our Menu</Text>

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
              style={[styles.chip, i === selected && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  i === selected && styles.chipTextActive,
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
        renderItem={({ item }) => {
          const qty = qtyOf(item);
          return (
            <View style={styles.card}>
              {item.image ? (
                <Image source={item.image} style={styles.photo} />
              ) : (
                <View style={[styles.photo, styles.placeholder]}>
                  <Text style={{ fontSize: 28 }}>🍽️</Text>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                {item.note && <Text style={styles.note}>{item.note}</Text>}
                <Text style={styles.price}>{item.price}</Text>
              </View>

              {qty === 0 ? (
                <Pressable style={styles.addBtn} onPress={() => add(item)}>
                  <Text style={styles.addText}>+ Add</Text>
                </Pressable>
              ) : (
                <View style={styles.stepper}>
                  <Pressable
                    onPress={() => remove(item)}
                    style={styles.stepBtn}
                  >
                    <Text style={styles.stepText}>−</Text>
                  </Pressable>
                  <Text style={styles.qty}>{qty}</Text>
                  <Pressable onPress={() => add(item)} style={styles.stepBtn}>
                    <Text style={styles.stepText}>+</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        }}
      />

      {count > 0 && (
        <Pressable style={styles.cartBar} onPress={() => router.push("/cart")}>
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
  container: { flex: 1, backgroundColor: "#FFF6E5" },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#3B1F0F",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  chips: { paddingHorizontal: 12, alignItems: "center" },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1DFC0",
    marginHorizontal: 4,
  },
  chipActive: { backgroundColor: "#3B1F0F" },
  chipText: { color: "#3B1F0F", fontWeight: "600" },
  chipTextActive: { color: "#FFF6E5" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  photo: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  placeholder: {
    backgroundColor: "#F1DFC0",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 16, fontWeight: "600", color: "#3B1F0F" },
  note: { fontSize: 12, color: "#8A6B50", marginTop: 2 },
  price: { fontSize: 15, fontWeight: "700", color: "#D98324", marginTop: 4 },
  addBtn: {
    borderWidth: 1.5,
    borderColor: "#D98324",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  addText: { color: "#D98324", fontWeight: "700" },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D98324",
    borderRadius: 8,
    marginLeft: 8,
  },
  stepBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  stepText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  qty: { color: "#fff", fontWeight: "700", minWidth: 18, textAlign: "center" },
  cartBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: "#3B1F0F",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cartBarText: { color: "#FFF6E5", fontWeight: "700", fontSize: 16 },
});
