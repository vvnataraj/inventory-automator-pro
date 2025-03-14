
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Purchase, PurchaseStatus } from "@/types/purchase";
import { PurchaseFormData } from "./AddPurchaseModal";

interface EditPurchaseModalProps {
  purchase: Purchase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseUpdated: (purchase: Purchase) => void;
}

export function EditPurchaseModal({ 
  purchase, 
  open, 
  onOpenChange, 
  onPurchaseUpdated 
}: EditPurchaseModalProps) {
  const [formData, setFormData] = useState<PurchaseFormData>({
    poNumber: "",
    supplier: "",
    status: "pending",
    totalCost: 0,
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: new Date().toISOString().split('T')[0],
  });

  // Update form when purchase changes
  useEffect(() => {
    if (purchase) {
      setFormData({
        poNumber: purchase.poNumber,
        supplier: purchase.supplier,
        status: purchase.status,
        totalCost: purchase.totalCost,
        orderDate: purchase.orderDate.split('T')[0],
        expectedDeliveryDate: purchase.expectedDeliveryDate.split('T')[0],
      });
    }
  }, [purchase]);

  const handleChange = (field: keyof PurchaseFormData, value: string | number | PurchaseStatus) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!purchase || !formData.poNumber || !formData.supplier) {
      toast({
        title: "Error",
        description: "PO Number and Supplier are required",
      });
      return;
    }

    // Create updated purchase with all original fields plus updated ones
    const updatedPurchase: Purchase = {
      ...purchase,
      poNumber: formData.poNumber,
      supplier: formData.supplier,
      status: formData.status,
      totalCost: formData.totalCost,
      orderDate: formData.orderDate,
      expectedDeliveryDate: formData.expectedDeliveryDate,
    };

    // Pass the complete updated purchase to parent component
    onPurchaseUpdated(updatedPurchase);
    onOpenChange(false);
    
    toast({
      title: "Success",
      description: "Purchase order updated successfully",
    });
  };

  if (!purchase) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Purchase Order</DialogTitle>
            <DialogDescription>
              Update purchase order information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="poNumber" className="text-right">
                PO Number
              </Label>
              <Input
                id="poNumber"
                value={formData.poNumber}
                onChange={(e) => handleChange("poNumber", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleChange("supplier", e.target.value)}
                className="col-span-3"
                placeholder="e.g. Acme Supplies"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: PurchaseStatus) => handleChange("status", value)}
              >
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalCost" className="text-right">
                Total Cost ($)
              </Label>
              <Input
                id="totalCost"
                type="number"
                min="0"
                step="0.01"
                value={formData.totalCost}
                onChange={(e) => handleChange("totalCost", parseFloat(e.target.value) || 0)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orderDate" className="text-right">
                Order Date
              </Label>
              <Input
                id="orderDate"
                type="date"
                value={formData.orderDate}
                onChange={(e) => handleChange("orderDate", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expectedDeliveryDate" className="text-right">
                Expected Delivery
              </Label>
              <Input
                id="expectedDeliveryDate"
                type="date"
                value={formData.expectedDeliveryDate}
                onChange={(e) => handleChange("expectedDeliveryDate", e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Update Purchase Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
