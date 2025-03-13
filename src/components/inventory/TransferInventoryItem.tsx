
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InventoryItem, TransferData } from "@/types/inventory";
import { format } from "date-fns";
import { useLocations } from "@/hooks/useLocations";
import { PackingSlipDialog } from "./PackingSlipDialog";

interface TransferInventoryItemProps {
  item: InventoryItem;
  onTransfer: (item: InventoryItem, quantity: number, newLocation: string) => void;
  showLabel?: boolean;
}

export const TransferInventoryItem = ({ item, onTransfer, showLabel = false }: TransferInventoryItemProps) => {
  const { locations } = useLocations();
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [fromLocation, setFromLocation] = useState(item.location);
  const [toLocation, setToLocation] = useState("");
  const [showPackingSlip, setShowPackingSlip] = useState(false);
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity > 0 && quantity <= item.stock && toLocation && fromLocation !== toLocation) {
      // Create transfer data for packing slip
      const transferData: TransferData = {
        fromLocation,
        toLocation,
        quantity,
        item,
        date: new Date().toISOString(),
        referenceNumber: `TR-${Date.now().toString().substring(8)}`
      };
      
      setTransferData(transferData);
      setShowPackingSlip(true);
      
      // Perform actual transfer
      onTransfer(item, quantity, toLocation);
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    // Reset form
    setQuantity(1);
    setFromLocation(item.location);
    setToLocation("");
  };
  
  const availableLocations = locations.map(loc => loc.name);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size={showLabel ? "sm" : "icon"} 
            className={showLabel ? "h-8 flex gap-1" : ""}
            title="Transfer Item"
          >
            <ArrowRightLeft className="h-4 w-4" />
            {showLabel && "Transfer"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transfer Inventory</DialogTitle>
            <DialogDescription>
              Move {item.name} between locations
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fromLocation" className="text-right">From Location</Label>
                <div className="col-span-3">
                  <Select
                    value={fromLocation}
                    onValueChange={setFromLocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source location" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLocations.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="toLocation" className="text-right">To Location</Label>
                <div className="col-span-3">
                  <Select
                    value={toLocation}
                    onValueChange={setToLocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination location" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLocations
                        .filter(loc => loc !== fromLocation)
                        .map(location => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min={1}
                  max={item.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={quantity <= 0 || quantity > item.stock || !toLocation || fromLocation === toLocation}
              >
                Transfer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {transferData && (
        <PackingSlipDialog
          open={showPackingSlip}
          onClose={() => {
            setShowPackingSlip(false);
            handleDialogClose();
          }}
          transferData={transferData}
        />
      )}
    </>
  );
};
