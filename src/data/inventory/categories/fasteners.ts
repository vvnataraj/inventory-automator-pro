
import { InventoryItem } from "@/types/inventory";

// Fasteners category items (nails, screws, bolts)
export const fastenersItems: InventoryItem[] = [
  {
    id: "item-1",
    sku: "HW-NAIL-001",
    name: "Galvanized Common Nails 3-inch",
    description: "Box of 1lb galvanized common nails, 3-inch length, suitable for general construction",
    category: "Fasteners",
    subcategory: "Nails",
    brand: "BuildRight",
    price: 8.99,
    rrp: 12.99,
    cost: 4.50,
    stock: 145,
    lowStockThreshold: 20,
    minStockCount: 10,
    location: "Warehouse A",
    barcode: "7891234567890",
    dateAdded: "2024-01-15T08:00:00Z",
    lastUpdated: "2024-02-20T10:15:00Z",
    imageUrl: "https://placehold.co/400x400?text=Nails",
    dimensions: {
      length: 15,
      width: 10,
      height: 5,
      unit: 'cm'
    },
    weight: {
      value: 0.45,
      unit: 'kg'
    },
    isActive: true,
    supplier: "National Hardware Suppliers",
    tags: ["nails", "fasteners", "construction"]
  },
  {
    id: "item-14",
    sku: "HW-SCREW-001",
    name: "Deck Screws 3-inch (100-Pack)",
    description: "Box of 100 weather-resistant deck screws, 3-inch length",
    category: "Fasteners",
    subcategory: "Screws",
    brand: "BuildRight",
    price: 14.99,
    rrp: 18.99,
    cost: 7.75,
    stock: 110,
    lowStockThreshold: 20,
    minStockCount: 10,
    location: "Warehouse A",
    barcode: "3450987654321",
    dateAdded: "2023-11-18T12:30:00Z",
    lastUpdated: "2024-02-25T09:15:00Z",
    imageUrl: "https://placehold.co/400x400?text=Deck+Screws",
    dimensions: {
      length: 12,
      width: 8,
      height: 5,
      unit: 'cm'
    },
    weight: {
      value: 0.65,
      unit: 'kg'
    },
    isActive: true,
    supplier: "National Hardware Suppliers",
    tags: ["screws", "deck", "fasteners", "outdoor"]
  },
  {
    id: "item-18",
    sku: "HW-BOLT-001",
    name: "Hex Bolts Assortment Kit",
    description: "240-piece hex bolt kit with various sizes and lengths",
    category: "Fasteners",
    subcategory: "Bolts",
    brand: "BuildRight",
    price: 24.99,
    rrp: 29.99,
    cost: 12.75,
    stock: 40,
    lowStockThreshold: 8,
    minStockCount: 4,
    location: "Warehouse A",
    barcode: "7098765432107",
    dateAdded: "2023-11-12T13:40:00Z",
    lastUpdated: "2024-02-28T09:50:00Z",
    imageUrl: "https://placehold.co/400x400?text=Hex+Bolts",
    dimensions: {
      length: 30,
      width: 20,
      height: 5,
      unit: 'cm'
    },
    weight: {
      value: 2.8,
      unit: 'kg'
    },
    isActive: true,
    supplier: "National Hardware Suppliers",
    tags: ["bolts", "hex", "fasteners", "assortment"]
  }
];
