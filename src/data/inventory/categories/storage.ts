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
  },
  {
    id: "item-58",
    sku: "HW-TOOLB-001",
    name: "Metal Toolbox 19-inch",
    description: "19-inch steel toolbox with removable tray and padlock eye",
    category: "Storage",
    subcategory: "Tool Storage",
    brand: "StoragePro",
    price: 29.99,
    rrp: 34.99,
    cost: 15.75,
    stock: 25,
    lowStockThreshold: 5,
    minStockCount: 3,
    location: "Storefront",
    barcode: "8899001122334",
    dateAdded: "2023-11-10T09:15:00Z",
    lastUpdated: "2024-01-25T13:40:00Z",
    imageUrl: "https://placehold.co/400x400?text=Metal+Toolbox",
    dimensions: {
      length: 48,
      width: 25,
      height: 20,
      unit: 'cm'
    },
    weight: {
      value: 3.2,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Home Organization Inc.",
    tags: ["toolbox", "storage", "tool storage", "metal"]
  },
  {
    id: "item-59",
    sku: "HW-TOOLC-001",
    name: "Rolling Tool Cabinet",
    description: "5-drawer rolling tool cabinet with ball-bearing slides and locking casters",
    category: "Storage",
    subcategory: "Tool Storage",
    brand: "StoragePro",
    price: 149.99,
    rrp: 189.99,
    cost: 89.75,
    stock: 8,
    lowStockThreshold: 2,
    minStockCount: 1,
    location: "Warehouse A",
    barcode: "9900112233445",
    dateAdded: "2023-10-20T11:30:00Z",
    lastUpdated: "2024-02-15T14:25:00Z",
    imageUrl: "https://placehold.co/400x400?text=Tool+Cabinet",
    dimensions: {
      length: 68,
      width: 45,
      height: 90,
      unit: 'cm'
    },
    weight: {
      value: 42.5,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Home Organization Inc.",
    tags: ["tool cabinet", "rolling cabinet", "storage", "workshop"]
  },
  {
    id: "item-60",
    sku: "HW-SHELF-001",
    name: "Heavy-Duty Garage Shelf Unit",
    description: "5-tier heavy-duty steel garage shelving unit, 48\"W x 24\"D x 72\"H",
    category: "Storage",
    subcategory: "Shelving",
    brand: "StoragePro",
    price: 119.99,
    rrp: 149.99,
    cost: 65.50,
    stock: 12,
    lowStockThreshold: 3,
    minStockCount: 2,
    location: "Warehouse B",
    barcode: "0011223344556",
    dateAdded: "2023-12-05T13:20:00Z",
    lastUpdated: "2024-01-30T09:45:00Z",
    imageUrl: "https://placehold.co/400x400?text=Garage+Shelving",
    dimensions: {
      length: 122,
      width: 61,
      height: 183,
      unit: 'cm'
    },
    weight: {
      value: 28.5,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Home Organization Inc.",
    tags: ["shelving", "garage", "storage", "heavy-duty"]
  },
  {
    id: "item-61",
    sku: "HW-PBIN-001",
    name: "Plastic Storage Bins (Set of 5)",
    description: "Set of 5 clear plastic storage bins with lids, stackable",
    category: "Storage",
    subcategory: "Containers",
    brand: "StoragePro",
    price: 34.99,
    rrp: 39.99,
    cost: 17.50,
    stock: 30,
    lowStockThreshold: 6,
    minStockCount: 3,
    location: "Storefront",
    barcode: "1122334455667",
    dateAdded: "2023-11-25T10:15:00Z",
    lastUpdated: "2024-02-10T13:30:00Z",
    imageUrl: "https://placehold.co/400x400?text=Storage+Bins",
    dimensions: {
      length: 50,
      width: 35,
      height: 25,
      unit: 'cm'
    },
    weight: {
      value: 2.8,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Home Organization Inc.",
    tags: ["storage bins", "plastic", "containers", "organization"]
  },
  {
    id: "item-62",
    sku: "HW-WALLR-001",
    name: "Wall-Mounted Tool Rack",
    description: "Wall-mounted tool rack with hooks for garden tools and equipment",
    category: "Storage",
    subcategory: "Tool Storage",
    brand: "StoragePro",
    price: 24.99,
    rrp: 29.99,
    cost: 12.75,
    stock: 18,
    lowStockThreshold: 4,
    minStockCount: 2,
    location: "Storefront",
    barcode: "2233445566778",
    dateAdded: "2023-10-15T14:30:00Z",
    lastUpdated: "2024-01-15T11:20:00Z",
    imageUrl: "https://placehold.co/400x400?text=Tool+Rack",
    dimensions: {
      length: 100,
      width: 15,
      height: 25,
      unit: 'cm'
    },
    weight: {
      value: 3.5,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Home Organization Inc.",
    tags: ["tool rack", "wall-mounted", "storage", "organization"]
  }
];
