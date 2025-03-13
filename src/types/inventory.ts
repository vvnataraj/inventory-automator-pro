
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
}

export type SortField = 'name' | 'sku' | 'category' | 'cost' | 'rrp' | 'stock' | 'location';
export type SortDirection = 'asc' | 'desc';
