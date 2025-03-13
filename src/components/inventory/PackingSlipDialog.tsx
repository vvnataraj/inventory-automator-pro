
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
import { Button } from "../ui/button";
import { toast } from "sonner";

interface PackingSlipDialogProps {
  open: boolean;
  onClose: () => void;
  transferData: TransferData;
  onCompleteTransfer: () => void;
}

export const PackingSlipDialog = ({ 
  open, 
  onClose, 
  transferData, 
  onCompleteTransfer 
}: PackingSlipDialogProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [showCourierForm, setShowCourierForm] = useState(false);
  const [transferCompleted, setTransferCompleted] = useState(false);
  
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
  
  const handleCompleteTransfer = () => {
    onCompleteTransfer();
    setTransferCompleted(true);
    toast.success(`Transfer of ${transferData.quantity} units of ${transferData.item.name} completed`);
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
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-4">
              <div className="flex-1 w-full sm:w-auto">
                <Button 
                  className="w-full" 
                  onClick={handleCompleteTransfer}
                  disabled={transferCompleted}
                >
                  {transferCompleted ? "Transfer Completed" : "Complete Transfer"}
                </Button>
              </div>
              <div className="flex justify-end gap-2">
                <DialogActionButtons
                  onClose={onClose}
                  onPrint={handlePrint}
                  onGeneratePDF={generatePDF}
                  onBookCourier={handleShowCourierForm}
                />
              </div>
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
