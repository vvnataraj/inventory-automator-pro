
import { useState } from "react";
import { InventoryItem } from "@/types/inventory";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { generateCSV, generateXML, generateJSON, getMimeType } from "@/utils/exportFormatGenerators";

export const useInventoryExport = (items: InventoryItem[]) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: string) => {
    setExportFormat(format);
    setIsExportDialogOpen(true);
  };

  const fetchAllItemsFromDatabase = async (): Promise<InventoryItem[] | null> => {
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
        let mimeType = getMimeType(exportFormat || "");
        
        switch (exportFormat) {
          case "csv":
            content = generateCSV(dataToExport);
            filename += ".csv";
            break;
          case "json":
            content = generateJSON(dataToExport);
            filename += ".json";
            break;
          case "xml":
            content = generateXML(dataToExport);
            filename += ".xml";
            break;
          case "xlsx":
            content = generateCSV(dataToExport);
            filename += ".csv";
            toast.info("XLSX export is simplified as CSV format");
            break;
          case "pdf":
            content = generateCSV(dataToExport);
            filename += ".csv";
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
          toast.success(`Inventory exported as ${exportFormat?.toUpperCase()} from database successfully!`);
        }, 100);
      }, 500);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
      setIsExporting(false);
      setIsExportDialogOpen(false);
    }
  };

  return {
    isExportDialogOpen,
    setIsExportDialogOpen,
    exportFormat,
    isExporting,
    handleExport,
    generateExport
  };
};
