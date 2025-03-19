
import { InventoryItem } from "@/types/inventory";

// Granite cat decorative items
export const graniteCatItems: InventoryItem[] = [
  {
    id: "item-gc001",
    sku: "DEC-CAT-001",
    name: "Granite Cat Statue - Tabby",
    description: "Handcrafted granite cat statue, orange and white tabby design, perfect for garden or home decor",
    category: "Decor",
    subcategory: "Ornaments",
    brand: "StoneArt",
    price: 79.99,
    rrp: 99.99,
    cost: 42.50,
    stock: 12,
    lowStockThreshold: 3,
    minStockCount: 2,
    location: "Warehouse A",
    barcode: "8802233445566",
    dateAdded: "2024-04-10T09:30:00Z",
    lastUpdated: "2024-04-10T09:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&h=400",
    dimensions: {
      length: 25,
      width: 15,
      height: 38,
      unit: 'cm'
    },
    weight: {
      value: 3.8,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Granite Pet Creations",
    tags: ["cat", "statue", "granite", "decor", "garden"]
  },
  {
    id: "item-gc002",
    sku: "DEC-CAT-002",
    name: "Granite Cat Statue - Grey Tabby",
    description: "Handcrafted granite cat statue, grey tabby design, weather-resistant for indoor or outdoor use",
    category: "Decor",
    subcategory: "Ornaments",
    brand: "StoneArt",
    price: 84.99,
    rrp: 104.99,
    cost: 46.50,
    stock: 8,
    lowStockThreshold: 3,
    minStockCount: 2,
    location: "Warehouse B",
    barcode: "8802233445567",
    dateAdded: "2024-04-10T09:45:00Z",
    lastUpdated: "2024-04-10T09:45:00Z",
    imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=400&h=400",
    dimensions: {
      length: 22,
      width: 13,
      height: 35,
      unit: 'cm'
    },
    weight: {
      value: 3.5,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Granite Pet Creations",
    tags: ["cat", "statue", "granite", "decor", "garden"]
  },
  {
    id: "item-gc003",
    sku: "DEC-CAT-003",
    name: "Granite Cat Statue - Sleeping",
    description: "Handcrafted granite cat statue in sleeping pose, perfect for garden borders or shelves",
    category: "Decor",
    subcategory: "Ornaments",
    brand: "StoneArt",
    price: 64.99,
    rrp: 79.99,
    cost: 34.50,
    stock: 15,
    lowStockThreshold: 4,
    minStockCount: 2,
    location: "Warehouse A",
    barcode: "8802233445568",
    dateAdded: "2024-04-10T10:00:00Z",
    lastUpdated: "2024-04-10T10:00:00Z",
    imageUrl: "https://placehold.co/400x400?text=Sleeping+Granite+Cat",
    dimensions: {
      length: 30,
      width: 12,
      height: 10,
      unit: 'cm'
    },
    weight: {
      value: 2.9,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Granite Pet Creations",
    tags: ["cat", "statue", "granite", "decor", "garden", "sleeping"]
  },
  {
    id: "item-gc004",
    sku: "DEC-CAT-004",
    name: "Granite Cat Statue - Sitting",
    description: "Elegant sitting cat statue carved from premium granite, hand-polished finish",
    category: "Decor",
    subcategory: "Ornaments",
    brand: "StoneArt",
    price: 89.99,
    rrp: 109.99,
    cost: 48.50,
    stock: 10,
    lowStockThreshold: 3,
    minStockCount: 2,
    location: "Warehouse B",
    barcode: "8802233445569",
    dateAdded: "2024-04-10T10:15:00Z",
    lastUpdated: "2024-04-10T10:15:00Z",
    imageUrl: "https://placehold.co/400x400?text=Sitting+Granite+Cat",
    dimensions: {
      length: 20,
      width: 15,
      height: 40,
      unit: 'cm'
    },
    weight: {
      value: 4.2,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Granite Pet Creations",
    tags: ["cat", "statue", "granite", "decor", "garden", "sitting"]
  },
  {
    id: "item-gc005",
    sku: "DEC-CAT-005",
    name: "Granite Cat Pair - Playing",
    description: "Delightful pair of playing cats carved from solid granite, great as a centerpiece",
    category: "Decor",
    subcategory: "Ornaments",
    brand: "StoneArt",
    price: 129.99,
    rrp: 159.99,
    cost: 68.50,
    stock: 6,
    lowStockThreshold: 2,
    minStockCount: 1,
    location: "Warehouse A",
    barcode: "8802233445570",
    dateAdded: "2024-04-10T10:30:00Z",
    lastUpdated: "2024-04-10T10:30:00Z",
    imageUrl: "https://placehold.co/400x400?text=Playing+Granite+Cats",
    dimensions: {
      length: 35,
      width: 20,
      height: 25,
      unit: 'cm'
    },
    weight: {
      value: 6.5,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Granite Pet Creations",
    tags: ["cat", "statue", "granite", "decor", "garden", "pair"]
  }
];
