export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  imageURL: string;
  logoURL?: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  distance: string;
  isOpen: boolean;
  isFeatured: boolean;
  tags: string[];
  menu: FoodCategory[];
}

export interface FoodCategory {
  id: string;
  name: string;
  items: FoodItem[];
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageURL: string;
  category: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  isPopular: boolean;
  restaurantID: string;
  restaurantName: string;
  ingredients: string[];
  customizationOptions: CustomizationOption[];
  discountPercentage: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  additionalCost: number;
  isSelected: boolean;
}

export interface CartItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  selectedOptions: CustomizationOption[];
  specialInstructions: string;
}

export interface Cart {
  items: CartItem[];
  restaurantID: string | null;
  restaurantName: string | null;
}

export interface DeliveryAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  restaurantName: string;
  restaurantImageURL: string;
  deliveryAddress: DeliveryAddress;
  placedAt: string;
  estimatedDelivery: string;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
}

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "on_the_way"
  | "delivered"
  | "cancelled";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: DeliveryAddress[];
}
