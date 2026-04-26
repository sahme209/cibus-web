const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api-vtadzgdqca-uc.a.run.app";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("hubb_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("hubb_token");
      window.dispatchEvent(new Event("hubb:auth-expired"));
    }
    const body = await res.json().catch(() => ({}));
    throw new APIError(res.status, body.message || res.statusText);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "APIError";
  }
}

// --- Auth ---

export async function signIn(email: string, password: string) {
  const data = await request<{ token: string; user: any }>("/auth/sign-in", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("hubb_token", data.token);
  return data;
}

export async function signUp(
  name: string,
  email: string,
  password: string,
  phone: string
) {
  const data = await request<{ token: string; user: any }>("/auth/sign-up", {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone }),
  });
  localStorage.setItem("hubb_token", data.token);
  return data;
}

export function signOut() {
  localStorage.removeItem("hubb_token");
}

export async function getUserProfile() {
  return request<any>("/users/me");
}

// --- Restaurants ---

export async function getRestaurants(
  lat: number,
  lon: number,
  radius = 10
) {
  return request<any[]>(
    `/restaurants?lat=${lat}&lon=${lon}&radius=${radius}`
  );
}

export async function getFeaturedRestaurants() {
  return request<any[]>("/restaurants/featured");
}

export async function getRestaurantDetail(id: string) {
  return request<any>(`/restaurants/${id}`);
}

export async function getRestaurantMenu(id: string) {
  return request<any>(`/restaurants/${id}/menu`);
}

export async function searchRestaurants(query: string) {
  return request<any[]>(`/restaurants/search?q=${encodeURIComponent(query)}`);
}

// --- Food Items ---

export async function getFeaturedFoodItems() {
  return request<any[]>("/food-items/featured");
}

export async function getAllFoodItems() {
  return request<any[]>("/foodItems");
}

export async function searchFoodItems(query: string) {
  return request<any[]>(`/foodItems/search?q=${encodeURIComponent(query)}`);
}

// --- Orders ---

export async function placeOrder(body: Record<string, any>) {
  return request<any>("/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getActiveOrders() {
  return request<any[]>("/orders/active");
}

export async function getOrderHistory(page = 1, limit = 20) {
  return request<any[]>(`/orders?page=${page}&limit=${limit}`);
}

export async function getOrderDetail(id: string) {
  return request<any>(`/orders/${id}`);
}

export async function getOrderTracking(id: string) {
  return request<any>(`/orders/${id}/tracking`);
}

export async function cancelOrder(id: string) {
  return request<any>(`/orders/${id}/cancel`, { method: "POST" });
}

export async function rateOrder(
  id: string,
  body: Record<string, any>
) {
  return request<any>(`/orders/${id}/rating`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// --- Promotions ---

export async function getPromotions() {
  return request<any[]>("/promotions");
}

export async function validatePromo(
  code: string,
  cartTotal: number,
  userId?: string
) {
  return request<any>("/promotions/validate", {
    method: "POST",
    body: JSON.stringify({ code, cartTotal, userId }),
  });
}

// --- User Addresses ---

export async function getUserAddresses() {
  return request<any[]>("/users/me/addresses");
}

export async function addAddress(body: Record<string, any>) {
  return request<any>("/users/me/addresses", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function deleteAddress(id: string) {
  return request<any>(`/users/me/addresses/${id}`, { method: "DELETE" });
}

// --- Delivery Fee ---

export async function getDeliveryFee(
  restaurantId: string,
  lat: number,
  lng: number,
  subtotal: number
) {
  return request<any>(
    `/delivery-fee/v2?restaurantId=${restaurantId}&lat=${lat}&lng=${lng}&subtotal=${Math.round(subtotal)}`
  );
}
