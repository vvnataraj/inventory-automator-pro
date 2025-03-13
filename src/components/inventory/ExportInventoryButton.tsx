
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileDown } from "lucide-react";
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

interface ExportInventoryButtonProps {
  items: InventoryItem[];
}

export const ExportInventoryButton: React.FC<ExportInventoryButtonProps> = ({ items }) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: string) => {
    setExportFormat(format);
    setIsExportDialogOpen(true);
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
        const dimensionsObj = item.dimensions as Record<string, any> | null;
        const weightObj = item.weight as Record<string, any> | null;
        
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
          dimensions: dimensionsObj ? {
            length: Number(dimensionsObj.length) || 0,
            width: Number(dimensionsObj.width) || 0,
            height: Number(dimensionsObj.height) || 0,
            unit: (dimensionsObj.unit as 'cm' | 'mm' | 'in') || 'cm'
          } : undefined,
          weight: weightObj ? {
            value: Number(weightObj.value) || 0,
            unit: (weightObj.unit as 'kg' | 'g' | 'lb') || 'kg'
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
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => handleExport("pdf")} className="gap-2">
            <Download className="h-4 w-4" />
            PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("xlsx")} className="gap-2">
            <Download className="h-4 w-4" />
            XLSX
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2">
            <Download className="h-4 w-4" />
            CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("json")} className="gap-2">
            <Download className="h-4 w-4" />
            JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("xml")} className="gap-2">
            <Download className="h-4 w-4" />
            XML
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
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
    </>
  );
};
