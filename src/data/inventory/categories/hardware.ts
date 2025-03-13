
import { InventoryItem } from "@/types/inventory";

// Hardware category items (locks, tapes, glue, etc.)
export const hardwareItems: InventoryItem[] = [
  {
    id: "item-9",
    sku: "HW-LOCK-001",
    name: "Deadbolt Lock, Satin Nickel",
    description: "High-security deadbolt lock for exterior doors, satin nickel finish",
    category: "Hardware",
    subcategory: "Door Hardware",
    brand: "SecureLock",
    price: 45.99,
    rrp: 59.99,
    cost: 24.75,
    stock: 35,
    lowStockThreshold: 8,
    minStockCount: 4,
    location: "Storefront",
    barcode: "8901234567890",
    dateAdded: "2023-12-08T09:25:00Z",
    lastUpdated: "2024-01-30T14:50:00Z",
    imageUrl: "https://placehold.co/400x400?text=Deadbolt",
    dimensions: {
      length: 15,
      width: 10,
      height: 5,
      unit: 'cm'
    },
    weight: {
      value: 0.85,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Security Hardware Inc.",
    tags: ["lock", "deadbolt", "door hardware", "security"]
  },
  {
    id: "item-11",
    sku: "HW-TAPE-001",
    name: "Duct Tape, Silver",
    description: "Heavy-duty silver duct tape, 1.88-inch by 60-yard roll",
    category: "Hardware",
    subcategory: "Tapes & Adhesives",
    brand: "StickFast",
    price: 8.99,
    rrp: 10.99,
    cost: 4.75,
    stock: 95,
    lowStockThreshold: 20,
    minStockCount: 10,
    location: "Warehouse A",
    barcode: "0123456789012",
    dateAdded: "2023-11-05T14:20:00Z",
    lastUpdated: "2024-02-15T11:10:00Z",
    imageUrl: "https://placehold.co/400x400?text=Duct+Tape",
    dimensions: {
      length: 10,
      width: 10,
      height: 5,
      unit: 'cm'
    },
    weight: {
      value: 0.5,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Adhesive Products Ltd.",
    tags: ["tape", "duct tape", "adhesive"]
  },
  {
    id: "item-13",
    sku: "HW-GLUE-001",
    name: "Wood Glue, 16oz",
    description: "Premium wood glue for interior and exterior use, 16-ounce bottle",
    category: "Hardware",
    subcategory: "Tapes & Adhesives",
    brand: "StickFast",
    price: 7.99,
    rrp: 9.99,
    cost: 3.85,
    stock: 65,
    lowStockThreshold: 12,
    minStockCount: 6,
    location: "Warehouse A",
    barcode: "2345098765432",
    dateAdded: "2023-10-15T08:45:00Z",
    lastUpdated: "2024-01-18T13:40:00Z",
    imageUrl: "https://placehold.co/400x400?text=Wood+Glue",
    dimensions: {
      length: 8,
      width: 8,
      height: 20,
      unit: 'cm'
    },
    weight: {
      value: 0.55,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Adhesive Products Ltd.",
    tags: ["glue", "wood glue", "adhesive"]
  },
  {
    id: "item-16",
    sku: "HW-SANDR-001",
    name: "Sandpaper Assortment Pack",
    description: "Assorted sandpaper sheets in various grits for wood and metal",
    category: "Hardware",
    subcategory: "Abrasives",
    brand: "SmoothEdge",
    price: 9.99,
    rrp: 12.99,
    cost: 4.25,
    stock: 85,
    lowStockThreshold: 15,
    minStockCount: 8,
    location: "Storefront",
    barcode: "5098765432109",
    dateAdded: "2023-12-01T14:15:00Z",
    lastUpdated: "2024-02-14T10:45:00Z",
    imageUrl: "https://placehold.co/400x400?text=Sandpaper",
    dimensions: {
      length: 28,
      width: 23,
      height: 2,
      unit: 'cm'
    },
    weight: {
      value: 0.3,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Surface Finishing Co.",
    tags: ["sandpaper", "abrasives", "finishing"]
  }
];
