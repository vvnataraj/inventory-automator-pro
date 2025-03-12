
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { PurchaseStatus } from "@/types/purchase";

export interface PurchaseFormData {
  poNumber: string;
  supplier: string;
  status: PurchaseStatus;
  totalCost: number;
  orderDate: string;
  expectedDeliveryDate: string;
}

interface AddPurchaseModalProps {
  onPurchaseAdded: (purchase: PurchaseFormData) => void;
}

export function AddPurchaseModal({ onPurchaseAdded }: AddPurchaseModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<PurchaseFormData>({
    poNumber: `PO-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
    supplier: "",
    status: "pending",
    totalCost: 0,
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleChange = (field: keyof PurchaseFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.poNumber || !formData.supplier) {
      toast({
        title: "Error",
        description: "PO Number and Supplier are required",
        variant: "destructive",
      });
      return;
    }

    // Pass the data to parent component
    onPurchaseAdded(formData);
    
    // Reset form and close dialog
    setFormData({
      poNumber: `PO-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      supplier: "",
      status: "pending",
      totalCost: 0,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setOpen(false);
    
    toast({
      title: "Success",
      description: "Purchase order created successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Purchase Order</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              Add a new purchase order to the system.
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
                onValueChange={(value) => handleChange("status", value)}
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
            <Button type="submit">Create Purchase Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
