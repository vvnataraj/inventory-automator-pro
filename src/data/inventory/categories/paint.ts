
import { InventoryItem } from "@/types/inventory";

// Paint category items
export const paintItems: InventoryItem[] = [
  {
    id: "item-8",
    sku: "HW-PAINT-001",
    name: "Interior Paint, White 1-Gallon",
    description: "Premium quality interior latex paint, matte finish, white, 1-gallon can",
    category: "Paint",
    subcategory: "Interior Paint",
    brand: "ColorMaster",
    price: 32.99,
    rrp: 38.99,
    cost: 18.50,
    stock: 60,
    lowStockThreshold: 10,
    minStockCount: 5,
    location: "Warehouse A",
    barcode: "7890123456789",
    dateAdded: "2023-11-25T13:10:00Z",
    lastUpdated: "2024-02-18T10:20:00Z",
    imageUrl: "https://placehold.co/400x400?text=Paint",
    dimensions: {
      length: 20,
      width: 20,
      height: 25,
      unit: 'cm'
    },
    weight: {
      value: 4.5,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Premium Paints Co.",
    tags: ["paint", "interior", "white", "gallon"]
  }
];
