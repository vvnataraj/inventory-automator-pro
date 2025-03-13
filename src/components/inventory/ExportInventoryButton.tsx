
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileDown, X } from "lucide-react";
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

interface ExportInventoryButtonProps {
  items: InventoryItem[];
}

export const ExportInventoryButton: React.FC<ExportInventoryButtonProps> = ({ items }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: string) => {
    setExportFormat(format);
    setIsDialogOpen(true);
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
          console.log("XLSX export would require additional libraries");
          break;
        case "pdf":
          // For PDF, we'd need a library like jspdf
          content = generateCSV(dataToExport);
          filename += ".csv"; // Using CSV as fallback
          mimeType = "text/csv";
          console.log("PDF export would require additional libraries");
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
        setIsDialogOpen(false);
      }, 100);
    }, 500); // Simulating processing time
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
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("xlsx")}>Export as XLSX</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("json")}>Export as JSON</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("xml")}>Export as XML</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
    </>
  );
};
