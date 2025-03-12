
import { InventoryItem } from "@/types/inventory";

// Define realistic categories for a hardware store
const categories = [
  { name: "Tools", subcategories: ["Power Tools", "Hand Tools", "Tool Accessories", "Tool Storage"] },
  { name: "Building Materials", subcategories: ["Lumber", "Drywall", "Concrete", "Roofing", "Siding"] },
  { name: "Plumbing", subcategories: ["Pipes & Fittings", "Faucets", "Water Heaters", "Pumps"] },
  { name: "Electrical", subcategories: ["Wiring", "Switches & Outlets", "Lighting", "Electrical Panels"] },
  { name: "Hardware", subcategories: ["Fasteners", "Hooks & Hangers", "Cabinet Hardware", "Locks & Security"] },
  { name: "Paint", subcategories: ["Interior Paint", "Exterior Paint", "Primers", "Stains & Sealers"] },
  { name: "Flooring", subcategories: ["Laminate", "Hardwood", "Vinyl", "Tile", "Carpet"] },
  { name: "Outdoor", subcategories: ["Garden Tools", "Landscaping", "Outdoor Power Equipment", "Patio"] },
  { name: "Appliances", subcategories: ["Kitchen", "Laundry", "HVAC", "Water Filtration"] },
  { name: "Safety & Security", subcategories: ["Work Safety", "Home Security", "Fire Safety", "Child Safety"] }
];

const brands = [
  "DeWalt", "Makita", "Milwaukee", "Bosch", "Stanley", "Ryobi", "Craftsman", "Ridgid", 
  "Black & Decker", "Dremel", "Hilti", "Festool", "Hitachi", "Irwin", "Klein Tools",
  "Worx", "Metabo", "Kobalt", "Husky", "GE", "Whirlpool", "Rust-Oleum", "Behr",
  "3M", "Rubbermaid", "Simpson Strong-Tie", "Kreg", "Wago", "Lutron", "Legrand"
];

const locations = ["Main Floor", "Warehouse A", "Warehouse B", "Outdoor Storage", "Mezzanine"];
const suppliers = ["Central Supplies", "Eastern Hardware", "Western Distribution", "Northern Tools", "Southern Materials"];

// Generate a 7-character alphanumeric SKU
const generateSKU = (category: string, index: number): string => {
  const prefix = category.substring(0, 2).toUpperCase();
  const numeric = String(index).padStart(5, '0');
  return `${prefix}${numeric}`;
};

// Generate a random price between min and max
const generatePrice = (min: number, max: number): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Generate a random date within the last year
const generateDate = (minMonthsAgo: number = 0, maxMonthsAgo: number = 12): string => {
  const now = new Date();
  const monthsAgo = Math.floor(Math.random() * (maxMonthsAgo - minMonthsAgo)) + minMonthsAgo;
  now.setMonth(now.getMonth() - monthsAgo);
  return now.toISOString().split('T')[0];
};

// Generate a random barcode (EAN-13 format)
const generateBarcode = (): string => {
  let barcode = '';
  for (let i = 0; i < 12; i++) {
    barcode += Math.floor(Math.random() * 10).toString();
  }
  // In a real implementation, we would calculate a check digit
  return barcode + '0';
};

// Generate 1000 inventory items
export const generateInventoryItems = (): InventoryItem[] => {
  const items: InventoryItem[] = [];
  
  for (let i = 0; i < 1000; i++) {
    const categoryIndex = Math.floor(Math.random() * categories.length);
    const category = categories[categoryIndex];
    const subcategoryIndex = Math.floor(Math.random() * category.subcategories.length);
    const subcategory = category.subcategories[subcategoryIndex];
    
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const sku = generateSKU(category.name, i + 1);
    
    // Price range depends on category
    let minPrice = 5;
    let maxPrice = 50;
    
    if (category.name === "Tools" || category.name === "Appliances") {
      minPrice = 20;
      maxPrice = 500;
    } else if (category.name === "Building Materials") {
      minPrice = 10;
      maxPrice = 100;
    }
    
    const price = generatePrice(minPrice, maxPrice);
    const cost = generatePrice(minPrice * 0.6, price * 0.8); // Cost is typically 60-80% of price
    
    // Stock depends on price - higher price items typically have lower stock
    const maxStock = price < 20 ? 200 : price < 100 ? 50 : 20;
    const stock = Math.floor(Math.random() * maxStock) + 1;
    
    // Low stock threshold is typically 10-20% of max stock
    const lowStockThreshold = Math.max(2, Math.floor(maxStock * (0.1 + Math.random() * 0.1)));
    
    const location = locations[Math.floor(Math.random() * locations.length)];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    
    const dateAdded = generateDate(1, 12);
    const lastUpdated = generateDate(0, 1);
    
    // Generate a realistic name based on brand and subcategory
    let name = "";
    if (subcategory === "Power Tools") {
      const toolTypes = ["Drill", "Saw", "Sander", "Grinder", "Impact Driver", "Router"];
      name = `${brand} ${toolTypes[Math.floor(Math.random() * toolTypes.length)]}`;
    } else if (subcategory === "Hand Tools") {
      const toolTypes = ["Hammer", "Screwdriver Set", "Wrench", "Pliers", "Chisel", "Level"];
      name = `${brand} ${toolTypes[Math.floor(Math.random() * toolTypes.length)]}`;
    } else {
      name = `${brand} ${subcategory} ${Math.random() > 0.5 ? "Premium" : "Standard"}`;
    }
    
    // Add some variation to names
    if (Math.random() > 0.7) {
      const adjectives = ["Professional", "Heavy Duty", "Lightweight", "Portable", "Ergonomic", "High Performance"];
      name = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${name}`;
    }
    
    // Add model numbers to some items
    if (Math.random() > 0.5) {
      const modelNum = Math.floor(Math.random() * 1000) + 100;
      name = `${name} ${modelNum}`;
    }
    
    const tags = [category.name, subcategory, brand];
    if (Math.random() > 0.7) {
      const additionalTags = ["Sale", "New Arrival", "Best Seller", "Limited Stock", "Clearance"];
      tags.push(additionalTags[Math.floor(Math.random() * additionalTags.length)]);
    }
    
    const item: InventoryItem = {
      id: `item-${i + 1}`,
      sku,
      name,
      description: `High-quality ${subcategory.toLowerCase()} from ${brand}. Perfect for both professional and DIY use.`,
      category: category.name,
      subcategory,
      brand,
      price,
      cost,
      stock,
      lowStockThreshold,
      location,
      barcode: generateBarcode(),
      dateAdded,
      lastUpdated,
      isActive: Math.random() > 0.05, // 5% of items might be inactive
      supplier,
      tags,
    };
    
    // Add dimensions and weight to some items
    if (Math.random() > 0.3) {
      item.dimensions = {
        length: parseFloat((Math.random() * 100 + 10).toFixed(1)),
        width: parseFloat((Math.random() * 50 + 5).toFixed(1)),
        height: parseFloat((Math.random() * 50 + 5).toFixed(1)),
        unit: Math.random() > 0.5 ? 'cm' : 'mm'
      };
      
      item.weight = {
        value: parseFloat((Math.random() * 20 + 0.1).toFixed(2)),
        unit: Math.random() > 0.7 ? 'kg' : 'g'
      };
    }
    
    // Add image URLs to some items (placeholders)
    if (Math.random() > 0.2) {
      item.imageUrl = `https://placehold.co/400x300?text=${encodeURIComponent(subcategory)}`;
    }
    
    items.push(item);
  }
  
  return items;
};

// Mock function to get inventory items with pagination and search
export const getInventoryItems = (
  page: number = 1,
  pageSize: number = 20,
  searchQuery: string = ""
): { items: InventoryItem[], total: number } => {
  const allItems = generateInventoryItems();
  
  // Filter items based on search query
  const filteredItems = searchQuery 
    ? allItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allItems;
  
  // Paginate the results
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);
  
  return {
    items: paginatedItems,
    total: filteredItems.length
  };
};
