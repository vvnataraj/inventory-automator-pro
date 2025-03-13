
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
