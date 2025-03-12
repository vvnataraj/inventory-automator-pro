import { faker } from "@faker-js/faker";
import { InventoryItem } from "@/types/inventory";
import { Purchase, PurchaseItem, PurchaseStatus } from "@/types/purchase";

const locations = ["Warehouse A", "Warehouse B", "Storefront", "Online"];

// Helper function to generate inventory items
export const generateInventoryItems = (): InventoryItem[] => {
  return Array.from({ length: 100 }, (_, i) => ({
    id: `item-${i + 1}`,
    sku: faker.string.alphanumeric(8).toUpperCase(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    subcategory: faker.commerce.productAdjective(),
    brand: faker.company.name(),
    price: parseFloat(faker.commerce.price({ min: 50, max: 200 })),
    rrp: parseFloat(faker.commerce.price({ min: 200, max: 400 })),
    cost: parseFloat(faker.commerce.price({ min: 20, max: 100 })),
    stock: Math.floor(Math.random() * 100),
    lowStockThreshold: Math.floor(Math.random() * 10) + 5,
    minStockCount: Math.floor(Math.random() * 5) + 1,
    location: locations[Math.floor(Math.random() * locations.length)],
    barcode: faker.string.numeric(13),
    dateAdded: faker.date.past().toISOString(),
    lastUpdated: faker.date.recent().toISOString(),
    imageUrl: faker.image.url(),
    dimensions: {
      length: parseFloat(faker.number.float({ min: 1, max: 100 }).toFixed(2)),
      width: parseFloat(faker.number.float({ min: 1, max: 100 }).toFixed(2)),
      height: parseFloat(faker.number.float({ min: 1, max: 100 }).toFixed(2)),
      unit: 'cm'
    },
    weight: {
      value: parseFloat(faker.number.float({ min: 0.1, max: 50 }).toFixed(2)),
      unit: 'kg'
    },
    isActive: faker.datatype.boolean(),
    supplier: faker.company.name(),
    tags: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => faker.commerce.productAdjective())
  }));
};

// Generate the inventory items once
export const inventoryItems = generateInventoryItems();

// Function to get paginated and filtered inventory items
export const getInventoryItems = (
  page: number = 1,
  pageSize: number = 20,
  searchQuery: string = ""
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
