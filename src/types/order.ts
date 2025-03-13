
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

// Database specific type used when dealing with Supabase
export interface OrderItemDB {
  id: string;
  orderid: string;
  productid: string;
  productname: string;
  productsku: string;
  productcost: number;
  productimageurl?: string | null;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
}

// Database specific type used when dealing with Supabase
export interface OrderDB {
  id: string;
  ordernumber: string;
  customerid: string;
  status: string;
  total: number;
  tax: number;
  shipping: number;
  discount?: number | null;
  grandtotal: number;
  paymentmethod: string;
  shippingaddressline1: string;
  shippingaddressline2?: string | null;
  shippingaddresscity: string;
  shippingaddressstate: string;
  shippingaddresspostalcode: string;
  shippingaddresscountry: string;
  notes?: string | null;
  createdat: string;
  updatedat: string;
  shippedat?: string | null;
  deliveredat?: string | null;
  created_at: string;
  items?: OrderItemDB[];
}

// Type for customers table in database
export interface CustomerDB {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}
