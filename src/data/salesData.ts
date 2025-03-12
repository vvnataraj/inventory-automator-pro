
import { Sale, SaleStatus } from "@/types/sale";
import { subDays, subHours, subMinutes } from "date-fns";
import { faker } from "@faker-js/faker";
import { getInventoryItems } from "./inventoryData";

// Sample customer names
const customerNames = [
  "John Smith",
  "Jane Doe",
  "Bob Johnson",
  "Alice Williams",
  "Charlie Brown",
  "Diana Miller",
  "Edward Davis",
  "Fiona Wilson",
  "George Taylor",
  "Hannah Moore",
];

// Sample payment methods
const paymentMethods = ["Cash", "Credit Card", "Debit Card", "Mobile Payment", "Check"];

// Generate a sale number
const generateSaleNumber = (index: number): string => {
  return `S-${String(index + 1).padStart(5, '0')}`;
};

// Generate a random date within a range of days
const randomDate = (daysAgo: number): string => {
  const date = subDays(new Date(), Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Generate random status with weights
const generateRandomStatus = (): SaleStatus => {
  const statuses: SaleStatus[] = ["completed", "pending", "cancelled", "refunded"];
  const weights = [0.85, 0.08, 0.04, 0.03]; // 85% completed, 8% pending, etc.
  
  let cumulativeWeight = 0;
  const randomValue = Math.random();
  
  for (let i = 0; i < statuses.length; i++) {
    cumulativeWeight += weights[i];
    if (randomValue <= cumulativeWeight) {
      return statuses[i];
    }
  }
  
  return "completed";
};

// Generate random items for a sale
const generateSaleItems = () => {
  const { items } = getInventoryItems(1, 50);
  const numItems = Math.floor(Math.random() * 5) + 1; // 1 to 5 items per sale
  const selectedItems = [];
  
  for (let i = 0; i < numItems; i++) {
    const randomIndex = Math.floor(Math.random() * items.length);
    const item = items[randomIndex];
    const quantity = Math.floor(Math.random() * 5) + 1; // 1 to 5 quantity
    const price = item.cost;
    const subtotal = price * quantity;
    
    selectedItems.push({
      inventoryItemId: item.id,
      name: item.name,
      quantity,
      price,
      subtotal
    });
  }
  
  return selectedItems;
};

// Generate 50 random sales
export const generateSales = (): Sale[] => {
  const sales: Sale[] = [];
  
  for (let i = 0; i < 50; i++) {
    const saleItems = generateSaleItems();
    const total = saleItems.reduce((sum, item) => sum + item.subtotal, 0);
    const status = generateRandomStatus();
    const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    
    sales.push({
      id: `sale-${i + 1}`,
      saleNumber: generateSaleNumber(i),
      customerName,
      items: saleItems,
      total,
      date: randomDate(30), // Within last 30 days
      status,
      paymentMethod,
      notes: Math.random() > 0.8 ? "Customer requested receipt by email" : undefined
    });
  }
  
  // Sort sales by date, newest first
  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Mock function to get sales with pagination and search
export const getSales = (
  page: number = 1, 
  pageSize: number = 10,
  searchQuery: string = ""
): { items: Sale[], total: number } => {
  const allSales = generateSales();
  
  // Filter sales based on search query
  const filteredSales = allSales.filter(sale => {
    return searchQuery
      ? (
          sale.saleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sale.customerName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true;
  });
  
  // Paginate the results
  const startIndex = (page - 1) * pageSize;
  const paginatedSales = filteredSales.slice(startIndex, startIndex + pageSize);
  
  return {
    items: paginatedSales,
    total: filteredSales.length
  };
};
