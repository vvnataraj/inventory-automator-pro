
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

// Database specific type used when dealing with Supabase
export interface PurchaseItemDB {
  id: string;
  purchaseid: string;
  itemid: string;
  name: string;
  sku: string;
  quantity: number;
  unitcost: number;
  totalcost: number;
  created_at: string;
}

// Database specific type used when dealing with Supabase
export interface PurchaseDB {
  id: string;
  ponumber: string;
  supplier: string;
  status: string;
  totalcost: number;
  orderdate: string;
  expecteddeliverydate: string;
  receiveddate?: string | null;
  notes?: string | null;
  created_at: string;
  items?: PurchaseItemDB[];
}
