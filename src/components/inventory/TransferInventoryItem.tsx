
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
import { InventoryItem } from "@/types/inventory";

interface TransferInventoryItemProps {
  item: InventoryItem;
  onTransfer: (item: InventoryItem, quantity: number, newLocation: string) => void;
}

// Available locations for transfer
const locations = ["Main Floor", "Warehouse A", "Warehouse B", "Outdoor Storage", "Mezzanine"];

export const TransferInventoryItem = ({ item, onTransfer }: TransferInventoryItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [newLocation, setNewLocation] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity > 0 && quantity <= item.stock && newLocation && newLocation !== item.location) {
      onTransfer(item, quantity, newLocation);
      setIsOpen(false);
      // Reset form
      setQuantity(1);
      setNewLocation("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Transfer Item">
          <ArrowRightLeft className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Inventory</DialogTitle>
          <DialogDescription>
            Move {item.name} to another location. Current location: {item.location}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">To Location</Label>
              <div className="col-span-3">
                <Select
                  value={newLocation}
                  onValueChange={setNewLocation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations
                      .filter(loc => loc !== item.location)
                      .map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={quantity <= 0 || quantity > item.stock || !newLocation || newLocation === item.location}
            >
              Transfer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
