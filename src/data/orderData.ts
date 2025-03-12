
import { Order, OrderStatus } from "@/types/order";
import { generateInventoryItems } from "./inventoryData";
import { format, subDays, subHours, subMinutes } from "date-fns";

// Sample customer data
const customers = [
  { id: "cust-001", name: "John Smith", email: "john.smith@example.com", phone: "555-123-4567" },
  { id: "cust-002", name: "Jane Doe", email: "jane.doe@example.com", phone: "555-987-6543" },
  { id: "cust-003", name: "Bob Johnson", email: "bob.johnson@example.com", phone: "555-456-7890" },
  { id: "cust-004", name: "Alice Williams", email: "alice.williams@example.com", phone: "555-234-5678" },
  { id: "cust-005", name: "Charlie Brown", email: "charlie.brown@example.com", phone: "555-876-5432" },
  { id: "cust-006", name: "Diana Miller", email: "diana.miller@example.com", phone: "555-345-6789" },
  { id: "cust-007", name: "Edward Davis", email: "edward.davis@example.com", phone: "555-765-4321" },
  { id: "cust-008", name: "Fiona Wilson", email: "fiona.wilson@example.com", phone: "555-567-8901" },
  { id: "cust-009", name: "George Taylor", email: "george.taylor@example.com", phone: "555-654-3210" },
  { id: "cust-010", name: "Hannah Moore", email: "hannah.moore@example.com", phone: "555-890-1234" },
];

// Sample payment methods
const paymentMethods = [
  "Credit Card", 
  "PayPal", 
  "Bank Transfer", 
  "Cash on Delivery", 
  "Store Credit"
];

// Sample cities, states, and countries
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "Austin"];
const states = ["NY", "CA", "IL", "TX", "AZ", "PA", "FL", "OH", "MI", "GA"];
const countries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Japan", "China", "Brazil", "Mexico"];

// Generate a random date within a range of days
const randomDate = (daysAgo: number): string => {
  const date = subDays(new Date(), Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Random shipping address generator
const generateShippingAddress = () => {
  const cityIndex = Math.floor(Math.random() * cities.length);
  const stateIndex = Math.floor(Math.random() * states.length);
  const countryIndex = Math.floor(Math.random() * countries.length);
  
  return {
    line1: `${Math.floor(Math.random() * 9999) + 1} ${["Main", "Oak", "Maple", "Pine", "Cedar"][Math.floor(Math.random() * 5)]} ${["St", "Ave", "Blvd", "Dr", "Ln"][Math.floor(Math.random() * 5)]}`,
    line2: Math.random() > 0.7 ? `Apt ${Math.floor(Math.random() * 999) + 1}` : undefined,
    city: cities[cityIndex],
    state: states[stateIndex],
    postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
    country: countries[countryIndex]
  };
};

// Generate an order number
const generateOrderNumber = (index: number): string => {
  return `ORD-${String(2023)}${String(index + 1).padStart(5, '0')}`;
};

// Generate random items for an order
const generateOrderItems = () => {
  const allItems = generateInventoryItems();
  const numItems = Math.floor(Math.random() * 5) + 1; // 1 to 5 items per order
  const selectedItems = [];
  
  for (let i = 0; i < numItems; i++) {
    const randomIndex = Math.floor(Math.random() * allItems.length);
    const item = allItems[randomIndex];
    
    const quantity = Math.floor(Math.random() * 5) + 1; // 1 to 5 quantity
    const price = item.price;
    const subtotal = price * quantity;
    
    selectedItems.push({
      id: `item-${i + 1}`,
      product: {
        id: item.id,
        name: item.name,
        sku: item.sku,
        price: item.price,
        imageUrl: item.imageUrl
      },
      quantity,
      price,
      subtotal
    });
  }
  
  return selectedItems;
};

// Generate random status with timestamps
const generateStatusWithDates = (createdAt: string): { status: OrderStatus, shippedAt?: string, deliveredAt?: string } => {
  const statuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"];
  const weights = [0.15, 0.2, 0.3, 0.25, 0.05, 0.05]; // Probability weights for each status
  
  let cumulativeWeight = 0;
  const randomValue = Math.random();
  let selectedStatus: OrderStatus = "pending";
  
  for (let i = 0; i < statuses.length; i++) {
    cumulativeWeight += weights[i];
    if (randomValue <= cumulativeWeight) {
      selectedStatus = statuses[i];
      break;
    }
  }
  
  const createdDate = new Date(createdAt);
  let shippedAt: string | undefined;
  let deliveredAt: string | undefined;
  
  if (["shipped", "delivered"].includes(selectedStatus)) {
    // Add 1-3 days for shipping
    shippedAt = subDays(
      subHours(
        subMinutes(new Date(), Math.floor(Math.random() * 60)), 
        Math.floor(Math.random() * 24)
      ), 
      Math.floor(Math.random() * 3) + 1
    ).toISOString();
  }
  
  if (selectedStatus === "delivered") {
    // Add 1-5 days after shipping for delivery
    deliveredAt = subDays(
      subHours(
        subMinutes(new Date(), Math.floor(Math.random() * 60)), 
        Math.floor(Math.random() * 12)
      ), 
      Math.floor(Math.random() * 5) + 1
    ).toISOString();
  }
  
  return { status: selectedStatus, shippedAt, deliveredAt };
};

// Generate 100 random orders
export const generateOrders = (): Order[] => {
  const orders: Order[] = [];
  
  for (let i = 0; i < 100; i++) {
    const customerIndex = Math.floor(Math.random() * customers.length);
    const customer = customers[customerIndex];
    
    const items = generateOrderItems();
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = parseFloat((subtotal * 0.08).toFixed(2)); // 8% tax
    const shipping = parseFloat((5 + Math.random() * 15).toFixed(2)); // $5-$20 shipping
    
    // Apply discount to some orders
    const hasDiscount = Math.random() > 0.7;
    const discount = hasDiscount ? parseFloat((subtotal * (Math.random() * 0.2)).toFixed(2)) : undefined; // 0-20% discount
    
    const grandTotal = parseFloat((subtotal + tax + shipping - (discount || 0)).toFixed(2));
    
    // Generate dates - created between 1-90 days ago
    const createdAt = randomDate(90);
    const updatedAt = subHours(new Date(), Math.floor(Math.random() * 48)).toISOString();
    
    const { status, shippedAt, deliveredAt } = generateStatusWithDates(createdAt);
    
    orders.push({
      id: `order-${i + 1}`,
      orderNumber: generateOrderNumber(i),
      customer,
      items,
      status,
      total: subtotal,
      tax,
      shipping,
      discount,
      grandTotal,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      shippingAddress: generateShippingAddress(),
      notes: Math.random() > 0.8 ? "Customer requested gift wrapping" : undefined,
      createdAt,
      updatedAt,
      shippedAt,
      deliveredAt
    });
  }
  
  // Sort orders by createdAt date, newest first
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Mock function to get orders with pagination and search
export const getOrders = (
  page: number = 1, 
  pageSize: number = 20,
  searchQuery: string = "",
  statusFilter?: OrderStatus
): { items: Order[], total: number } => {
  const allOrders = generateOrders();
  
  // Filter orders based on search query and status
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = searchQuery
      ? (
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true;
    
    const matchesStatus = statusFilter
      ? order.status === statusFilter
      : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Paginate the results
  const startIndex = (page - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);
  
  return {
    items: paginatedOrders,
    total: filteredOrders.length
  };
};
