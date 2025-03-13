
import { InventoryItem } from "@/types/inventory";

// Tools category items (hammers, drills, saws, etc.)
export const toolsItems: InventoryItem[] = [
  {
    id: "item-2",
    sku: "HW-HMRM-001",
    name: "Claw Hammer 16oz",
    description: "16oz steel claw hammer with ergonomic rubber grip, perfect for general household use",
    category: "Tools",
    subcategory: "Hand Tools",
    brand: "ToughTools",
    price: 24.99,
    rrp: 29.99,
    cost: 12.75,
    stock: 52,
    lowStockThreshold: 10,
    minStockCount: 5,
    location: "Storefront",
    barcode: "1234567890123",
    dateAdded: "2023-11-10T09:30:00Z",
    lastUpdated: "2024-01-05T14:20:00Z",
    imageUrl: "https://placehold.co/400x400?text=Hammer",
    dimensions: {
      length: 32,
      width: 15,
      height: 4,
      unit: 'cm'
    },
    weight: {
      value: 0.65,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Quality Tool Co.",
    tags: ["hammer", "hand tools", "construction"]
  },
  {
    id: "item-3",
    sku: "HW-SCRW-001",
    name: "Phillips Screwdriver Set",
    description: "Set of 5 Phillips screwdrivers in various sizes with magnetic tips",
    category: "Tools",
    subcategory: "Hand Tools",
    brand: "ProTools",
    price: 19.99,
    rrp: 24.99,
    cost: 9.45,
    stock: 38,
    lowStockThreshold: 8,
    minStockCount: 4,
    location: "Storefront",
    barcode: "2345678901234",
    dateAdded: "2023-12-05T11:15:00Z",
    lastUpdated: "2024-02-12T16:30:00Z",
    imageUrl: "https://placehold.co/400x400?text=Screwdrivers",
    dimensions: {
      length: 25,
      width: 15,
      height: 5,
      unit: 'cm'
    },
    weight: {
      value: 0.8,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Quality Tool Co.",
    tags: ["screwdriver", "hand tools", "phillips"]
  },
  {
    id: "item-6",
    sku: "HW-TOOL-001",
    name: "Cordless Drill 18V",
    description: "18V cordless drill with lithium-ion battery, charger and carrying case",
    category: "Tools",
    subcategory: "Power Tools",
    brand: "PowerMaster",
    price: 89.99,
    rrp: 119.99,
    cost: 48.50,
    stock: 25,
    lowStockThreshold: 5,
    minStockCount: 2,
    location: "Storefront",
    barcode: "5678901234567",
    dateAdded: "2023-10-05T08:30:00Z",
    lastUpdated: "2024-01-25T13:15:00Z",
    imageUrl: "https://placehold.co/400x400?text=Drill",
    dimensions: {
      length: 30,
      width: 25,
      height: 10,
      unit: 'cm'
    },
    weight: {
      value: 1.8,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Power Tools Ltd.",
    tags: ["drill", "power tools", "cordless"]
  },
  {
    id: "item-12",
    sku: "HW-WRENCH-001",
    name: "Adjustable Wrench Set (3-Piece)",
    description: "Set of 3 adjustable wrenches in different sizes with chrome finish",
    category: "Tools",
    subcategory: "Hand Tools",
    brand: "ToughTools",
    price: 29.99,
    rrp: 34.99,
    cost: 15.25,
    stock: 28,
    lowStockThreshold: 6,
    minStockCount: 3,
    location: "Storefront",
    barcode: "1234509876543",
    dateAdded: "2023-12-20T10:15:00Z",
    lastUpdated: "2024-02-08T15:25:00Z",
    imageUrl: "https://placehold.co/400x400?text=Wrenches",
    dimensions: {
      length: 25,
      width: 15,
      height: 3,
      unit: 'cm'
    },
    weight: {
      value: 0.9,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Quality Tool Co.",
    tags: ["wrench", "adjustable", "hand tools", "metal"]
  },
  {
    id: "item-15",
    sku: "HW-LADDE-001",
    name: "Aluminum Step Ladder, 6-Foot",
    description: "Lightweight 6-foot aluminum step ladder with non-slip steps",
    category: "Tools",
    subcategory: "Ladders",
    brand: "ProTools",
    price: 79.99,
    rrp: 99.99,
    cost: 42.50,
    stock: 15,
    lowStockThreshold: 3,
    minStockCount: 2,
    location: "Warehouse B",
    barcode: "4509876543210",
    dateAdded: "2023-10-10T09:50:00Z",
    lastUpdated: "2024-01-12T15:30:00Z",
    imageUrl: "https://placehold.co/400x400?text=Ladder",
    dimensions: {
      length: 185,
      width: 50,
      height: 12,
      unit: 'cm'
    },
    weight: {
      value: 5.2,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Quality Tool Co.",
    tags: ["ladder", "step ladder", "aluminum", "tools"]
  },
  {
    id: "item-17",
    sku: "HW-PLIER-001",
    name: "Pliers Set (5-Piece)",
    description: "5-piece pliers set including slip joint, long nose, diagonal, and lineman's pliers",
    category: "Tools",
    subcategory: "Hand Tools",
    brand: "ToughTools",
    price: 34.99,
    rrp: 44.99,
    cost: 18.25,
    stock: 30,
    lowStockThreshold: 6,
    minStockCount: 3,
    location: "Storefront",
    barcode: "6098765432108",
    dateAdded: "2023-10-25T11:20:00Z",
    lastUpdated: "2024-01-22T08:35:00Z",
    imageUrl: "https://placehold.co/400x400?text=Pliers+Set",
    dimensions: {
      length: 25,
      width: 20,
      height: 5,
      unit: 'cm'
    },
    weight: {
      value: 1.2,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Quality Tool Co.",
    tags: ["pliers", "hand tools", "metal"]
  },
  {
    id: "item-19",
    sku: "HW-SAW-001",
    name: "Hand Saw, 20-inch",
    description: "20-inch hand saw with hardwood handle for general cutting tasks",
    category: "Tools",
    subcategory: "Hand Tools",
    brand: "ProTools",
    price: 19.99,
    rrp: 24.99,
    cost: 9.85,
    stock: 28,
    lowStockThreshold: 6,
    minStockCount: 3,
    location: "Storefront",
    barcode: "8098765432106",
    dateAdded: "2023-12-10T10:25:00Z",
    lastUpdated: "2024-02-05T14:10:00Z",
    imageUrl: "https://placehold.co/400x400?text=Hand+Saw",
    dimensions: {
      length: 55,
      width: 15,
      height: 3,
      unit: 'cm'
    },
    weight: {
      value: 0.75,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Quality Tool Co.",
    tags: ["saw", "hand tools", "cutting"]
  }
];
