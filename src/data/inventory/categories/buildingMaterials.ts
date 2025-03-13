
import { InventoryItem } from "@/types/inventory";

// Building Materials category items (lumber, plywood, etc.)
export const buildingMaterialsItems: InventoryItem[] = [
  {
    id: "item-4",
    sku: "HW-WOOD-001",
    name: "Pine Lumber 2x4x8",
    description: "Standard pine lumber, 2-inch by 4-inch by 8-foot length, kiln dried",
    category: "Building Materials",
    subcategory: "Lumber",
    brand: "Timberland",
    price: 5.99,
    rrp: 7.99,
    cost: 3.25,
    stock: 240,
    lowStockThreshold: 40,
    minStockCount: 20,
    location: "Warehouse B",
    barcode: "3456789012345",
    dateAdded: "2023-10-20T14:45:00Z",
    lastUpdated: "2024-03-01T09:10:00Z",
    imageUrl: "https://placehold.co/400x400?text=Lumber",
    dimensions: {
      length: 243,
      width: 10,
      height: 5,
      unit: 'cm'
    },
    weight: {
      value: 2.3,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Forest Products Inc.",
    tags: ["lumber", "pine", "wood", "construction"]
  },
  {
    id: "item-5",
    sku: "HW-PLYW-001",
    name: "Plywood Sheet 4x8 1/2-inch",
    description: "Standard plywood sheet, 4-foot by 8-foot, 1/2-inch thickness",
    category: "Building Materials",
    subcategory: "Sheets",
    brand: "Timberland",
    price: 32.99,
    rrp: 39.99,
    cost: 18.75,
    stock: 85,
    lowStockThreshold: 15,
    minStockCount: 5,
    location: "Warehouse B",
    barcode: "4567890123456",
    dateAdded: "2023-11-15T10:20:00Z",
    lastUpdated: "2024-02-28T11:40:00Z",
    imageUrl: "https://placehold.co/400x400?text=Plywood",
    dimensions: {
      length: 243,
      width: 121,
      height: 1.27,
      unit: 'cm'
    },
    weight: {
      value: 12.5,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Forest Products Inc.",
    tags: ["plywood", "wood", "sheet", "construction"]
  }
];
