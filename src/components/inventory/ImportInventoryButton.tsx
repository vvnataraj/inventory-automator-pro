
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp } from "lucide-react";
import { InventoryItem } from "@/types/inventory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImportInventoryButtonProps {
  onImport?: (items: InventoryItem[]) => void;
}

export const ImportInventoryButton: React.FC<ImportInventoryButtonProps> = ({ onImport }) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [fileFormat, setFileFormat] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (format: string) => {
    setFileFormat(format);
    setIsImportDialogOpen(true);
  };

  const handleFileImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processImportedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      toast.error("No file selected");
      return;
    }

    setIsImporting(true);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let isValidFileType = false;

    if (fileFormat === 'csv' && fileExtension === 'csv') isValidFileType = true;
    if (fileFormat === 'json' && fileExtension === 'json') isValidFileType = true;
    if (fileFormat === 'xml' && fileExtension === 'xml') isValidFileType = true;
    if (fileFormat === 'xlsx' && (fileExtension === 'xlsx' || fileExtension === 'csv')) isValidFileType = true;

    if (!isValidFileType) {
      toast.error(`Invalid file type. Expected ${fileFormat}`);
      setIsImporting(false);
      setIsImportDialogOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      let importedItems: InventoryItem[] = [];
      
      try {
        switch (fileFormat) {
          case "csv":
            importedItems = parseCSV(content);
            break;
          case "json":
            importedItems = JSON.parse(content);
            break;
          case "xml":
            importedItems = parseXML(content);
            break;
          case "xlsx":
            importedItems = parseCSV(content);
            toast.info("XLSX import is simplified as CSV format");
            break;
        }
        
        if (onImport && importedItems.length > 0) {
          const importPromises = importedItems.map(async (item) => {
            try {
              const { data: existingItems, error: checkError } = await supabase
                .from('inventory_items')
                .select('id')
                .eq('sku', item.sku);
              
              if (checkError) {
                console.error("Error checking existing item:", checkError);
                return null;
              }
              
              if (existingItems && existingItems.length > 0) {
                const { error: updateError } = await supabase
                  .from('inventory_items')
                  .update({
                    name: item.name,
                    description: item.description,
                    category: item.category,
                    subcategory: item.subcategory,
                    brand: item.brand,
                    price: item.rrp,
                    cost: item.cost,
                    stock: item.stock,
                    low_stock_threshold: item.lowStockThreshold,
                    min_stock_count: item.minStockCount,
                    location: item.location,
                    barcode: item.barcode,
                    last_updated: new Date().toISOString(),
                    image_url: item.imageUrl,
                    dimensions: item.dimensions,
                    weight: item.weight,
                    is_active: item.isActive,
                    supplier: item.supplier,
                    tags: item.tags
                  })
                  .eq('id', existingItems[0].id);
                
                if (updateError) {
                  console.error("Error updating item:", updateError);
                  return null;
                }
                
                return { ...item, id: existingItems[0].id };
              } else {
                const { error: insertError } = await supabase
                  .from('inventory_items')
                  .insert({
                    id: item.id || undefined,
                    sku: item.sku,
                    name: item.name,
                    description: item.description,
                    category: item.category,
                    subcategory: item.subcategory,
                    brand: item.brand,
                    price: item.rrp,
                    cost: item.cost,
                    stock: item.stock,
                    low_stock_threshold: item.lowStockThreshold,
                    min_stock_count: item.minStockCount,
                    location: item.location,
                    barcode: item.barcode,
                    date_added: item.dateAdded || new Date().toISOString(),
                    last_updated: item.lastUpdated || new Date().toISOString(),
                    image_url: item.imageUrl,
                    dimensions: item.dimensions,
                    weight: item.weight,
                    is_active: item.isActive,
                    supplier: item.supplier,
                    tags: item.tags
                  });
                
                if (insertError) {
                  console.error("Error inserting item:", insertError);
                  return null;
                }
                
                return item;
              }
            } catch (error) {
              console.error("Error importing item:", error);
              return null;
            }
          });
          
          const importedResults = await Promise.all(importPromises);
          const successfulImports = importedResults.filter(item => item !== null) as InventoryItem[];
          
          if (successfulImports.length > 0) {
            onImport(successfulImports);
            toast.success(`Successfully imported ${successfulImports.length} items to database`);
          } else {
            toast.error("Failed to import items to database");
          }
        } else {
          toast.error("No valid items found in the import file");
        }
      } catch (error) {
        console.error("Import error:", error);
        toast.error("Failed to import data. Please check the file format.");
      } finally {
        setIsImporting(false);
        setIsImportDialogOpen(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    
    reader.onerror = () => {
      toast.error("Error reading file");
      setIsImporting(false);
      setIsImportDialogOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    
    if (fileExtension === 'csv' || fileExtension === 'json' || fileExtension === 'xml') {
      reader.readAsText(file);
    } else {
      toast.error("Unsupported file format");
      setIsImporting(false);
      setIsImportDialogOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  
  const parseCSV = (content: string): InventoryItem[] => {
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(header => 
      header.trim().replace(/^"(.+)"$/, '$1')
    );
    
    return lines.slice(1)
      .filter(line => line.trim().length > 0)
      .map(line => {
        const values = line.split(',').map(value => 
          value.trim().replace(/^"(.+)"$/, '$1')
        );
        
        const item: Record<string, any> = {};
        headers.forEach((header, index) => {
          const value = values[index];
          if (value === undefined) return;
          
          if (value === "true") item[header] = true;
          else if (value === "false") item[header] = false;
          else if (!isNaN(Number(value)) && value !== "") item[header] = Number(value);
          else item[header] = value;
        });
        
        return item as InventoryItem;
      });
  };
  
  const parseXML = (content: string): InventoryItem[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");
    const items: InventoryItem[] = [];
    
    const itemElements = xmlDoc.getElementsByTagName("item");
    for (let i = 0; i < itemElements.length; i++) {
      const itemEl = itemElements[i];
      const item: Record<string, any> = {};
      
      for (let j = 0; j < itemEl.children.length; j++) {
        const child = itemEl.children[j];
        const key = child.tagName;
        const value = child.textContent || "";
        
        if (value === "true") item[key] = true;
        else if (value === "false") item[key] = false;
        else if (!isNaN(Number(value)) && value !== "") item[key] = Number(value);
        else item[key] = value;
      }
      
      items.push(item as InventoryItem);
    }
    
    return items;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FileUp className="h-4 w-4" />
            Import
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => handleImport("csv")} className="gap-2">
            <Upload className="h-4 w-4" />
            CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleImport("json")} className="gap-2">
            <Upload className="h-4 w-4" />
            JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleImport("xml")} className="gap-2">
            <Upload className="h-4 w-4" />
            XML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleImport("xlsx")} className="gap-2">
            <Upload className="h-4 w-4" />
            XLSX
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={processImportedFile}
        style={{ display: 'none' }}
        accept={
          fileFormat === 'csv' ? '.csv' :
          fileFormat === 'json' ? '.json' :
          fileFormat === 'xml' ? '.xml' :
          fileFormat === 'xlsx' ? '.xlsx,.csv' : ''
        }
      />
      
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Inventory</DialogTitle>
            <DialogDescription>
              Select a {fileFormat?.toUpperCase()} file to import inventory items.
              <p className="text-muted-foreground text-sm mt-2">
                Note: This will add new items to your inventory database. Duplicate SKUs will be updated automatically.
              </p>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleFileImport} disabled={isImporting}>
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Select File
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
