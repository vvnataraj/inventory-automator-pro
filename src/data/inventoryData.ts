
// This file now serves as a re-export point for the refactored inventory data structure
// It maintains backward compatibility with existing code that imports from this path

import { staticInventoryItems, inventoryItems } from "./inventory/inventoryItems";
import { generatePurchaseOrders, purchaseOrders, locationsData } from "./inventory/mockData";
import { getInventoryItems, getPurchases } from "./inventory/inventoryService";

// Export all the items and functions to maintain backward compatibility
export {
  staticInventoryItems,
  inventoryItems,
  generatePurchaseOrders,
  purchaseOrders,
  locationsData,
  getInventoryItems,
  getPurchases
};

// Define locations for backward compatibility if needed
export const locations = ["Warehouse A", "Warehouse B", "Storefront", "Online"];

// Export a helper function to generate inventory items for compatibility
export const generateInventoryItems = () => {
  return staticInventoryItems;
};
