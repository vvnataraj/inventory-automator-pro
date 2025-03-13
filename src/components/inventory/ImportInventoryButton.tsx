
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { InventoryItem } from "@/types/inventory";
import { supabase } from "@/integrations/supabase/client";

interface ImportInventoryButtonProps {
  onImport?: (items: InventoryItem[]) => void;
}

export const ImportInventoryButton: React.FC<ImportInventoryButtonProps> = ({ 
  onImport 
}) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImportFile(file);
  };

  const mapImportedItemToInventoryItem = (item: any): InventoryItem => {
    // Parse boolean values that might be stored as strings
    const parseBoolean = (value: any): boolean => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        const lowercased = value.toLowerCase();
        return lowercased === 'true' || lowercased === '1' || lowercased === 'yes';
      }
      return Boolean(value);
    };

    // Parse numeric values that might be stored as strings
    const parseNumber = (value: any, defaultValue: number = 0): number => {
      if (value === null || value === undefined || value === '') return defaultValue;
      const parsed = Number(value);
      return isNaN(parsed) ? defaultValue : parsed;
    };

    // Handle dimensions object
    const parseDimensions = () => {
      if (!item.dimensions) return undefined;
      
      // If dimensions is a string (like from CSV), try to parse it
      if (typeof item.dimensions === 'string') {
        try {
          const parsed = JSON.parse(item.dimensions);
          return {
            length: parseNumber(parsed.length, 0),
            width: parseNumber(parsed.width, 0),
            height: parseNumber(parsed.height, 0),
            unit: parsed.unit || 'cm'
          };
        } catch (e) {
          console.warn("Could not parse dimensions string:", item.dimensions);
          return undefined;
        }
      }
      
      // If dimensions is already an object
      if (typeof item.dimensions === 'object') {
        return {
          length: parseNumber(item.dimensions.length, 0),
          width: parseNumber(item.dimensions.width, 0),
          height: parseNumber(item.dimensions.height, 0),
          unit: item.dimensions.unit || 'cm'
        };
      }
      
      return undefined;
    };

    // Handle weight object
    const parseWeight = () => {
      if (!item.weight) return undefined;
      
      // If weight is a string (like from CSV), try to parse it
      if (typeof item.weight === 'string') {
        try {
          const parsed = JSON.parse(item.weight);
          return {
            value: parseNumber(parsed.value, 0),
            unit: parsed.unit || 'kg'
          };
        } catch (e) {
          console.warn("Could not parse weight string:", item.weight);
          return undefined;
        }
      }
      
      // If weight is already an object
      if (typeof item.weight === 'object') {
        return {
          value: parseNumber(item.weight.value, 0),
          unit: item.weight.unit || 'kg'
        };
      }
      
      return undefined;
    };

    // Handle tags array
    const parseTags = () => {
      if (!item.tags) return [];
      
      // If tags is a string (like from CSV), try to parse it
      if (typeof item.tags === 'string') {
        try {
          return JSON.parse(item.tags);
        } catch (e) {
          console.warn("Could not parse tags string:", item.tags);
          return item.tags.split(',').map((tag: string) => tag.trim());
        }
      }
      
      // If tags is already an array
      if (Array.isArray(item.tags)) {
        return item.tags;
      }
      
      return [];
    };

    // Preserve original ID if it exists, otherwise generate a new one
    const itemId = item.id || `item-${uuidv4()}`;

    return {
      id: itemId,
      sku: item.sku || "",
      name: item.name || "",
      description: item.description || "",
      category: item.category || "",
      subcategory: item.subcategory || "",
      brand: item.brand || "",
      price: parseNumber(item.price),
      rrp: parseNumber(item.rrp || item.price),
      cost: parseNumber(item.cost),
      stock: parseNumber(item.stock),
      lowStockThreshold: parseNumber(item.lowStockThreshold || item.low_stock_threshold, 5),
      minStockCount: parseNumber(item.minStockCount || item.min_stock_count, 1),
      location: item.location || "",
      barcode: item.barcode || "",
      dateAdded: item.dateAdded || item.date_added || new Date().toISOString(),
      lastUpdated: item.lastUpdated || item.last_updated || new Date().toISOString(),
      imageUrl: item.imageUrl || item.image_url || "",
      dimensions: parseDimensions(),
      weight: parseWeight(),
      isActive: parseBoolean(item.isActive !== undefined ? item.isActive : item.is_active !== undefined ? item.is_active : true),
      supplier: item.supplier || "",
      tags: parseTags()
    };
  };

  const processImportedData = (data: any[]): InventoryItem[] => {
    return data.map(item => mapImportedItemToInventoryItem(item));
  };

  const importItems = async () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }

    setIsImporting(true);
    
    try {
      const fileContent = await importFile.text();
      let importedItems: any[] = [];
      
      if (importFile.name.endsWith('.json')) {
        importedItems = JSON.parse(fileContent);
      } else if (importFile.name.endsWith('.csv')) {
        importedItems = processCSV(fileContent);
      } else if (importFile.name.endsWith('.xml')) {
        try {
          importedItems = processXML(fileContent);
        } catch (error) {
          toast.error("Failed to parse XML file: " + (error instanceof Error ? error.message : String(error)));
          setIsImporting(false);
          return;
        }
      } else {
        toast.error("Unsupported file format. Please use JSON, CSV, or XML.");
        setIsImporting(false);
        return;
      }
      
      if (!Array.isArray(importedItems)) {
        importedItems = [importedItems];
      }
      
      const properInventoryItems: InventoryItem[] = processImportedData(importedItems);
      
      const shouldUseSupabase = await checkSupabaseConnection();
      
      if (shouldUseSupabase) {
        const supabaseItems = properInventoryItems.map(item => ({
          id: item.id,
          sku: item.sku,
          name: item.name,
          description: item.description,
          category: item.category,
          subcategory: item.subcategory,
          brand: item.brand,
          price: item.price,
          rrp: item.rrp,
          cost: item.cost,
          stock: item.stock,
          low_stock_threshold: item.lowStockThreshold,
          min_stock_count: item.minStockCount,
          location: item.location,
          barcode: item.barcode,
          date_added: item.dateAdded,
          last_updated: item.lastUpdated,
          image_url: item.imageUrl,
          dimensions: item.dimensions,
          weight: item.weight,
          is_active: item.isActive,
          supplier: item.supplier,
          tags: item.tags
        }));
        
        const { error } = await supabase
          .from('inventory_items')
          .upsert(supabaseItems, { onConflict: 'id' });
        
        if (error) {
          console.error("Error importing items to Supabase:", error);
          toast.error("Error importing to database: " + error.message);
          setIsImporting(false);
          return;
        }
        
        toast.success(`Successfully imported ${properInventoryItems.length} items to database!`);
      }
      
      if (onImport) {
        onImport(properInventoryItems);
      }
      
      setIsImportDialogOpen(false);
      
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import data: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsImporting(false);
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const processCSV = (csvContent: string): any[] => {
    const lines = csvContent.split('\n');
    const result = [];
    const headers = lines[0].split(',').map(h => h.trim());
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const currentLine = lines[i];
      const values: string[] = [];
      let insideQuotes = false;
      let currentValue = '';
      
      // Parse CSV considering quoted values that may contain commas
      for (let j = 0; j < currentLine.length; j++) {
        const char = currentLine[j];
        
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      values.push(currentValue);
      
      // Create the object using header keys
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        let value = (values[index] || '').trim();
        
        // Remove quotes if present
        value = value.replace(/^"(.*)"$/, '$1');
        
        // Parse booleans
        if (value.toLowerCase() === 'true') {
          obj[header] = true;
          return;
        }
        if (value.toLowerCase() === 'false') {
          obj[header] = false;
          return;
        }
        
        // Parse numbers if not empty
        if (!isNaN(Number(value)) && value !== '') {
          obj[header] = Number(value);
          return;
        }
        
        obj[header] = value;
      });
      
      result.push(obj);
    }
    
    return result;
  };

  const processXML = (xmlContent: string): any[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
    
    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      throw new Error("Invalid XML file");
    }
    
    const items = xmlDoc.getElementsByTagName("item");
    const result = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const obj: Record<string, any> = {};
      
      // Process all child elements
      for (let j = 0; j < item.children.length; j++) {
        const child = item.children[j];
        const tagName = child.tagName;
        
        // Skip empty nodes
        if (!tagName) continue;
        
        // Handle complex objects like dimensions and weight
        if (tagName === "dimensions" || tagName === "weight") {
          obj[tagName] = {};
          for (let k = 0; k < child.children.length; k++) {
            const propNode = child.children[k];
            const propName = propNode.tagName;
            if (propName) {
              const propValue = propNode.textContent || "";
              if (!isNaN(Number(propValue)) && propName !== "unit") {
                obj[tagName][propName] = Number(propValue);
              } else {
                obj[tagName][propName] = propValue;
              }
            }
          }
        } 
        // Handle tags array
        else if (tagName === "tags") {
          obj[tagName] = [];
          for (let k = 0; k < child.children.length; k++) {
            const tagNode = child.children[k];
            if (tagNode.textContent) {
              obj[tagName].push(tagNode.textContent);
            }
          }
        }
        // Simple string/number/boolean values
        else {
          const value = child.textContent || "";
          
          if (value.toLowerCase() === 'true') {
            obj[tagName] = true;
          } else if (value.toLowerCase() === 'false') {
            obj[tagName] = false;
          } else if (!isNaN(Number(value)) && value !== '') {
            obj[tagName] = Number(value);
          } else {
            obj[tagName] = value;
          }
        }
      }
      
      result.push(obj);
    }
    
    return result;
  };

  const checkSupabaseConnection = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.from('inventory_items').select('id').limit(1);
      return !error && data !== null;
    } catch {
      return false;
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsImportDialogOpen(true)} className="gap-2">
        <FileUp className="h-4 w-4" />
        Import
      </Button>
      
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Inventory</DialogTitle>
            <DialogDescription>
              Upload a JSON, CSV, or XML file containing inventory items.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 mb-6">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">JSON, CSV, or XML file</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".json,.csv,.xml" 
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
            </div>
            {importFile && (
              <p className="mt-2 text-sm text-green-600">
                Selected file: {importFile.name}
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={importItems} disabled={!importFile || isImporting}>
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Items
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
