
import { InventoryItem } from "@/types/inventory";

/**
 * Generates CSV content from inventory items
 */
export const generateCSV = (data: InventoryItem[]): string => {
  const headers = ["id", "sku", "name", "category", "description", "cost", "rrp", "stock", "location", "supplier", "isActive"];
  const csvRows = [headers.join(",")];
  
  data.forEach(item => {
    const row = headers.map(header => {
      const value = item[header as keyof InventoryItem];
      if (typeof value === "string" && value.includes(",")) {
        return `"${value}"`;
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
    Object.entries(item).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        const escapedValue = String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
        
        xml += `    <${key}>${escapedValue}</${key}>\n`;
      }
    });
    xml += '  </item>\n';
  });
  
  xml += '</inventory>';
  return xml;
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
      return "text/csv"; // simplified as CSV
    case "pdf":
      return "text/csv"; // simplified as CSV
    default:
      return "text/plain";
  }
};
