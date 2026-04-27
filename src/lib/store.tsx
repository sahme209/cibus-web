"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem, Cart, FoodItem, CustomizationOption, User, DeliveryAddress } from "./types";
import * as api from "./api";

// --- Cart Context ---

interface PendingSwitch {
  item: FoodItem;
  quantity: number;
  options: CustomizationOption[];
  instructions: string;
  fromRestaurant: string;
}

interface CartContextType {
  cart: Cart;
  addItem: (
    item: FoodItem,
    quantity: number,
    options: CustomizationOption[],
    instructions: string
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  pendingSwitch: PendingSwitch | null;
  confirmSwitch: () => void;
  cancelSwitch: () => void;
}

const emptyCart: Cart = { items: [], restaurantID: null, restaurantName: null };

const CartContext = createContext<CartContextType>({
  cart: emptyCart,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotal: 0,
  pendingSwitch: null,
  confirmSwitch: () => {},
  cancelSwitch: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

// --- Auth Context ---

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    phone: string
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// --- Address Context ---

interface AddressContextType {
  addresses: DeliveryAddress[];
  selectedAddress: DeliveryAddress | null;
  selectAddress: (address: DeliveryAddress) => void;
  refreshAddresses: () => Promise<void>;
}

const AddressContext = createContext<AddressContextType>({
  addresses: [],
  selectedAddress: null,
  selectAddress: () => {},
  refreshAddresses: async () => {},
});

export function useAddress() {
  return useContext(AddressContext);
}

// --- Combined Provider ---

export function StoreProvider({ children }: { children: ReactNode }) {
  // Cart
  const [cart, setCart] = useState<Cart>(() => {
    if (typeof window === "undefined") return emptyCart;
    const saved = localStorage.getItem("hubb_cart");
    return saved ? JSON.parse(saved) : emptyCart;
  });
  const [pendingSwitch, setPendingSwitch] = useState<PendingSwitch | null>(null);

  useEffect(() => {
    localStorage.setItem("hubb_cart", JSON.stringify(cart));
  }, [cart]);

  const confirmSwitch = useCallback(() => {
    if (!pendingSwitch) return;
    const { item, quantity, options, instructions } = pendingSwitch;
    setCart({
      items: [
        {
          id: `${item.id}_${Date.now()}`,
          foodItem: item,
          quantity,
          selectedOptions: options,
          specialInstructions: instructions,
        },
      ],
      restaurantID: item.restaurantID,
      restaurantName: item.restaurantName,
    });
    setPendingSwitch(null);
  }, [pendingSwitch]);

  const cancelSwitch = useCallback(() => setPendingSwitch(null), []);

  const addItem = useCallback(
    (
      item: FoodItem,
      quantity: number,
      options: CustomizationOption[],
      instructions: string
    ) => {
      setCart((prev) => {
        if (prev.restaurantID && prev.restaurantID !== item.restaurantID) {
          setPendingSwitch({
            item,
            quantity,
            options,
            instructions,
            fromRestaurant: prev.restaurantName || "another restaurant",
          });
          return prev;
        }

        const existing = prev.items.find(
          (ci) =>
            ci.foodItem.id === item.id &&
            JSON.stringify(ci.selectedOptions) === JSON.stringify(options)
        );

        if (existing) {
          return {
            ...prev,
            items: prev.items.map((ci) =>
              ci.id === existing.id
                ? { ...ci, quantity: ci.quantity + quantity }
                : ci
            ),
          };
        }

        return {
          items: [
            ...prev.items,
            {
              id: `${item.id}_${Date.now()}`,
              foodItem: item,
              quantity,
              selectedOptions: options,
              specialInstructions: instructions,
            },
          ],
          restaurantID: item.restaurantID,
          restaurantName: item.restaurantName,
        };
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setCart((prev) => {
      const items = prev.items.filter((ci) => ci.id !== id);
      if (items.length === 0) return emptyCart;
      return { ...prev, items };
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((ci) =>
        ci.id === id ? { ...ci, quantity } : ci
      ),
    }));
  }, [removeItem]);

  const clearCart = useCallback(() => setCart(emptyCart), []);

  const itemCount = cart.items.reduce((sum, ci) => sum + ci.quantity, 0);
  const subtotal = cart.items.reduce(
    (sum, ci) =>
      sum +
      ci.quantity *
        (ci.foodItem.price +
          ci.selectedOptions.reduce((s, o) => s + o.additionalCost, 0)),
    0
  );

  // Auth
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("hubb_token");
    if (token) {
      api
        .getUserProfile()
        .then((u) => setUser(u))
        .catch((err) => {
          if (err instanceof api.APIError && err.status === 401) {
            localStorage.removeItem("hubb_token");
          }
        })
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }

    function handleAuthExpired() {
      setUser(null);
    }
    window.addEventListener("hubb:auth-expired", handleAuthExpired);
    return () => window.removeEventListener("hubb:auth-expired", handleAuthExpired);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: u } = await api.signIn(email, password);
    setUser(u);
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string, phone: string) => {
      const { user: u } = await api.signUp(name, email, password, phone);
      setUser(u);
    },
    []
  );

  const logout = useCallback(() => {
    api.signOut();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const u = await api.getUserProfile();
      setUser(u);
    } catch {
      // silent
    }
  }, []);

  // Addresses
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<DeliveryAddress | null>(null);

  const refreshAddresses = useCallback(async () => {
    if (!user) return;
    try {
      const addrs = await api.getUserAddresses();
      setAddresses(addrs);
      if (!selectedAddress && addrs.length > 0) {
        setSelectedAddress(addrs[0]);
      }
    } catch {
      // ignore
    }
  }, [user, selectedAddress]);

  useEffect(() => {
    if (user) refreshAddresses();
  }, [user, refreshAddresses]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading: authLoading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      <CartContext.Provider
        value={{
          cart,
          addItem,
          removeItem,
          updateQuantity,
          clearCart,
          itemCount,
          subtotal,
          pendingSwitch,
          confirmSwitch,
          cancelSwitch,
        }}
      >
        <AddressContext.Provider
          value={{
            addresses,
            selectedAddress,
            selectAddress: setSelectedAddress,
            refreshAddresses,
          }}
        >
          {children}
        </AddressContext.Provider>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}
