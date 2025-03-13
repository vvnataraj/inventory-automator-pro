
import { faker } from "@faker-js/faker";
import { InventoryItem } from "@/types/inventory";
import { InventoryItemFormData } from "@/components/inventory/InventoryItemForm";

export const generateInventoryItem = (formData: InventoryItemFormData): InventoryItem => {
  return {
    id: `item-${Date.now()}`,
    sku: formData.sku || faker.string.alphanumeric(8).toUpperCase(),
    name: formData.name,
    description: faker.commerce.productDescription(),
    category: formData.category || faker.commerce.department(),
    subcategory: faker.commerce.productAdjective(),
    brand: faker.company.name(),
    price: formData.rrp || 0,
    rrp: formData.rrp,
    cost: formData.cost,
    stock: formData.stock,
    lowStockThreshold: formData.lowStockThreshold,
    minStockCount: formData.minStockCount,
    location: formData.location,
    barcode: faker.string.numeric(13),
    dateAdded: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
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
    isActive: true,
    supplier: faker.company.name(),
    tags: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => faker.commerce.productAdjective())
  };
};
