
import { InventoryItem } from "@/types/inventory";

/**
 * Generates CSV content from inventory items
 */
export const generateCSV = (data: InventoryItem[]): string => {
  // Include all relevant fields needed for import, ensuring id (UUID) is first
  const headers = [
    "id", "sku", "name", "description", "category", "subcategory", 
    "brand", "price", "rrp", "cost", "stock", "lowStockThreshold",
    "minStockCount", "location", "barcode", "dateAdded", 
    "lastUpdated", "imageUrl", "isActive", "supplier", 
    "dimensions", "weight", "tags"
  ];
  
  const csvRows = [headers.join(",")];
  
  data.forEach(item => {
    const row = headers.map(header => {
      const value = item[header as keyof InventoryItem];
      
      // Handle special cases for complex objects
      if (header === "dimensions" && item.dimensions) {
        return `"${JSON.stringify(item.dimensions).replace(/"/g, '""')}"`;
      }
      
      if (header === "weight" && item.weight) {
        return `"${JSON.stringify(item.weight).replace(/"/g, '""')}"`;
      }
      
      if (header === "tags" && Array.isArray(item.tags)) {
        return `"${JSON.stringify(item.tags).replace(/"/g, '""')}"`;
      }
      
      // Handle string values with commas by quoting them
      if (typeof value === "string" && value.includes(",")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      
      // Handle null/undefined values
      if (value === null || value === undefined) {
        return "";
      }
      
      // Handle boolean values as strings that can be parsed by the import function
      if (typeof value === "boolean") {
        return value ? "true" : "false";
      }
      
      // Convert date objects to ISO strings
      if (value instanceof Date) {
        return value.toISOString();
      }
      
      return value;
    });
    
    csvRows.push(row.join(","));
  });
  
  return csvRows.join("\n");
};

/**
 * Generates XML content from inventory items
 */
export const generateXML = (data: InventoryItem[]): string => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<inventory>\n';
  
  data.forEach(item => {
    xml += '  <item>\n';
    
    // Always include the ID first to ensure it's preserved
    xml += `    <id>${item.id}</id>\n`;
    
    // Process each property in the item
    Object.entries(item).forEach(([key, value]) => {
      // Skip id since we already added it
      if (key === 'id') return;
      
      if (value !== null && value !== undefined) {
        // Handle complex objects like dimensions, weight
        if (key === 'dimensions' && value) {
          xml += `    <${key}>\n`;
          Object.entries(value).forEach(([dimKey, dimValue]) => {
            xml += `      <${dimKey}>${dimValue}</${dimKey}>\n`;
          });
          xml += `    </${key}>\n`;
        } else if (key === 'weight' && value) {
          xml += `    <${key}>\n`;
          Object.entries(value).forEach(([weightKey, weightValue]) => {
            xml += `      <${weightKey}>${weightValue}</${weightKey}>\n`;
          });
          xml += `    </${key}>\n`;
        } else if (Array.isArray(value) && key === 'tags') {
          xml += `    <${key}>\n`;
          value.forEach(tag => {
            xml += `      <tag>${escapeXml(String(tag))}</tag>\n`;
          });
          xml += `    </${key}>\n`;
        } else if (typeof value !== 'object') {
          // Handle primitive values
          const escapedValue = escapeXml(String(value));
          xml += `    <${key}>${escapedValue}</${key}>\n`;
        }
      }
    });
    
    xml += '  </item>\n';
  });
  
  xml += '</inventory>';
  return xml;
};

/**
 * Helper function to escape special XML characters
 */
const escapeXml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Generates JSON content from inventory items
 */
export const generateJSON = (data: InventoryItem[]): string => {
  return JSON.stringify(data, null, 2);
};

/**
 * Returns the appropriate mime type for a given export format
 */
export const getMimeType = (format: string): string => {
  switch (format) {
    case "csv":
      return "text/csv";
    case "json":
      return "application/json";
    case "xml":
      return "application/xml";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "pdf":
      return "application/pdf";
    default:
      return "text/plain";
  }
};
