
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
  
  // Calculate the available stock at the selected source location
  const availableStock = React.useMemo(() => {
    if (item.locations && item.locations.length > 0) {
      const locationStock = item.locations.find(loc => loc.name === fromLocation);
      return locationStock ? locationStock.stock : 0;
    }
    // If no locations array, use the item's total stock
    return item.stock;
  }, [item, fromLocation]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity > 0 && quantity <= availableStock && toLocation && fromLocation !== toLocation) {
      // Create transfer data for packing slip
      const transferData: TransferData = {
        fromLocation,
        toLocation,
        quantity,
        item,
        date: new Date().toISOString(),
        referenceNumber: `TR-${Date.now().toString().substring(8)}`
      };
      
      // Set transferData state and show packing slip
      setTransferData(transferData);
      setShowPackingSlip(true);
      
      // Close the main transfer dialog
      setIsOpen(false);
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    // Reset form
    setQuantity(1);
    setFromLocation(item.location);
    setToLocation("");
  };
  
  const handlePackingSlipClose = () => {
    setShowPackingSlip(false);
    setTransferData(null);
    
    // Reset the form
    setQuantity(1);
    setFromLocation(item.location);
    setToLocation("");
  };
  
  const handleCompleteTransfer = () => {
    // Now perform the actual transfer when they click the Complete Transfer button
    if (transferData) {
      onTransfer(item, transferData.quantity, transferData.toLocation);
    }
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
                  max={availableStock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="col-span-3"
                />
                <div className="col-span-4 text-xs text-right text-muted-foreground">
                  Available at {fromLocation}: {availableStock}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={quantity <= 0 || quantity > availableStock || !toLocation || fromLocation === toLocation}
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
          onClose={handlePackingSlipClose}
          transferData={transferData}
          onCompleteTransfer={handleCompleteTransfer}
        />
      )}
    </>
  );
};
