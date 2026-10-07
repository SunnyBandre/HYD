import { createContext, ReactNode, useContext, useState } from "react";
import { MenuItem } from "../data/menu";

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

// "$6.99" -> 6.99
export const parsePrice = (p: string) =>
  parseFloat(p.replace(/[^0-9.]/g, "")) || 0;

const CartContext = createContext<CartContextType>(null as any);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = (item: MenuItem) =>
    setLines((prev) => {
      const found = prev.find((l) => l.item.name === item.name);
      if (found) {
        return prev.map((l) =>
          l.item.name === item.name ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [...prev, { item, qty: 1 }];
    });

  const remove = (item: MenuItem) =>
    setLines((prev) =>
      prev
        .map((l) => (l.item.name === item.name ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0),
    );

  const qtyOf = (item: MenuItem) =>
    lines.find((l) => l.item.name === item.name)?.qty ?? 0;
  const clear = () => setLines([]);
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
