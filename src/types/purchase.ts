
export type PurchaseStatus = 
  | "pending" 
  | "ordered" 
  | "shipped" 
  | "delivered" 
  | "cancelled";

export interface PurchaseItem {
  itemId: string;
  name: string;
  sku: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface Purchase {
  id: string;
  poNumber: string;
  supplier: string;
  items: PurchaseItem[];
  status: PurchaseStatus;
  totalCost: number;
  orderDate: string;
  expectedDeliveryDate: string;
  receivedDate?: string;
  notes?: string;
}
