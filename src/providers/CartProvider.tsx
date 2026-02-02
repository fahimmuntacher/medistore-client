"use client";

import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { createContext, useContext, useReducer, useEffect, useCallback } from "react";


// Types
export type CartItem = {
  medicineId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isLoading: boolean;
};

type CartAction =
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "UPDATE_QUANTITY"; payload: { medicineId: string; change: number } }
  | { type: "REMOVE_ITEM"; payload: { medicineId: string } }
  | { type: "CLEAR_CART" };

// Reducer
const initialState: CartState = { items: [], isLoading: true };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload, isLoading: false };
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.medicineId === action.payload.medicineId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.medicineId === action.payload.medicineId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.medicineId === action.payload.medicineId
              ? { ...i, quantity: i.quantity + action.payload.change }
              : i
          )
          .filter((i) => i.quantity > 0),
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.medicineId !== action.payload.medicineId),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

// Context
type CartContextType = {
  items: CartItem[];
  isLoading: boolean;
  totalItems: number;
  subtotal: number;
  addToCart: (medicine: Omit<CartItem, "quantity">) => Promise<void>;
  incrementItem: (medicineId: string) => Promise<void>;
  decrementItem: (medicineId: string) => Promise<void>;
  removeFromCart: (medicineId: string) => Promise<void>;
  placeOrder: (paymentMethod: "COD" | "ONLINE") => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
const STORAGE_KEY = "medistore_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isLoggedIn, loading: authLoading } = useAuth();

  // Hydrate cart
  useEffect(() => {
    if (authLoading) return;

    const hydrate = async () => {
      let items: CartItem[] = [];
      if (!isLoggedIn) {
        const saved = localStorage.getItem(STORAGE_KEY);
        items = saved ? JSON.parse(saved) : [];
      } else {
        try {
          const res = await api.get("/cart");
          items = res.data.items || [];
        } catch {
          items = [];
        }
      }
      dispatch({ type: "SET_ITEMS", payload: items });
    };

    hydrate();
  }, [isLoggedIn, authLoading]);

  // Sync guest cart to localStorage
  useEffect(() => {
    if (!isLoggedIn && !state.isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    }
  }, [state.items, isLoggedIn, state.isLoading]);

  // Mutations
  const addToCart = useCallback(
    async (medicine: Omit<CartItem, "quantity">) => {
      if (!isLoggedIn) {
        dispatch({ type: "ADD_ITEM", payload: medicine });
        return;
      }
      await api.post("/cart", { medicineId: medicine.medicineId, quantity: 1 });
      const res = await api.get("/cart");
      dispatch({ type: "SET_ITEMS", payload: res.data.items || [] });
    },
    [isLoggedIn]
  );

  const incrementItem = useCallback(
    async (medicineId: string) => {
      if (!isLoggedIn) {
        dispatch({ type: "UPDATE_QUANTITY", payload: { medicineId, change: 1 } });
        return;
      }
      await api.post("/cart", { medicineId, quantity: 1 });
      const res = await api.get("/cart");
      dispatch({ type: "SET_ITEMS", payload: res.data.items || [] });
    },
    [isLoggedIn]
  );

  const decrementItem = useCallback(
    async (medicineId: string) => {
      if (!isLoggedIn) {
        dispatch({ type: "UPDATE_QUANTITY", payload: { medicineId, change: -1 } });
        return;
      }
      await api.post("/cart", { medicineId, quantity: -1 });
      const res = await api.get("/cart");
      dispatch({ type: "SET_ITEMS", payload: res.data.items || [] });
    },
    [isLoggedIn]
  );

  const removeFromCart = useCallback(
    async (medicineId: string) => {
      if (!isLoggedIn) {
        dispatch({ type: "REMOVE_ITEM", payload: { medicineId } });
        return;
      }
      await api.delete(`/cart/${medicineId}`);
      const res = await api.get("/cart");
      dispatch({ type: "SET_ITEMS", payload: res.data.items || [] });
    },
    [isLoggedIn]
  );

  const placeOrder = useCallback(
    async (paymentMethod: "COD" | "ONLINE") => {
      if (state.items.length === 0) return;

      await api.post("/orders", {
        paymentMethod,
        items: state.items.map((i) => ({ medicineId: i.medicineId, quantity: i.quantity })),
      });

      dispatch({ type: "CLEAR_CART" });
      if (!isLoggedIn) localStorage.removeItem(STORAGE_KEY);
    },
    [state.items, isLoggedIn]
  );

  // Derived
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isLoading: state.isLoading,
        totalItems,
        subtotal,
        addToCart,
        incrementItem,
        decrementItem,
        removeFromCart,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be inside CartProvider");
  return context;
}