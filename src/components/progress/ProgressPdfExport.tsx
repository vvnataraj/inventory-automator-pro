
import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

type ProgressEntry = {
  id: string;
  user_id: string;
  description: string;
  created_at: string;
  sender: string;
};

interface ProgressPdfExportProps {
  entries: ProgressEntry[];
}

export function ProgressPdfExport({ entries }: ProgressPdfExportProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const generatePDF = () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add title
      doc.setFontSize(20);
      const title = "Progress Summary Report";
      const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, 20);
      
      // Add date
      doc.setFontSize(12);
      const today = new Date().toLocaleDateString();
      doc.text(`Generated on: ${today}`, 14, 30);
      
      // Add summary statistics
      doc.setFontSize(14);
      doc.text("Progress Overview", 14, 40);
      doc.setFontSize(12);
      doc.text(`Total Entries: ${entries.length}`, 14, 50);
      
      if (entries.length > 0) {
        const latestEntry = new Date(entries[0].created_at);
        const oldestEntry = new Date(entries[entries.length - 1].created_at);
        doc.text(`Date Range: ${oldestEntry.toLocaleDateString()} - ${latestEntry.toLocaleDateString()}`, 14, 60);
      }
      
      // Convert entries to table data
      const tableData = entries.map(entry => [
        formatDate(entry.created_at),
        entry.sender || "Anonymous",
        entry.description.length > 100 ? entry.description.substring(0, 100) + "..." : entry.description
      ]);
      
      // Add table of entries
      doc.setFontSize(14);
      doc.text("Progress Entries", 14, 75);
      
      autoTable(doc, {
        head: [["Date", "User", "Description"]],
        body: tableData,
        startY: 80,
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { top: 80 },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 40 },
          2: { cellWidth: 'auto' }
        }
      });
      
      // Start a new page for detailed entries
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Detailed Progress Entries", 14, 20);
      
      let yPosition = 30;
      
      // Add each entry with full details
      entries.slice(0, Math.min(entries.length, 8)).forEach((entry, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Entry ${index + 1}:`, 14, yPosition);
        yPosition += 7;
        
        doc.setFont(undefined, 'normal');
        doc.text(`Date: ${formatDate(entry.created_at)}`, 14, yPosition);
        yPosition += 7;
        
        doc.text(`From: ${entry.sender || "Anonymous"}`, 14, yPosition);
        yPosition += 7;
        
        doc.text("Description:", 14, yPosition);
        yPosition += 7;
        
        // Handle wrapping for long descriptions
        const splitText = doc.splitTextToSize(entry.description, pageWidth - 28);
        doc.text(splitText, 14, yPosition);
        yPosition += splitText.length * 7 + 10;
      });
      
      // If there are more entries than what fits on two pages
      if (entries.length > 8) {
        doc.text(`... and ${entries.length - 8} more entries.`, 14, yPosition);
      }
      
      // Save the PDF
      doc.save("progress_summary.pdf");
      
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <Button 
      onClick={generatePDF} 
      variant="outline" 
      className="gap-2"
      disabled={entries.length === 0}
    >
      <FileDown className="h-4 w-4" />
      Export as PDF
    </Button>
  );
}
