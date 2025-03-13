
import { InventoryItem } from "@/types/inventory";

// Storage category items (boxes, containers, etc.)
export const storageItems: InventoryItem[] = [
  {
    id: "item-7",
    sku: "HW-BOXS-001",
    name: "Heavy-Duty Storage Boxes (3-Pack)",
    description: "Set of 3 heavy-duty plastic storage boxes with lids, stackable",
    category: "Storage",
    subcategory: "Containers",
    brand: "StoragePro",
    price: 24.99,
    rrp: 29.99,
    cost: 12.25,
    stock: 42,
    lowStockThreshold: 10,
    minStockCount: 5,
    location: "Warehouse A",
    barcode: "6789012345678",
    dateAdded: "2023-12-15T15:45:00Z",
    lastUpdated: "2024-02-10T09:30:00Z",
    imageUrl: "https://placehold.co/400x400?text=Storage+Boxes",
    dimensions: {
      length: 60,
      width: 40,
      height: 30,
      unit: 'cm'
    },
    weight: {
      value: 2.1,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Home Organization Inc.",
    tags: ["storage", "boxes", "plastic", "organization"]
  }
];
