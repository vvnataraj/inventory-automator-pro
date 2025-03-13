
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { TransferData } from "@/types/inventory";
import { useReactToPrint } from "react-to-print";
import { CourierBookingForm } from "./CourierBookingForm";
import { PrintableDocument } from "./PrintableDocument";
import { DialogActionButtons } from "./DialogActionButtons";
import { generatePackingSlipPDF } from "./PDFGenerator";

interface PackingSlipDialogProps {
  open: boolean;
  onClose: () => void;
  transferData: TransferData;
}

export const PackingSlipDialog = ({ open, onClose, transferData }: PackingSlipDialogProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [showCourierForm, setShowCourierForm] = useState(false);
  
  const handlePrint = useReactToPrint({
    documentTitle: `Packing_Slip_${transferData.referenceNumber}`,
    onPrintError: (error) => console.error('Print failed', error),
    pageStyle: "@page { size: auto; margin: 10mm; }",
    onAfterPrint: () => console.log('Print completed'),
    contentRef: printRef,
  });
  
  const generatePDF = () => {
    generatePackingSlipPDF(transferData);
  };
  
  const handleShowCourierForm = () => {
    setShowCourierForm(true);
  };
  
  const handleCloseCourierForm = () => {
    setShowCourierForm(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        {!showCourierForm ? (
          <>
            <DialogHeader>
              <DialogTitle>Packing Slip</DialogTitle>
            </DialogHeader>
            
            <PrintableDocument ref={printRef} transferData={transferData} />
            
            <DialogFooter>
              <DialogActionButtons
                onClose={onClose}
                onPrint={handlePrint}
                onGeneratePDF={generatePDF}
                onBookCourier={handleShowCourierForm}
              />
            </DialogFooter>
          </>
        ) : (
          <CourierBookingForm 
            transferData={transferData} 
            onCancel={handleCloseCourierForm}
            onComplete={() => {
              handleCloseCourierForm();
              onClose();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
