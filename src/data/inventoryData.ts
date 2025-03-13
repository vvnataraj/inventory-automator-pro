import { faker } from "@faker-js/faker";
import { InventoryItem } from "@/types/inventory";
import { Purchase, PurchaseItem, PurchaseStatus } from "@/types/purchase";

const locations = ["Warehouse A", "Warehouse B", "Storefront", "Online"];

// Static inventory items for hardware store
export const staticInventoryItems: InventoryItem[] = [
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
    id: "item-10",
    sku: "HW-LGHT-001",
    name: "LED Light Bulbs (4-Pack)",
    description: "Energy-efficient LED light bulbs, 60W equivalent, soft white, pack of 4",
    category: "Electrical",
    subcategory: "Lighting",
    brand: "BrightLife",
    price: 11.99,
    rrp: 14.99,
    cost: 6.25,
    stock: 75,
    lowStockThreshold: 15,
    minStockCount: 10,
    location: "Storefront",
    barcode: "9012345678901",
    dateAdded: "2023-10-30T11:35:00Z",
    lastUpdated: "2024-02-22T08:45:00Z",
    imageUrl: "https://placehold.co/400x400?text=LED+Bulbs",
    dimensions: {
      length: 12,
      width: 12,
      height: 8,
      unit: 'cm'
    },
    weight: {
      value: 0.2,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Electrical Supply Co.",
    tags: ["lighting", "LED", "bulbs", "electrical"]
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
  },
  {
    id: "item-20",
    sku: "HW-GARDN-001",
    name: "Garden Hose, 50-foot",
    description: "Flexible 50-foot garden hose with brass fittings",
    category: "Garden",
    subcategory: "Watering",
    brand: "GreenThumb",
    price: 28.99,
    rrp: 34.99,
    cost: 14.50,
    stock: 45,
    lowStockThreshold: 10,
    minStockCount: 5,
    location: "Warehouse B",
    barcode: "9098765432105",
    dateAdded: "2023-10-18T08:15:00Z",
    lastUpdated: "2024-01-28T11:45:00Z",
    imageUrl: "https://placehold.co/400x400?text=Garden+Hose",
    dimensions: {
      length: 40,
      width: 40,
      height: 15,
      unit: 'cm'
    },
    weight: {
      value: 2.2,
      unit: 'kg'
    },
    isActive: true,
    supplier: "Garden Supplies Inc.",
    tags: ["garden", "hose", "watering", "outdoor"]
  }
];

// Helper function to generate inventory items
export const generateInventoryItems = (): InventoryItem[] => {
  // Use our static inventory items instead of generating random ones
  return staticInventoryItems;
};

// Generate the inventory items once
export const inventoryItems = generateInventoryItems();

// Function to get paginated and filtered inventory items
export const getInventoryItems = (
  page: number = 1,
  pageSize: number = 20,
  searchQuery: string = "",
  sortField: string = "name",
  sortDirection: "asc" | "desc" = "asc"
): { items: InventoryItem[], total: number } => {
  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const start = (page - 1) * pageSize;
  const paginatedItems = filteredItems.slice(start, start + pageSize);

  return {
    items: paginatedItems,
    total: filteredItems.length
  };
};

export const generatePurchaseOrders = (count: number): Purchase[] => {
  const suppliers = ["Acme Supplies", "Global Parts Inc.", "Tech Components Ltd.", "Industrial Warehouse", "Quality Materials Co."];
  const purchases: Purchase[] = [];

  for (let i = 0; i < count; i++) {
    const poNumber = `PO-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    
    // Create 1-5 random items for this purchase order
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const items: PurchaseItem[] = [];
    let totalCost = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const randomItem = inventoryItems[Math.floor(Math.random() * inventoryItems.length)];
      const quantity = Math.floor(Math.random() * 20) + 1;
      const unitCost = randomItem.cost;
      const itemTotal = quantity * unitCost;
      
      items.push({
        itemId: randomItem.id,
        name: randomItem.name,
        sku: randomItem.sku,
        quantity,
        unitCost,
        totalCost: itemTotal
      });
      
      totalCost += itemTotal;
    }
    
    // Generate random dates within the last 90 days
    const now = new Date();
    const orderDate = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    const expectedDeliveryDate = new Date(orderDate.getTime() + (Math.random() * 30 + 10) * 24 * 60 * 60 * 1000);
    
    // Randomly determine if this purchase order has been received
    const isReceived = Math.random() > 0.7;
    const receivedDate = isReceived ? 
      new Date(orderDate.getTime() + Math.random() * (now.getTime() - orderDate.getTime())) : 
      undefined;
    
    // Determine status based on dates and random factors
    let status: PurchaseStatus;
    
    if (isReceived) {
      status = "delivered";
    } else if (orderDate > now) {
      status = "pending";
    } else if (Math.random() > 0.9) {
      status = "cancelled";
    } else if (expectedDeliveryDate < now) {
      status = "shipped";
    } else {
      status = "ordered";
    }
    
    purchases.push({
      id: `purchase-${i + 1}`,
      poNumber,
      supplier,
      items,
      status,
      totalCost,
      orderDate: orderDate.toISOString(),
      expectedDeliveryDate: expectedDeliveryDate.toISOString(),
      receivedDate: receivedDate?.toISOString(),
      notes: Math.random() > 0.7 ? "Priority order" : undefined
    });
  }
  
  return purchases;
};

export const purchaseOrders: Purchase[] = generatePurchaseOrders(50);

export const locationsData = [
  {
    id: "location-1",
    name: "Main Warehouse",
    type: "Warehouse",
    address: "123 Industrial Park, Anytown USA",
    itemCount: 234,
    totalUnits: 5678,
    stockValue: 54321,
    spaceUtilization: 78,
  },
  {
    id: "location-2",
    name: "Downtown Store",
    type: "Retail Store",
    address: "456 Main Street, Anytown USA",
    itemCount: 123,
    totalUnits: 1234,
    stockValue: 23456,
    spaceUtilization: 45,
  },
  {
    id: "location-3",
    name: "Online Store",
    type: "Online",
    address: "N/A",
    itemCount: 345,
    totalUnits: 6789,
    stockValue: 65432,
    spaceUtilization: 0,
  },
];

// Function to get paginated and filtered purchase orders
export const getPurchases = (
  page: number = 1,
  pageSize: number = 20,
  searchQuery: string = ""
): { items: Purchase[], total: number } => {
  const filteredPurchases = purchaseOrders.filter(purchase =>
    purchase.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    purchase.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const start = (page - 1) * pageSize;
  const paginatedPurchases = filteredPurchases.slice(start, start + pageSize);

  return {
    items: paginatedPurchases,
    total: filteredPurchases.length
  };
};
