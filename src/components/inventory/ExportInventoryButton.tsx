
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

  const generateExport = () => {
    setIsExporting(true);
    
    // Get all items rather than just current page items
    const dataToExport = [...items];
    
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
          // For XLSX, we'd need a library like exceljs or xlsx
          // This is a simplified version that just creates a CSV
          content = generateCSV(dataToExport);
          filename += ".csv"; // Using CSV as fallback
          mimeType = "text/csv";
          toast.info("XLSX export is simplified as CSV format");
          break;
        case "pdf":
          // For PDF, we'd need a library like jspdf
          content = generateCSV(dataToExport);
          filename += ".csv"; // Using CSV as fallback
          mimeType = "text/csv";
          toast.info("PDF export is simplified as CSV format");
          break;
      }
      
      // Create a download link
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setIsExportDialogOpen(false);
        toast.success(`Inventory exported as ${exportFormat.toUpperCase()} successfully!`);
      }, 100);
    }, 500); // Simulating processing time
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

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let isValidFileType = false;

    // Validate file type matches selected import format
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
            // For these formats, we're currently supporting CSV as fallback
            importedItems = parseCSV(content);
            break;
        }
        
        if (onImport && importedItems.length > 0) {
          onImport(importedItems);
          toast.success(`Successfully imported ${importedItems.length} items`);
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
          // Handle special types like numbers and booleans
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
      
      // Get all child elements
      for (let j = 0; j < itemEl.children.length; j++) {
        const child = itemEl.children[j];
        const key = child.tagName;
        const value = child.textContent || "";
        
        // Handle special types like numbers and booleans
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
        // Handle special cases, like strings with commas
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
          // Escape special XML characters
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
      
      {/* Hidden file input for import */}
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
      
      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Inventory</DialogTitle>
            <DialogDescription>
              You are about to export {items.length} inventory items as a {exportFormat?.toUpperCase()} file.
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
      
      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Inventory</DialogTitle>
            <DialogDescription>
              Select a {exportFormat?.toUpperCase()} file to import inventory items.
              <p className="text-muted-foreground text-sm mt-2">
                Note: This will add new items to your inventory. Duplicate SKUs will be handled automatically.
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

