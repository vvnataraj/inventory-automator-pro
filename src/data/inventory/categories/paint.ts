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
  },
  {
    id: "item-63",
    sku: "HW-PAINT-002",
    name: "Exterior Paint, White 1-Gallon",
    description: "Weather-resistant exterior latex paint, semi-gloss finish, white, 1-gallon can",
    category: "Paint",
    subcategory: "Exterior Paint",
    brand: "ColorMaster",
    price: 36.99,
    rrp: 42.99,
    cost: 21.50,
    stock: 45,
    lowStockThreshold: 10,
    minStockCount: 5,
    location: "Warehouse A",
    barcode: "3344556677889",
    dateAdded: "2023-10-25T11:20:00Z",
    lastUpdated: "2024-01-30T09:45:00Z",
    imageUrl: "https://placehold.co/400x400?text=Exterior+Paint",
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
    tags: ["paint", "exterior", "white", "gallon"]
  },
  {
    id: "item-64",
    sku: "HW-PRIMR-001",
    name: "All-Purpose Primer 1-Gallon",
    description: "All-purpose interior/exterior primer, white, 1-gallon can",
    category: "Paint",
    subcategory: "Primers",
    brand: "ColorMaster",
    price: 28.99,
    rrp: 32.99,
    cost: 15.75,
    stock: 38,
    lowStockThreshold: 8,
    minStockCount: 4,
    location: "Warehouse A",
    barcode: "4455667788990",
    dateAdded: "2023-11-15T13:30:00Z",
    lastUpdated: "2024-02-10T14:15:00Z",
    imageUrl: "https://placehold.co/400x400?text=Primer",
    dimensions: {
      length: 20,
      width: 20,
      height: 25,
      unit: 'cm'
    },
    weight: {
      value: 4.3,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Premium Paints Co.",
    tags: ["primer", "all-purpose", "white", "gallon"]
  },
  {
    id: "item-65",
    sku: "HW-STAIN-001",
    name: "Wood Stain, Golden Oak 1-Quart",
    description: "Oil-based wood stain in golden oak finish, 1-quart can",
    category: "Paint",
    subcategory: "Stains",
    brand: "WoodFinish",
    price: 18.99,
    rrp: 22.99,
    cost: 9.75,
    stock: 25,
    lowStockThreshold: 5,
    minStockCount: 3,
    location: "Storefront",
    barcode: "5566778899001",
    dateAdded: "2023-12-10T09:45:00Z",
    lastUpdated: "2024-01-20T11:35:00Z",
    imageUrl: "https://placehold.co/400x400?text=Wood+Stain",
    dimensions: {
      length: 15,
      width: 15,
      height: 18,
      unit: 'cm'
    },
    weight: {
      value: 1.1,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Premium Paints Co.",
    tags: ["stain", "wood stain", "golden oak", "oil-based"]
  },
  {
    id: "item-66",
    sku: "HW-SPRAY-001",
    name: "Spray Paint, Gloss Black",
    description: "Fast-drying gloss black spray paint, 12oz can",
    category: "Paint",
    subcategory: "Spray Paint",
    brand: "ColorMaster",
    price: 7.99,
    rrp: 9.99,
    cost: 3.85,
    stock: 60,
    lowStockThreshold: 12,
    minStockCount: 6,
    location: "Warehouse A",
    barcode: "6677889900112",
    dateAdded: "2023-11-30T14:20:00Z",
    lastUpdated: "2024-02-15T10:30:00Z",
    imageUrl: "https://placehold.co/400x400?text=Spray+Paint",
    dimensions: {
      length: 7,
      width: 7,
      height: 20,
      unit: 'cm'
    },
    weight: {
      value: 0.4,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Premium Paints Co.",
    tags: ["spray paint", "black", "gloss", "aerosol"]
  },
  {
    id: "item-67",
    sku: "HW-BRUSH-001",
    name: "Paint Brush Set (5-Piece)",
    description: "Set of 5 high-quality paint brushes in various sizes",
    category: "Paint",
    subcategory: "Paint Tools",
    brand: "PaintPro",
    price: 22.99,
    rrp: 27.99,
    cost: 11.50,
    stock: 35,
    lowStockThreshold: 7,
    minStockCount: 4,
    location: "Storefront",
    barcode: "7788990011223",
    dateAdded: "2023-10-15T15:30:00Z",
    lastUpdated: "2024-01-25T09:20:00Z",
    imageUrl: "https://placehold.co/400x400?text=Paint+Brushes",
    dimensions: {
      length: 25,
      width: 15,
      height: 5,
      unit: 'cm'
    },
    weight: {
      value: 0.35,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Premium Paints Co.",
    tags: ["paint brushes", "brushes", "paint tools", "set"]
  },
  {
    id: "item-68",
    sku: "HW-ROLLR-001",
    name: "Paint Roller Kit",
    description: "Complete paint roller kit with tray, roller frame, and 2 roller covers",
    category: "Paint",
    subcategory: "Paint Tools",
    brand: "PaintPro",
    price: 16.99,
    rrp: 19.99,
    cost: 8.25,
    stock: 28,
    lowStockThreshold: 6,
    minStockCount: 3,
    location: "Storefront",
    barcode: "8899001122334",
    dateAdded: "2023-11-20T11:15:00Z",
    lastUpdated: "2024-02-05T13:40:00Z",
    imageUrl: "https://placehold.co/400x400?text=Paint+Roller",
    dimensions: {
      length: 35,
      width: 25,
      height: 10,
      unit: 'cm'
    },
    weight: {
      value: 0.7,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Premium Paints Co.",
    tags: ["paint roller", "roller", "paint tools", "tray"]
  },
  {
    id: "item-69",
    sku: "HW-SEALE-001",
    name: "Clear Polyurethane Sealer, Gloss",
    description: "Water-based clear polyurethane sealer with gloss finish, 1-quart can",
    category: "Paint",
    subcategory: "Sealers",
    brand: "WoodFinish",
    price: 19.99,
    rrp: 24.99,
    cost: 10.25,
    stock: 22,
    lowStockThreshold: 5,
    minStockCount: 3,
    location: "Warehouse A",
    barcode: "9900112233445",
    dateAdded: "2023-12-20T10:30:00Z",
    lastUpdated: "2024-01-15T15:20:00Z",
    imageUrl: "https://placehold.co/400x400?text=Polyurethane",
    dimensions: {
      length: 15,
      width: 15,
      height: 18,
      unit: 'cm'
    },
    weight: {
      value: 1.1,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Premium Paints Co.",
    tags: ["polyurethane", "sealer", "clear coat", "gloss"]
  }
];
