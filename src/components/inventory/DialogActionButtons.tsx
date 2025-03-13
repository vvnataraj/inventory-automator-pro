
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, Package } from "lucide-react";

interface DialogActionButtonsProps {
  onClose: () => void;
  onPrint: () => void;
  onGeneratePDF: () => void;
  onBookCourier: () => void;
}

export const DialogActionButtons = ({
  onClose,
  onPrint,
  onGeneratePDF,
  onBookCourier,
}: DialogActionButtonsProps) => {
  return (
    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2">
      <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
        Close
      </Button>
      <Button 
        onClick={onPrint} 
        className="gap-2 w-full sm:w-auto"
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
      <Button onClick={onGeneratePDF} variant="default" className="gap-2 w-full sm:w-auto">
        <Printer className="h-4 w-4" />
        Save PDF
      </Button>
      <Button onClick={onBookCourier} variant="default" className="gap-2 w-full sm:w-auto">
        <Package className="h-4 w-4" />
        Book Courier
      </Button>
    </div>
  );
};
