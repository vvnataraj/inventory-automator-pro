
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
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EditInventoryItemProps {
  item: InventoryItem;
  onSave: (updatedItem: InventoryItem) => void;
  showLabel?: boolean;
}

export const EditInventoryItem = ({ item, onSave, showLabel = false }: EditInventoryItemProps) => {
  const [formData, setFormData] = useState(item);
  const [isOpen, setIsOpen] = useState(false);
  const [locationStocks, setLocationStocks] = useState<{ location: string; count: number }[]>([]);
  const [totalStock, setTotalStock] = useState(0);

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
      })).sort((a, b) => b.count - a.count); // Sort by count descending
      
      setLocationStocks(locationStocksArray);
      
      // Calculate total stock across all locations
      const total = locationStocksArray.reduce((sum, item) => sum + item.count, 0);
      setTotalStock(total);
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

  // Calculate percentage for each location
  const getStockPercentage = (count: number) => {
    return totalStock > 0 ? (count / totalStock) * 100 : 0;
  };

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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Make changes to the inventory item here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {locationStocks.length > 1 && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-2">Stock Distribution by Location</h4>
            <Card className="p-4">
              <div className="text-sm font-medium flex justify-between mb-2">
                <span>Total Stock: {totalStock} units</span>
              </div>
              <div className="space-y-3">
                {locationStocks.map((locationStock, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{locationStock.location}</span>
                      <span>{locationStock.count} units ({getStockPercentage(locationStock.count).toFixed(1)}%)</span>
                    </div>
                    <Progress value={getStockPercentage(locationStock.count)} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
            <Separator className="my-4" />
          </div>
        )}

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
