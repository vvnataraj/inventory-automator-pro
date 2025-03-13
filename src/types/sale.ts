
export type SaleStatus = 
  | "completed" 
  | "pending" 
  | "cancelled" 
  | "refunded";

export interface SaleItem {
  inventoryItemId: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  saleNumber: string;
  customerName: string;
  items: SaleItem[];
  total: number;
  date: string;
  status: SaleStatus;
  paymentMethod?: string;
  notes?: string;
}

// Database specific type used when dealing with Supabase
export interface SaleItemDB {
  id: string;
  saleid: string;
  inventoryitemid: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
}

// Database specific type used when dealing with Supabase
export interface SaleDB {
  id: string;
  salenumber: string;
  customername: string;
  total: number;
  date: string;
  status: string;
  paymentmethod: string;
  notes?: string | null;
  created_at: string;
  items?: SaleItemDB[];
}
