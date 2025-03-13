export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  rrp?: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
  minStockCount: number;
  location: string;
  barcode: string;
  dateAdded: string;
  lastUpdated: string;
  imageUrl?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'mm' | 'in';
  };
  weight?: {
    value: number;
    unit: 'kg' | 'g' | 'lb';
  };
  isActive: boolean;
  supplier: string;
  tags: string[];
  reorderQuantity?: number;
  locations?: { name: string; stock: number }[];
}

export type SortField = 'name' | 'sku' | 'category' | 'cost' | 'rrp' | 'stock' | 'location';
export type SortDirection = 'asc' | 'desc';

export interface EditInventoryItemFormData {
  name: string;
  sku: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  rrp?: number;
  cost: number;
  stock?: number;
  totalStock?: string;
  lowStockThreshold: number;
  minStockCount: number;
  location: string;
  barcode: string;
  supplier: string;
  [key: string]: any;
}

export interface LocationStock {
  location: string;
  count: number;
}

export interface TransferData {
  fromLocation: string;
  toLocation: string;
  quantity: number;
  item: InventoryItem;
  date: string;
  referenceNumber: string;
}
