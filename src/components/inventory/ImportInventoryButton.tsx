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
    return {
      id: item.id || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sku: item.sku || "",
      name: item.name || "",
      description: item.description || "",
      category: item.category || "",
      subcategory: item.subcategory || "",
      brand: item.brand || "",
      price: Number(item.price) || 0,
      rrp: Number(item.rrp || item.price) || 0,
      cost: Number(item.cost) || 0,
      stock: Number(item.stock) || 0,
      lowStockThreshold: Number(item.lowStockThreshold || item.low_stock_threshold) || 5,
      minStockCount: Number(item.minStockCount || item.min_stock_count) || 1,
      location: item.location || "",
      barcode: item.barcode || "",
      dateAdded: item.dateAdded || item.date_added || new Date().toISOString(),
      lastUpdated: item.lastUpdated || item.last_updated || new Date().toISOString(),
      imageUrl: item.imageUrl || item.image_url || "",
      dimensions: item.dimensions,
      weight: item.weight,
      isActive: item.isActive !== undefined ? Boolean(item.isActive) : 
            (item.is_active !== undefined ? Boolean(item.is_active) : true),
      supplier: item.supplier || "",
      tags: Array.isArray(item.tags) ? item.tags : []
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
      
      // Parse file based on format
      if (importFile.name.endsWith('.json')) {
        importedItems = JSON.parse(fileContent);
      } else if (importFile.name.endsWith('.csv')) {
        importedItems = parseCSV(fileContent);
      } else {
        toast.error("Unsupported file format. Please use JSON or CSV.");
        setIsImporting(false);
        return;
      }
      
      if (!Array.isArray(importedItems)) {
        importedItems = [importedItems];
      }
      
      // Convert all items to proper InventoryItem format
      const properInventoryItems: InventoryItem[] = processImportedData(importedItems);
      
      // Check if we should use Supabase
      const shouldUseSupabase = await checkSupabaseConnection();
      
      if (shouldUseSupabase) {
        // Insert to Supabase
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
      
      // Call the onImport callback with properly formatted items
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

  const parseCSV = (csvContent: string): any[] => {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(header => 
      header.trim().replace(/^"(.*)"$/, '$1')
    );
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',');
      const item: Record<string, any> = {};
      
      headers.forEach((header, index) => {
        let value = values[index]?.trim() || '';
        
        // Remove quotes if present
        value = value.replace(/^"(.*)"$/, '$1');
        
        // Convert boolean strings
        if (value.toLowerCase() === 'true') value = true;
        if (value.toLowerCase() === 'false') value = false;
        
        // Convert numbers
        if (!isNaN(Number(value)) && value !== '') {
          value = Number(value);
        }
        
        item[header] = value;
      });
      
      return item;
    });
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
              Upload a JSON or CSV file containing inventory items.
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
                  <p className="text-xs text-gray-500">JSON or CSV file</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".json,.csv" 
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
