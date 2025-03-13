
import { InventoryItem } from "@/types/inventory";

// Electrical category items
export const electricalItems: InventoryItem[] = [
  {
    id: "item-10",
    sku: "HW-LGHT-001",
    name: "LED Light Bulbs (4-Pack)",
    description: "Energy-efficient LED light bulbs, 60W equivalent, soft white, pack of 4",
    category: "Electrical",
    subcategory: "Lighting",
    brand: "BrightLife",
    price: 11.99,
    rrp: 14.99,
    cost: 6.25,
    stock: 75,
    lowStockThreshold: 15,
    minStockCount: 10,
    location: "Storefront",
    barcode: "9012345678901",
    dateAdded: "2023-10-30T11:35:00Z",
    lastUpdated: "2024-02-22T08:45:00Z",
    imageUrl: "https://placehold.co/400x400?text=LED+Bulbs",
    dimensions: {
      length: 12,
      width: 12,
      height: 8,
      unit: 'cm'
    },
    weight: {
      value: 0.2,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Electrical Supply Co.",
    tags: ["lighting", "LED", "bulbs", "electrical"]
  }
];
