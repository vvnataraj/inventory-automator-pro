
import { InventoryItem } from "@/types/inventory";

// Kitchen category items (utensils, appliances, cookware)
export const kitchenItems: InventoryItem[] = [
  {
    id: "item-k001",
    sku: "KIT-KNIFE-001",
    name: "Chef's Knife, 8-inch",
    description: "Professional 8-inch chef's knife with ergonomic handle, high-carbon stainless steel",
    category: "Kitchen",
    subcategory: "Cutlery",
    brand: "SharpEdge",
    price: 49.99,
    rrp: 64.99,
    cost: 22.50,
    stock: 35,
    lowStockThreshold: 8,
    minStockCount: 4,
    location: "Warehouse A",
    barcode: "8800112233445",
    dateAdded: "2024-01-15T10:20:00Z",
    lastUpdated: "2024-03-20T09:15:00Z",
    imageUrl: "https://placehold.co/400x400?text=Chef+Knife",
    dimensions: {
      length: 34,
      width: 5,
      height: 2,
      unit: 'cm'
    },
    weight: {
      value: 0.28,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Professional Kitchen Supply Co.",
    tags: ["knife", "chef", "cutlery", "kitchen"]
  },
  {
    id: "item-k002",
    sku: "KIT-MIXER-001",
    name: "Stand Mixer, 5-Quart",
    description: "5-quart stand mixer with 10 speeds and tilt-head design, includes beater, whisk, and dough hook",
    category: "Kitchen",
    subcategory: "Appliances",
    brand: "KitchenPro",
    price: 299.99,
    rrp: 349.99,
    cost: 175.50,
    stock: 12,
    lowStockThreshold: 3,
    minStockCount: 2,
    location: "Warehouse B",
    barcode: "8800223344556",
    dateAdded: "2024-01-20T11:30:00Z",
    lastUpdated: "2024-03-18T14:25:00Z",
    imageUrl: "https://placehold.co/400x400?text=Stand+Mixer",
    dimensions: {
      length: 35,
      width: 22,
      height: 36,
      unit: 'cm'
    },
    weight: {
      value: 9.7,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Appliance Distributors Inc.",
    tags: ["mixer", "stand mixer", "appliance", "baking"]
  },
  {
    id: "item-k003",
    sku: "KIT-POT-001",
    name: "Stainless Steel Stock Pot, 12-Quart",
    description: "12-quart stainless steel stock pot with lid, multi-ply base for even heating",
    category: "Kitchen",
    subcategory: "Cookware",
    brand: "CookElite",
    price: 89.99,
    rrp: 109.99,
    cost: 45.75,
    stock: 18,
    lowStockThreshold: 4,
    minStockCount: 2,
    location: "Warehouse A",
    barcode: "8800334455667",
    dateAdded: "2024-02-05T09:15:00Z",
    lastUpdated: "2024-03-22T11:40:00Z",
    imageUrl: "https://placehold.co/400x400?text=Stock+Pot",
    dimensions: {
      length: 40,
      width: 40,
      height: 35,
      unit: 'cm'
    },
    weight: {
      value: 3.2,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Professional Kitchen Supply Co.",
    tags: ["pot", "stock pot", "cookware", "stainless steel"]
  },
  {
    id: "item-k004",
    sku: "KIT-BLEND-001",
    name: "High-Performance Blender",
    description: "1500-watt high-performance blender with 64oz container, variable speed control",
    category: "Kitchen",
    subcategory: "Appliances",
    brand: "BlendMaster",
    price: 179.99,
    rrp: 219.99,
    cost: 95.50,
    stock: 15,
    lowStockThreshold: 5,
    minStockCount: 3,
    location: "Warehouse B",
    barcode: "8800445566778",
    dateAdded: "2024-02-10T14:20:00Z",
    lastUpdated: "2024-03-25T10:35:00Z",
    imageUrl: "https://placehold.co/400x400?text=Blender",
    dimensions: {
      length: 23,
      width: 20,
      height: 45,
      unit: 'cm'
    },
    weight: {
      value: 5.8,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Appliance Distributors Inc.",
    tags: ["blender", "appliance", "kitchen", "smoothie"]
  },
  {
    id: "item-k005",
    sku: "KIT-BOARD-001",
    name: "Bamboo Cutting Board Set",
    description: "Set of 3 bamboo cutting boards in different sizes, eco-friendly and durable",
    category: "Kitchen",
    subcategory: "Utensils",
    brand: "EcoKitchen",
    price: 34.99,
    rrp: 42.99,
    cost: 16.75,
    stock: 28,
    lowStockThreshold: 8,
    minStockCount: 4,
    location: "Warehouse A",
    barcode: "8800556677889",
    dateAdded: "2024-01-25T13:45:00Z",
    lastUpdated: "2024-03-15T09:20:00Z",
    imageUrl: "https://placehold.co/400x400?text=Cutting+Boards",
    dimensions: {
      length: 40,
      width: 30,
      height: 5,
      unit: 'cm'
    },
    weight: {
      value: 1.8,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Eco Kitchenware Co.",
    tags: ["cutting board", "bamboo", "utensil", "eco-friendly"]
  },
  {
    id: "item-k006",
    sku: "KIT-MEASR-001",
    name: "Measuring Cups and Spoons Set",
    description: "Complete set of stainless steel measuring cups and spoons, 10 pieces",
    category: "Kitchen",
    subcategory: "Utensils",
    brand: "PreciseCook",
    price: 24.99,
    rrp: 29.99,
    cost: 11.50,
    stock: 45,
    lowStockThreshold: 10,
    minStockCount: 5,
    location: "Warehouse A",
    barcode: "8800667788990",
    dateAdded: "2024-02-15T10:30:00Z",
    lastUpdated: "2024-03-20T15:45:00Z",
    imageUrl: "https://placehold.co/400x400?text=Measuring+Set",
    dimensions: {
      length: 20,
      width: 15,
      height: 10,
      unit: 'cm'
    },
    weight: {
      value: 0.5,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Professional Kitchen Supply Co.",
    tags: ["measuring cups", "measuring spoons", "baking", "cooking"]
  },
  {
    id: "item-k007",
    sku: "KIT-SKILT-001",
    name: "Cast Iron Skillet, 12-inch",
    description: "Pre-seasoned 12-inch cast iron skillet, excellent heat retention, suitable for all cooktops",
    category: "Kitchen",
    subcategory: "Cookware",
    brand: "IronCraft",
    price: 39.99,
    rrp: 49.99,
    cost: 19.75,
    stock: 22,
    lowStockThreshold: 5,
    minStockCount: 3,
    location: "Warehouse A",
    barcode: "8800778899001",
    dateAdded: "2024-01-30T09:45:00Z",
    lastUpdated: "2024-03-10T14:20:00Z",
    imageUrl: "https://placehold.co/400x400?text=Cast+Iron+Skillet",
    dimensions: {
      length: 32,
      width: 32,
      height: 6,
      unit: 'cm'
    },
    weight: {
      value: 2.7,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Professional Kitchen Supply Co.",
    tags: ["skillet", "cast iron", "cookware", "kitchen"]
  },
  {
    id: "item-k008",
    sku: "KIT-TRAY-001",
    name: "Baking Sheet Set, Non-Stick",
    description: "Set of 3 non-stick baking sheets in different sizes, heavy-gauge steel",
    category: "Kitchen",
    subcategory: "Bakeware",
    brand: "BakePro",
    price: 29.99,
    rrp: 36.99,
    cost: 14.50,
    stock: 32,
    lowStockThreshold: 8,
    minStockCount: 4,
    location: "Warehouse B",
    barcode: "8800889900112",
    dateAdded: "2024-02-20T11:15:00Z",
    lastUpdated: "2024-03-25T09:30:00Z",
    imageUrl: "https://placehold.co/400x400?text=Baking+Sheets",
    dimensions: {
      length: 45,
      width: 35,
      height: 5,
      unit: 'cm'
    },
    weight: {
      value: 1.5,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Professional Kitchen Supply Co.",
    tags: ["baking sheet", "bakeware", "non-stick", "baking"]
  },
  {
    id: "item-k009",
    sku: "KIT-KETTLE-001",
    name: "Electric Kettle, Stainless Steel",
    description: "1.7L electric kettle with fast boiling, auto shut-off, and boil-dry protection",
    category: "Kitchen",
    subcategory: "Appliances",
    brand: "QuickBoil",
    price: 44.99,
    rrp: 54.99,
    cost: 22.75,
    stock: 18,
    lowStockThreshold: 5,
    minStockCount: 2,
    location: "Warehouse B",
    barcode: "8800990011223",
    dateAdded: "2024-02-25T14:30:00Z",
    lastUpdated: "2024-03-18T11:25:00Z",
    imageUrl: "https://placehold.co/400x400?text=Electric+Kettle",
    dimensions: {
      length: 22,
      width: 16,
      height: 25,
      unit: 'cm'
    },
    weight: {
      value: 1.2,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Appliance Distributors Inc.",
    tags: ["kettle", "electric kettle", "appliance", "kitchen"]
  },
  {
    id: "item-k010",
    sku: "KIT-SPICE-001",
    name: "Spice Rack with 20 Jars",
    description: "Rotating spice rack with 20 glass jars and spice labels, compact design",
    category: "Kitchen",
    subcategory: "Storage",
    brand: "OrganizeIt",
    price: 32.99,
    rrp: 39.99,
    cost: 16.50,
    stock: 15,
    lowStockThreshold: 4,
    minStockCount: 2,
    location: "Warehouse A",
    barcode: "8801100112233",
    dateAdded: "2024-01-18T10:45:00Z",
    lastUpdated: "2024-03-15T13:20:00Z",
    imageUrl: "https://placehold.co/400x400?text=Spice+Rack",
    dimensions: {
      length: 30,
      width: 30,
      height: 35,
      unit: 'cm'
    },
    weight: {
      value: 2.3,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Home Organization Inc.",
    tags: ["spice rack", "storage", "kitchen organizer", "spice"]
  }
];
