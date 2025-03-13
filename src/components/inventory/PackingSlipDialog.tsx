
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { TransferData } from "@/types/inventory";
import { format } from "date-fns";
import { Printer } from "lucide-react";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";

// Add missing types for jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface PackingSlipDialogProps {
  open: boolean;
  onClose: () => void;
  transferData: TransferData;
}

export const PackingSlipDialog = ({ open, onClose, transferData }: PackingSlipDialogProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    documentTitle: `Packing_Slip_${transferData.referenceNumber}`,
    onPrintError: (error) => console.error('Print failed', error),
    pageStyle: "@page { size: auto; margin: 10mm; }",
    onAfterPrint: () => console.log('Print completed'),
    // Fix: Use content instead of contentRef and provide the ref directly
    content: () => printRef.current,
  });
  
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("PACKING SLIP", 105, 15, { align: "center" });
    
    // Add reference number and date
    doc.setFontSize(10);
    doc.text(`Reference #: ${transferData.referenceNumber}`, 15, 30);
    doc.text(`Date: ${format(new Date(transferData.date), "MMM dd, yyyy")}`, 15, 35);
    
    // Add from/to information
    doc.text("FROM:", 15, 45);
    doc.text(transferData.fromLocation, 40, 45);
    doc.text("TO:", 15, 50);
    doc.text(transferData.toLocation, 40, 50);
    
    // Add item details
    doc.autoTable({
      startY: 60,
      head: [["SKU", "Item", "Description", "Quantity"]],
      body: [
        [
          transferData.item.sku,
          transferData.item.name,
          transferData.item.description.substring(0, 30) + (transferData.item.description.length > 30 ? "..." : ""),
          transferData.quantity.toString()
        ]
      ],
    });
    
    // Add signature fields
    doc.text("Prepared By: ________________________", 15, 110);
    doc.text("Received By: ________________________", 15, 120);
    doc.text("Date: ________________________", 15, 130);
    
    doc.save(`Packing_Slip_${transferData.referenceNumber}.pdf`);
  };
  
  // Create a wrapper function to handle the print button click
  const onPrintButtonClick = () => {
    if (handlePrint) {
      handlePrint();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Packing Slip</DialogTitle>
        </DialogHeader>
        
        <div ref={printRef} className="my-4 p-4 border border-gray-200 rounded-lg">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">PACKING SLIP</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Reference #:</p>
              <p className="font-medium">{transferData.referenceNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date:</p>
              <p className="font-medium">{format(new Date(transferData.date), "MMM dd, yyyy")}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">From Location:</p>
              <p className="font-medium">{transferData.fromLocation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">To Location:</p>
              <p className="font-medium">{transferData.toLocation}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Item Details:</p>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">SKU</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{transferData.item.sku}</td>
                  <td className="border border-gray-300 px-4 py-2">{transferData.item.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {transferData.item.description.substring(0, 30)}
                    {transferData.item.description.length > 30 ? "..." : ""}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{transferData.quantity}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Prepared By:</p>
              <div className="border-b border-gray-400 h-6 mt-1"></div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Received By:</p>
              <div className="border-b border-gray-400 h-6 mt-1"></div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-500">Date:</p>
            <div className="border-b border-gray-400 h-6 mt-1 w-1/2"></div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={onPrintButtonClick} 
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button onClick={generatePDF} variant="default" className="gap-2">
            <Printer className="h-4 w-4" />
            Save PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
