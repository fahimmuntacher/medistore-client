"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CartItem = {
  cartItemId: string;   // will hold the DB row id once the API exists
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

// ─── localStorage helpers ─────────────────────────────────────────────────────

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
  } catch {
    // silently ignore
  }
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState: CartState = { items: [], isHydrated: false };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.payload, isHydrated: true };

    case "ADD": {
      const existing = state.items.find(
        (i) => i.medicineId === action.payload.medicineId
      );
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
      return { ...state, items: [...state.items, action.payload] };
    }

    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((i) =>
          i.medicineId === action.payload.medicineId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };

    case "DECREMENT":
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.medicineId === action.payload.medicineId
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter((i) => i.quantity > 0),
      };

    case "REMOVE":
      return {
        ...state,
        items: state.items.filter(
          (i) => i.medicineId !== action.payload.medicineId
        ),
      };

    case "CLEAR":
      return { ...state, items: [] };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

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
  placeOrder: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: readFromStorage() });
  }, []);

  // Sync to localStorage whenever items change (only after initial hydration)
  useEffect(() => {
    if (state.isHydrated) {
      writeToStorage(state.items);
    }
  }, [state.items, state.isHydrated]);

  // ── derived values ──────────────────────────────────────────────────────

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // ── mutations (localStorage only — API calls will be added here later) ──
  // Every function just dispatches an action.
  // The useEffect above handles persisting to localStorage automatically.

  const addToCart = useCallback((medicine: {
    id: string;
    name: string;
    image: string;
    price: number;
  }) => {
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
  }, []);

  const removeFromCart = useCallback((medicineId: string) => {
    dispatch({ type: "REMOVE", payload: { medicineId } });
  }, []);

  const incrementItem = useCallback((medicineId: string) => {
    dispatch({ type: "INCREMENT", payload: { medicineId } });
  }, []);

  const decrementItem = useCallback((medicineId: string) => {
    dispatch({ type: "DECREMENT", payload: { medicineId } });
  }, []);

  const placeOrder = useCallback(() => {
    if (state.items.length === 0) return;
    // TODO: POST /orders with state.items, then dispatch CLEAR on success
    dispatch({ type: "CLEAR" });
  }, [state.items]);

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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }
  return context;
}