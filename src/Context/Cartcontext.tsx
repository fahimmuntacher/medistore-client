"use client";

import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, CreditCard, DollarSign } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────
export type CartItem = {
  cartItemId: string;
  medicineId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isHydrated: boolean;
};

type CartAction =
  | { type: "HYDRATE"; payload: CartItem[] }
  | { type: "ADD"; payload: CartItem }
  | { type: "INCREMENT"; payload: { medicineId: string } }
  | { type: "DECREMENT"; payload: { medicineId: string } }
  | { type: "REMOVE"; payload: { medicineId: string } }
  | { type: "CLEAR" };

// ─── localStorage helpers ─────────────────────────────────────────────────
const STORAGE_KEY = "medistore_cart";

const readFromStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

// ─── Reducer ──────────────────────────────────────────────────────────────
const initialState: CartState = { items: [], isHydrated: false };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.payload, isHydrated: true };
    case "ADD": {
      const existing = state.items.find(
        (i) => i.medicineId === action.payload.medicineId,
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.medicineId === action.payload.medicineId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((i) =>
          i.medicineId === action.payload.medicineId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        ),
      };
    case "DECREMENT":
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.medicineId === action.payload.medicineId
              ? { ...i, quantity: i.quantity - 1 }
              : i,
          )
          .filter((i) => i.quantity > 0),
      };
    case "REMOVE":
      return {
        ...state,
        items: state.items.filter(
          (i) => i.medicineId !== action.payload.medicineId,
        ),
      };
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────
type CartContextValue = {
  items: CartItem[];
  isHydrated: boolean;
  totalItems: number;
  subtotal: number;
  addToCart: (medicine: {
    id: string;
    name: string;
    image: string;
    price: number;
  }) => void;
  removeFromCart: (medicineId: string) => void;
  incrementItem: (medicineId: string) => void;
  decrementItem: (medicineId: string) => void;
  placeOrder: (paymentMethod: "COD" | "ONLINE") => void;
};

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isLoggedIn, loading } = useAuth();

  // Hydrate from localStorage or DB
  useEffect(() => {
    if (loading) return;

    const hydrateCart = async () => {
      if (!isLoggedIn) {
        dispatch({ type: "HYDRATE", payload: readFromStorage() });
      } else {
        const res = await api.get("/cart");
        dispatch({ type: "HYDRATE", payload: res.data.items || [] });
      }
    };

    hydrateCart();
  }, [isLoggedIn, loading]);

  // Sync to localStorage for guests
  useEffect(() => {
    if (!state.isHydrated || isLoggedIn) return;
    writeToStorage(state.items);
  }, [state.items, state.isHydrated, isLoggedIn]);

  // ── derived values ───────────────────────────────
  const totalItems = state.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const subtotal =
    state.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  // ── mutations ───────────────────────────────────
  const addToCart = useCallback(
    async (medicine: any) => {
      if (!isLoggedIn) {
        dispatch({
          type: "ADD",
          payload: {
            cartItemId: "",
            medicineId: medicine.id,
            name: medicine.name,
            image: medicine.image,
            price: medicine.price,
            quantity: 1,
          },
        });
        return;
      }

      await api.post("/cart", { medicineId: medicine.id, quantity: 1 });
      const res = await api.get("/cart");
      dispatch({ type: "HYDRATE", payload: res.data.items });
    },
    [isLoggedIn],
  );

  const incrementItem = useCallback(
    async (medicineId: string) => {
      if (!isLoggedIn) {
        dispatch({ type: "INCREMENT", payload: { medicineId } });
        return;
      }

      await api.post("/cart", { medicineId, quantity: 1 });
      const res = await api.get("/cart");
      dispatch({ type: "HYDRATE", payload: res.data.items });
    },
    [isLoggedIn],
  );

  const decrementItem = useCallback(
    async (medicineId: string) => {
      if (!isLoggedIn) {
        dispatch({ type: "DECREMENT", payload: { medicineId } });
        return;
      }

      await api.post("/cart", { medicineId, quantity: -1 });
      const res = await api.get("/cart");
      dispatch({ type: "HYDRATE", payload: res.data.items });
    },
    [isLoggedIn],
  );

  const removeFromCart = useCallback(
    async (medicineId: string) => {
      if (!isLoggedIn) {
        dispatch({ type: "REMOVE", payload: { medicineId } });
        return;
      }

      await api.delete(`/cart/${medicineId}`);
      const res = await api.get("/cart");
      dispatch({ type: "HYDRATE", payload: res.data.items });
    },
    [isLoggedIn],
  );

  const placeOrder = useCallback(
    async (paymentMethod: "COD" | "ONLINE") => {
      if (state.items?.length === 0) return;

      await api.post("/orders", {
        paymentMethod,
        items: state.items.map((i) => ({
          medicineId: i.medicineId,
          quantity: i.quantity,
        })),
      });

      dispatch({ type: "CLEAR" });
      localStorage.removeItem(STORAGE_KEY);
    },
    [state.items],
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isHydrated: state.isHydrated,
        totalItems,
        subtotal,
        addToCart,
        removeFromCart,
        incrementItem,
        decrementItem,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }
  return context;
}

// ─── Cart Sidebar Component ───────────────────────────────────────────────
export function CartSidebar() {
  const {
    items,
    totalItems,
    subtotal,
    incrementItem,
    decrementItem,
    removeFromCart,
    placeOrder,
  } = useCart();

  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

  return (
    <>
      {/* Cart Button */}
      <Button onClick={() => setOpen(!open)}>Cart ({totalItems})</Button>

      {/* Sidebar */}
      {open && (
        <div className="fixed top-0 right-0 z-50 h-full w-96 bg-white shadow-lg p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Your Cart</h2>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {items?.length === 0 && <p>Your cart is empty</p>}
            {items.map((item) => (
              <div key={item.medicineId} className="flex gap-4 items-center">
                <img
                  src={item.image}
                  className="h-16 w-16 rounded-lg object-cover"
                  alt={item.name}
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p>${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => decrementItem(item.medicineId)}
                    >
                      <Minus />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => incrementItem(item.medicineId)}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeFromCart(item.medicineId)}
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex justify-between font-semibold">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setPaymentMethod("COD")}
                variant={paymentMethod === "COD" ? "default" : "outline"}
              >
                <DollarSign /> COD
              </Button>
              <Button
                onClick={() => setPaymentMethod("ONLINE")}
                variant={paymentMethod === "ONLINE" ? "default" : "outline"}
              >
                <CreditCard /> Online
              </Button>
            </div>

            <Button
              className="w-full mt-2"
              onClick={() => placeOrder(paymentMethod)}
              disabled={items.length === 0}
            >
              Place Order
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
