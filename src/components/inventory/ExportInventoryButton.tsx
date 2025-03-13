
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileDown } from "lucide-react";
import { InventoryItem } from "@/types/inventory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportDialog } from "./ExportDialog";
import { useInventoryExport } from "@/hooks/inventory/useInventoryExport";

interface ExportInventoryButtonProps {
  items: InventoryItem[];
}

export const ExportInventoryButton: React.FC<ExportInventoryButtonProps> = ({ items }) => {
  const {
    isExportDialogOpen,
    setIsExportDialogOpen,
    exportFormat,
    isExporting,
    handleExport,
    generateExport
  } = useInventoryExport(items);

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
      
      <ExportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        format={exportFormat}
        isExporting={isExporting}
        onExport={generateExport}
      />
    </>
  );
};
