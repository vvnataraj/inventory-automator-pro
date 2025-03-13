
import { InventoryItem } from "@/types/inventory";

// Garden category items
export const gardenItems: InventoryItem[] = [
  {
    id: "item-20",
    sku: "HW-GARDN-001",
    name: "Garden Hose, 50-foot",
    description: "Flexible 50-foot garden hose with brass fittings",
    category: "Garden",
    subcategory: "Watering",
    brand: "GreenThumb",
    price: 28.99,
    rrp: 34.99,
    cost: 14.50,
    stock: 45,
    lowStockThreshold: 10,
    minStockCount: 5,
    location: "Warehouse B",
    barcode: "9098765432105",
    dateAdded: "2023-10-18T08:15:00Z",
    lastUpdated: "2024-01-28T11:45:00Z",
    imageUrl: "https://placehold.co/400x400?text=Garden+Hose",
    dimensions: {
      length: 40,
      width: 40,
      height: 15,
      unit: 'cm'
    },
    weight: {
      value: 2.2,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Garden Supplies Inc.",
    tags: ["garden", "hose", "watering", "outdoor"]
  }
];
