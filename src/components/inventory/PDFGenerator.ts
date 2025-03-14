
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
  
  // Add logo and app name
  const logoWidth = 20;
  const logoHeight = 20;
  const logoX = doc.internal.pageSize.width / 2 - logoWidth / 2 - 20;
  const logoY = 10;
  
  // Create a temporary image element to load the logo
  const img = new Image();
  img.src = "/lovable-uploads/f849ba67-c0f4-4e4b-9f84-e91df8d9b64d.png";
  
  // Once the image is loaded, add it to the PDF
  img.onload = () => {
    // Add the image to the PDF
    doc.addImage(img, 'PNG', logoX, logoY, logoWidth, logoHeight);
    
    // Add app name
    doc.setFontSize(18);
    doc.setTextColor(128, 0, 128); // Purple color
    doc.text("STOCKtopus", doc.internal.pageSize.width / 2 + 10, logoY + 12);
    
    // Add title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("PACKING SLIP", 105, logoY + 30, { align: "center" });
    
    // Add reference number and date
    doc.setFontSize(10);
    doc.text(`Reference #: ${transferData.referenceNumber}`, 15, logoY + 45);
    doc.text(`Date: ${format(new Date(transferData.date), "MMM dd, yyyy")}`, 15, logoY + 50);
    
    // Add from/to information
    doc.text("FROM:", 15, logoY + 60);
    doc.text(transferData.fromLocation, 40, logoY + 60);
    doc.text("TO:", 15, logoY + 65);
    doc.text(transferData.toLocation, 40, logoY + 65);
    
    // Add item details
    doc.autoTable({
      startY: logoY + 75,
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
    doc.text("Prepared By: ________________________", 15, 130);
    doc.text("Received By: ________________________", 15, 140);
    doc.text("Date: ________________________", 15, 150);
    
    doc.save(`Packing_Slip_${transferData.referenceNumber}.pdf`);
  };
  
  // Add a fallback if image fails to load
  img.onerror = () => {
    doc.setFontSize(22);
    doc.setTextColor(128, 0, 128); // Purple color
    doc.text("STOCKtopus", 105, 20, { align: "center" });
    
    // Continue with the rest of the document
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("PACKING SLIP", 105, 35, { align: "center" });
    
    // Add reference number and date
    doc.setFontSize(10);
    doc.text(`Reference #: ${transferData.referenceNumber}`, 15, 50);
    doc.text(`Date: ${format(new Date(transferData.date), "MMM dd, yyyy")}`, 15, 55);
    
    // Add from/to information
    doc.text("FROM:", 15, 65);
    doc.text(transferData.fromLocation, 40, 65);
    doc.text("TO:", 15, 70);
    doc.text(transferData.toLocation, 40, 70);
    
    // Add item details
    doc.autoTable({
      startY: 80,
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
    doc.text("Prepared By: ________________________", 15, 130);
    doc.text("Received By: ________________________", 15, 140);
    doc.text("Date: ________________________", 15, 150);
    
    doc.save(`Packing_Slip_${transferData.referenceNumber}.pdf`);
  };
};
