import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { MenuItem, menu } from "../data/menu";

export type CartLine = { item: MenuItem; qty: number };

type CartContextType = {
  lines: CartLine[];
  add: (item: MenuItem) => void;
  remove: (item: MenuItem) => void;
  qtyOf: (item: MenuItem) => number;
  clear: () => void;
  count: number;
  total: number;
};

const STORAGE_KEY = "hyd.cart.v1";

// "$6.99" -> 6.99
export const parsePrice = (p: string) =>
  parseFloat(p.replace(/[^0-9.]/g, "")) || 0;

const CartContext = createContext<CartContextType>(null as any);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Restore a saved cart on launch. We persist only { name, qty } so the
  // stored data stays valid even if bundle module ids change between builds.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved: { name: string; qty: number }[] = JSON.parse(raw);
          const byName = new Map(
            menu.flatMap((c) => c.items).map((i) => [i.name, i]),
          );
          const restored = saved.flatMap((s) => {
            const item = byName.get(s.name);
            return item ? [{ item, qty: s.qty }] : [];
          });
          setLines(restored);
        }
      } catch {
        // corrupted storage — start with an empty cart
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Persist every change once the initial restore has happened.
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(lines.map((l) => ({ name: l.item.name, qty: l.qty }))),
    ).catch(() => {});
  }, [hydrated, lines]);

  const add = useCallback((item: MenuItem) => {
    setLines((prev) => {
      const found = prev.find((l) => l.item.name === item.name);
      if (found) {
        return prev.map((l) =>
          l.item.name === item.name ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [...prev, { item, qty: 1 }];
    });
  }, []);

  const remove = useCallback((item: MenuItem) => {
    setLines((prev) =>
      prev
        .map((l) => (l.item.name === item.name ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const qtyOf = useCallback(
    (item: MenuItem) =>
      lines.find((l) => l.item.name === item.name)?.qty ?? 0,
    [lines],
  );

  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const total = lines.reduce(
    (sum, l) => sum + l.qty * parsePrice(l.item.price),
    0,
  );

  return (
    <CartContext.Provider
      value={{ lines, add, remove, qtyOf, clear, count, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);