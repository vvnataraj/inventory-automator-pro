
import { InventoryItem } from "@/types/inventory";

/**
 * Maps a Supabase database item to our application's InventoryItem type
 */
export function mapDatabaseItemToInventoryItem(item: any): InventoryItem {
  const dimensionsObj = item.dimensions as Record<string, any> | null;
  const weightObj = item.weight as Record<string, any> | null;
  
  return {
    id: item.id || "",
    sku: item.sku || "",
    name: item.name || "",
    description: item.description || "",
    category: item.category || "",
    subcategory: item.subcategory || "",
    brand: item.brand || "",
    price: typeof item.price === 'number' ? item.price : 0,
    rrp: typeof item.rrp === 'number' ? item.rrp : (typeof item.price === 'number' ? item.price : 0),
    cost: typeof item.cost === 'number' ? item.cost : 0,
    stock: typeof item.stock === 'number' ? item.stock : 0,
    lowStockThreshold: typeof item.low_stock_threshold === 'number' ? item.low_stock_threshold : 5,
    minStockCount: typeof item.min_stock_count === 'number' ? item.min_stock_count : 1,
    location: item.location || "",
    barcode: item.barcode || "",
    dateAdded: item.date_added || new Date().toISOString(),
    lastUpdated: item.last_updated || new Date().toISOString(),
    imageUrl: item.image_url || "",
    dimensions: dimensionsObj ? {
      length: Number(dimensionsObj.length) || 0,
      width: Number(dimensionsObj.width) || 0,
      height: Number(dimensionsObj.height) || 0,
      unit: (dimensionsObj.unit as 'cm' | 'mm' | 'in') || 'cm'
    } : undefined,
    weight: weightObj ? {
      value: Number(weightObj.value) || 0,
      unit: (weightObj.unit as 'kg' | 'g' | 'lb') || 'kg'
    } : undefined,
    isActive: typeof item.is_active === 'boolean' ? item.is_active : true,
    supplier: item.supplier || "",
    tags: Array.isArray(item.tags) ? item.tags : []
  };
}

/**
 * Maps our application's InventoryItem type to a format suitable for Supabase
 */
export function mapInventoryItemToSupabaseItem(item: InventoryItem) {
  return {
    id: item.id,
    sku: item.sku,
    name: item.name,
    description: item.description,
    category: item.category,
    subcategory: item.subcategory,
    brand: item.brand,
    price: item.price,
    rrp: item.rrp,
    cost: item.cost,
    stock: item.stock,
    low_stock_threshold: item.lowStockThreshold,
    min_stock_count: item.minStockCount,
    location: item.location,
    barcode: item.barcode,
    date_added: item.dateAdded,
    last_updated: item.lastUpdated || new Date().toISOString(),
    image_url: item.imageUrl,
    dimensions: item.dimensions,
    weight: item.weight,
    is_active: item.isActive,
    supplier: item.supplier,
    tags: item.tags
  };
}
