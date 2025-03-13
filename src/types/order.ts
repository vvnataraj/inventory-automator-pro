
import { InventoryItem } from "./inventory";

export type OrderStatus = 
  | "pending" 
  | "processing" 
  | "shipped" 
  | "delivered" 
  | "cancelled" 
  | "returned";

export interface OrderItem {
  id: string;
  product: Partial<InventoryItem>;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  tax: number;
  shipping: number;
  discount?: number;
  grandTotal: number;
  paymentMethod: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}
