
import { faker } from "@faker-js/faker";
import { Purchase, PurchaseItem, PurchaseStatus } from "@/types/purchase";
import { inventoryItems } from "./inventoryItems";

// Helper functions for generating mock purchase orders
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

// Generate mock purchase orders
export const purchaseOrders = generatePurchaseOrders(50);

// Mock locations data
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
