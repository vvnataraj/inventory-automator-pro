
import jsPDF from "jspdf";
import { TransferData } from "@/types/inventory";
import { format } from "date-fns";

// Add missing types for jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generatePackingSlipPDF = (transferData: TransferData): void => {
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
