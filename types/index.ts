// Type definitions for the Cafe Billing App

export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  avatar?: string;
}

export interface Business {
  id: string;
  name: string;
  logo?: string;
  address: string;
  phone: string;
  gstNumber?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  description?: string;
  isAvailable: boolean;
}

export interface BillItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  subtotal: number;
}

export interface Bill {
  id: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: Date;
  businessId: string;
  paymentMethod?: "cash" | "card" | "upi";
  status: "pending" | "paid" | "cancelled";
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  currentBusiness: Business | null;
}
