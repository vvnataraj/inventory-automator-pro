
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileDown, Upload, X } from "lucide-react";
import { InventoryItem } from "@/types/inventory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface InventoryDataActionsProps {
  items: InventoryItem[];
  onImport?: (items: InventoryItem[]) => void;
}

export const ExportInventoryButton: React.FC<InventoryDataActionsProps> = ({ 
  items, 
  onImport 
}) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = (format: string) => {
    setExportFormat(format);
    setIsExportDialogOpen(true);
  };

  const handleImport = (format: string) => {
    setExportFormat(format);
    setIsImportDialogOpen(true);
  };

  const fetchAllItemsFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*');
      
      if (error) {
        console.error("Error fetching items from Supabase:", error);
        toast.error("Failed to fetch all items from database");
        return null;
      }
      
      if (!data || data.length === 0) {
        console.log("No data in Supabase, using provided items");
        return items;
      }
      
      const dbItems = data.map(item => {
        let dimensionsData = typeof item.dimensions === 'object' ? item.dimensions : null;
        let weightData = typeof item.weight === 'object' ? item.weight : null;
        
        return {
          id: item.id,
          sku: item.sku,
          name: item.name,
          description: item.description || "",
          category: item.category || "",
          subcategory: item.subcategory || "",
          brand: item.brand || "",
          rrp: item.price || 0,
          cost: item.cost || 0,
          stock: item.stock || 0,
          lowStockThreshold: item.low_stock_threshold || 5,
          minStockCount: item.min_stock_count || 1,
          location: item.location || "",
          barcode: item.barcode || "",
          dateAdded: item.date_added,
          lastUpdated: item.last_updated,
          imageUrl: item.image_url,
          dimensions: dimensionsData ? {
            length: dimensionsData.length || 0,
            width: dimensionsData.width || 0,
            height: dimensionsData.height || 0,
            unit: dimensionsData.unit || 'cm'
          } : undefined,
          weight: weightData ? {
            value: weightData.value || 0,
            unit: weightData.unit || 'kg'
          } : undefined,
          isActive: item.is_active,
          supplier: item.supplier || "",
          tags: item.tags || []
        } as InventoryItem;
      });
      
      console.log("Fetched all items from Supabase:", dbItems);
      return dbItems;
    } catch (error) {
      console.error("Error in fetchAllItemsFromDatabase:", error);
      toast.error("Failed to fetch items from database");
      return items;
    }
  };

  const generateExport = async () => {
    setIsExporting(true);
    
    try {
      const allItems = await fetchAllItemsFromDatabase();
      
      if (!allItems) {
        toast.error("Failed to export data from database");
        setIsExporting(false);
        setIsExportDialogOpen(false);
        return;
      }
      
      const dataToExport = allItems;
      
      setTimeout(() => {
        let content = "";
        let filename = `inventory-export-${new Date().toISOString().split('T')[0]}`;
        let mimeType = "";
        
        switch (exportFormat) {
          case "csv":
            content = generateCSV(dataToExport);
            filename += ".csv";
            mimeType = "text/csv";
            break;
          case "json":
            content = JSON.stringify(dataToExport, null, 2);
            filename += ".json";
            mimeType = "application/json";
            break;
          case "xml":
            content = generateXML(dataToExport);
            filename += ".xml";
            mimeType = "application/xml";
            break;
          case "xlsx":
            content = generateCSV(dataToExport);
            filename += ".csv";
            mimeType = "text/csv";
            toast.info("XLSX export is simplified as CSV format");
            break;
          case "pdf":
            content = generateCSV(dataToExport);
            filename += ".csv";
            mimeType = "text/csv";
            toast.info("PDF export is simplified as CSV format");
            break;
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setIsExporting(false);
          setIsExportDialogOpen(false);
          toast.success(`Inventory exported as ${exportFormat.toUpperCase()} from database successfully!`);
        }, 100);
      }, 500);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
      setIsExporting(false);
      setIsExportDialogOpen(false);
    }
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

    if (exportFormat === 'csv' && fileExtension === 'csv') isValidFileType = true;
    if (exportFormat === 'json' && fileExtension === 'json') isValidFileType = true;
    if (exportFormat === 'xml' && fileExtension === 'xml') isValidFileType = true;
    if (exportFormat === 'xlsx' && (fileExtension === 'xlsx' || fileExtension === 'csv')) isValidFileType = true;
    if (exportFormat === 'pdf' && (fileExtension === 'pdf' || fileExtension === 'csv')) isValidFileType = true;

    if (!isValidFileType) {
      toast.error(`Invalid file type. Expected ${exportFormat}`);
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
        switch (exportFormat) {
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
          case "pdf":
            importedItems = parseCSV(content);
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
  
  const generateCSV = (data: InventoryItem[]): string => {
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
  
  const generateXML = (data: InventoryItem[]): string => {
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Import / Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem className="text-primary font-medium cursor-default" disabled>Export Data</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("pdf")} className="gap-2">
            <Download className="h-4 w-4" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("xlsx")} className="gap-2">
            <Download className="h-4 w-4" />
            Export as XLSX
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2">
            <Download className="h-4 w-4" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("json")} className="gap-2">
            <Download className="h-4 w-4" />
            Export as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("xml")} className="gap-2">
            <Download className="h-4 w-4" />
            Export as XML
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="text-primary font-medium cursor-default" disabled>Import Data</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleImport("csv")} className="gap-2">
            <Upload className="h-4 w-4" />
            Import from CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleImport("json")} className="gap-2">
            <Upload className="h-4 w-4" />
            Import from JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleImport("xml")} className="gap-2">
            <Upload className="h-4 w-4" />
            Import from XML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleImport("xlsx")} className="gap-2">
            <Upload className="h-4 w-4" />
            Import from XLSX
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={processImportedFile}
        style={{ display: 'none' }}
        accept={
          exportFormat === 'csv' ? '.csv' :
          exportFormat === 'json' ? '.json' :
          exportFormat === 'xml' ? '.xml' :
          exportFormat === 'xlsx' ? '.xlsx,.csv' :
          exportFormat === 'pdf' ? '.pdf,.csv' : ''
        }
      />
      
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Inventory</DialogTitle>
            <DialogDescription>
              You are about to export all inventory items from the database as a {exportFormat?.toUpperCase()} file.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={generateExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Inventory</DialogTitle>
            <DialogDescription>
              Select a {exportFormat?.toUpperCase()} file to import inventory items.
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
