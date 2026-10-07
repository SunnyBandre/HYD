import { useRouter } from "expo-router";
import {
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { parsePrice, useCart } from "../context/CartContext";

const WHATSAPP_NUMBER = "18325087112";

export default function CartScreen() {
  const router = useRouter();
  const { lines, add, remove, clear, total } = useCart();

  const sendOrder = () => {
    const details = lines
      .map(
        (l) =>
          `${l.qty} x ${l.item.name} - $${(l.qty * parsePrice(l.item.price)).toFixed(2)}`,
      )
      .join("\n");
    const message = `Hello! I'd like to order:\n\n${details}\n\nTotal: $${total.toFixed(2)}`;
    Linking.openURL(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Menu</Text>
        </Pressable>
        <Text style={styles.header}>Your Cart</Text>
        {lines.length > 0 ? (
          <Pressable onPress={clear}>
            <Text style={styles.clear}>Clear</Text>
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {lines.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 48 }}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={lines}
            keyExtractor={(l) => l.item.name}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item: l }) => (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{l.item.name}</Text>
                  <Text style={styles.sub}>{l.item.price} each</Text>
                </View>
                <View style={styles.stepper}>
                  <Pressable
                    onPress={() => remove(l.item)}
                    style={styles.stepBtn}
                  >
                    <Text style={styles.stepText}>−</Text>
                  </Pressable>
                  <Text style={styles.qty}>{l.qty}</Text>
                  <Pressable onPress={() => add(l.item)} style={styles.stepBtn}>
                    <Text style={styles.stepText}>+</Text>
                  </Pressable>
                </View>
                <Text style={styles.lineTotal}>
                  ${(l.qty * parsePrice(l.item.price)).toFixed(2)}
                </Text>
              </View>
            )}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <Pressable style={styles.orderBtn} onPress={sendOrder}>
              <Text style={styles.orderText}>Order on WhatsApp</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF6E5" },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  back: { color: "#D98324", fontWeight: "700", fontSize: 16 },
  header: { fontSize: 22, fontWeight: "800", color: "#3B1F0F" },
  clear: { color: "#B3261E", fontWeight: "600" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { marginTop: 8, fontSize: 16, color: "#8A6B50" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  name: { fontSize: 15, fontWeight: "600", color: "#3B1F0F" },
  sub: { fontSize: 12, color: "#8A6B50", marginTop: 2 },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D98324",
    borderRadius: 8,
    marginHorizontal: 10,
  },
  stepBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  stepText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  qty: { color: "#fff", fontWeight: "700", minWidth: 18, textAlign: "center" },
  lineTotal: {
    width: 64,
    textAlign: "right",
    fontWeight: "700",
    color: "#3B1F0F",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1DFC0",
    backgroundColor: "#FFF6E5",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: { fontSize: 18, fontWeight: "600", color: "#3B1F0F" },
  totalValue: { fontSize: 20, fontWeight: "800", color: "#D98324" },
  orderBtn: {
    backgroundColor: "#25D366",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  orderText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
