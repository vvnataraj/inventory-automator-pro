
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { InventoryItem } from "@/types/inventory";
import { inventoryItems } from "@/data/inventoryData";
import { Separator } from "@/components/ui/separator";

interface EditInventoryItemProps {
  item: InventoryItem;
  onSave: (updatedItem: InventoryItem) => void;
  showLabel?: boolean;
}

export const EditInventoryItem = ({ item, onSave, showLabel = false }: EditInventoryItemProps) => {
  const [formData, setFormData] = useState(item);
  const [isOpen, setIsOpen] = useState(false);
  const [locationStocks, setLocationStocks] = useState<{ location: string; count: number }[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Find all items with the same SKU across different locations
      const sameSkuItems = inventoryItems.filter(
        (inventoryItem) => inventoryItem.sku === item.sku
      );
      
      // Group by location and sum the stock
      const stockByLocation = sameSkuItems.reduce<{ [key: string]: number }>((acc, curr) => {
        if (!acc[curr.location]) {
          acc[curr.location] = 0;
        }
        acc[curr.location] += curr.stock;
        return acc;
      }, {});
      
      // Convert to array for rendering
      const locationStocksArray = Object.entries(stockByLocation).map(([location, count]) => ({
        location,
        count,
      }));
      
      setLocationStocks(locationStocksArray);
    }
  }, [isOpen, item.sku]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'cost' || name === 'rrp' || name === 'minStockCount' ? Number(value) : value
    }));
  };

  // Calculate total stock across all locations
  const totalStock = locationStocks.reduce((sum, item) => sum + item.count, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size={showLabel ? "sm" : "icon"}
          className={showLabel ? "h-8 flex gap-1" : ""}
        >
          <Pencil className="h-4 w-4" />
          {showLabel && "Edit"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Make changes to the inventory item here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">Cost Price</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rrp" className="text-right">RRP</Label>
              <Input
                id="rrp"
                name="rrp"
                type="number"
                value={formData.rrp || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minStockCount" className="text-right">Min Stock</Label>
              <Input
                id="minStockCount"
                name="minStockCount"
                type="number"
                value={formData.minStockCount}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            {locationStocks.length > 1 && (
              <div className="col-span-4 mt-4">
                <Separator className="my-2" />
                <h4 className="font-medium text-sm mb-2">Stock by Location</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto rounded-md border p-2">
                  {locationStocks.map((locationStock, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{locationStock.location}</span>
                      <span className="font-semibold">{locationStock.count} units</span>
                    </div>
                  ))}
                  <Separator className="my-1" />
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total</span>
                    <span>{totalStock} units</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
