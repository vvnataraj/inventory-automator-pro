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
  },
  {
    id: "item-32",
    sku: "HW-SCREW-002",
    name: "Drywall Screws 1-5/8\" (500-Pack)",
    description: "Box of 500 self-drilling drywall screws, 1-5/8\" length, coarse thread, phosphate finish",
    category: "Fasteners",
    subcategory: "Screws",
    brand: "BuildRight",
    price: 12.99,
    rrp: 15.99,
    cost: 6.75,
    stock: 85,
    lowStockThreshold: 15,
    minStockCount: 8,
    location: "Warehouse A",
    barcode: "2233445566778",
    dateAdded: "2023-11-15T11:20:00Z",
    lastUpdated: "2024-02-10T13:45:00Z",
    imageUrl: "https://placehold.co/400x400?text=Drywall+Screws",
    dimensions: {
      length: 10,
      width: 8,
      height: 5,
      unit: 'cm'
    },
    weight: {
      value: 0.75,
      unit: 'kg'
    },
    isActive: true,
    supplier: "National Hardware Suppliers",
    tags: ["screws", "drywall", "fasteners", "construction"]
  },
  {
    id: "item-33",
    sku: "HW-NAIL-002",
    name: "Finish Nails 2-inch (500-Pack)",
    description: "Box of 500 finish nails, 2-inch length, ideal for trim work and cabinetry",
    category: "Fasteners",
    subcategory: "Nails",
    brand: "BuildRight",
    price: 9.99,
    rrp: 12.99,
    cost: 5.25,
    stock: 70,
    lowStockThreshold: 15,
    minStockCount: 10,
    location: "Warehouse A",
    barcode: "3344556677889",
    dateAdded: "2023-10-25T09:30:00Z",
    lastUpdated: "2024-01-30T15:20:00Z",
    imageUrl: "https://placehold.co/400x400?text=Finish+Nails",
    dimensions: {
      length: 10,
      width: 8,
      height: 4,
      unit: 'cm'
    },
    weight: {
      value: 0.6,
      unit: 'kg'
    },
    isActive: true,
    supplier: "National Hardware Suppliers",
    tags: ["nails", "finish nails", "trim", "fasteners"]
  },
  {
    id: "item-34",
    sku: "HW-ANCHO-001",
    name: "Wall Anchors Assortment Kit",
    description: "Assortment of 200 plastic and metal wall anchors with screws for drywall and plaster",
    category: "Fasteners",
    subcategory: "Anchors",
    brand: "BuildRight",
    price: 15.99,
    rrp: 19.99,
    cost: 8.25,
    stock: 55,
    lowStockThreshold: 10,
    minStockCount: 5,
    location: "Storefront",
    barcode: "4455667788990",
    dateAdded: "2023-12-05T13:40:00Z",
    lastUpdated: "2024-02-15T09:30:00Z",
    imageUrl: "https://placehold.co/400x400?text=Wall+Anchors",
    dimensions: {
      length: 15,
      width: 12,
      height: 5,
      unit: 'cm'
    },
    weight: {
      value: 0.4,
      unit: 'kg'
    },
    isActive: true,
    supplier: "National Hardware Suppliers",
    tags: ["anchors", "wall anchors", "drywall", "fasteners"]
  },
  {
    id: "item-35",
    sku: "HW-TOGGL-001",
    name: "Toggle Bolts 3/16\" (25-Pack)",
    description: "Pack of 25 toggle bolts, 3/16\" diameter, 3\" length, for hollow doors and walls",
    category: "Fasteners",
    subcategory: "Bolts",
    brand: "BuildRight",
    price: 8.99,
    rrp: 11.99,
    cost: 4.75,
    stock: 40,
    lowStockThreshold: 8,
    minStockCount: 4,
    location: "Warehouse A",
    barcode: "5566778899001",
    dateAdded: "2023-11-10T14:15:00Z",
    lastUpdated: "2024-01-20T11:30:00Z",
    imageUrl: "https://placehold.co/400x400?text=Toggle+Bolts",
    dimensions: {
      length: 8,
      width: 6,
      height: 3,
      unit: 'cm'
    },
    weight: {
      value: 0.3,
      unit: 'kg'
    },
    isActive: true,
    supplier: "National Hardware Suppliers",
    tags: ["toggle bolts", "bolts", "hollow wall", "fasteners"]
  },
  {
    id: "item-36",
    sku: "HW-WASHRS-001",
    name: "Washer Assortment (300-Piece)",
    description: "Assortment of 300 flat, lock, and split washers in various sizes",
    category: "Fasteners",
    subcategory: "Washers",
    brand: "BuildRight",
    price: 11.99,
    rrp: 14.99,
    cost: 6.25,
    stock: 48,
    lowStockThreshold: 10,
    minStockCount: 5,
    location: "Warehouse A",
    barcode: "6677889900112",
    dateAdded: "2023-12-15T10:25:00Z",
    lastUpdated: "2024-02-05T13:45:00Z",
    imageUrl: "https://placehold.co/400x400?text=Washers",
    dimensions: {
      length: 15,
      width: 12,
      height: 5,
      unit: 'cm'
    },
    weight: {
      value: 0.85,
      unit: 'kg'
    },
    isActive: true,
    supplier: "National Hardware Suppliers",
    tags: ["washers", "fasteners", "hardware", "assortment"]
  },
  {
    id: "item-37",
    sku: "HW-NUTS-001",
    name: "Hex Nut Assortment (250-Piece)",
    description: "Assortment of 250 hex nuts in various sizes, zinc-plated",
    category: "Fasteners",
    subcategory: "Nuts",
    brand: "BuildRight",
    price: 10.99,
    rrp: 13.99,
    cost: 5.75,
    stock: 52,
    lowStockThreshold: 10,
    minStockCount: 5,
    location: "Warehouse A",
    barcode: "7788990011223",
    dateAdded: "2023-11-20T09:15:00Z",
    lastUpdated: "2024-01-25T14:30:00Z",
    imageUrl: "https://placehold.co/400x400?text=Hex+Nuts",
    dimensions: {
      length: 12,
      width: 10,
      height: 4,
      unit: 'cm'
    },
    weight: {
      value: 0.7,
      unit: 'kg'
    },
    isActive: true,
    supplier: "National Hardware Suppliers",
    tags: ["nuts", "hex nuts", "fasteners", "hardware"]
  }
];
