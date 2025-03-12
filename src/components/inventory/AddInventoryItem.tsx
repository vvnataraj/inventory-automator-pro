
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
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
import { faker } from "@faker-js/faker";

interface AddInventoryItemProps {
  onAdd: (newItem: InventoryItem) => void;
}

export const AddInventoryItem = ({ onAdd }: AddInventoryItemProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    sku: "",
    category: "",
    cost: 0,
    rrp: 0,
    stock: 0,
    location: "",
    minStockCount: 5,
    lowStockThreshold: 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new item with the form data and generate the rest
    const newItem: InventoryItem = {
      id: `item-${Date.now()}`,
      sku: formData.sku || faker.string.alphanumeric(8).toUpperCase(),
      name: formData.name,
      description: faker.commerce.productDescription(),
      category: formData.category || faker.commerce.department(),
      subcategory: faker.commerce.productAdjective(),
      brand: faker.company.name(),
      price: parseFloat(faker.commerce.price({ min: 50, max: 200 })),
      rrp: formData.rrp,
      cost: formData.cost,
      stock: formData.stock,
      lowStockThreshold: formData.lowStockThreshold,
      minStockCount: formData.minStockCount,
      location: formData.location,
      barcode: faker.string.numeric(13),
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      imageUrl: faker.image.url(),
      dimensions: {
        length: parseFloat(faker.number.float({ min: 1, max: 100 }).toFixed(2)),
        width: parseFloat(faker.number.float({ min: 1, max: 100 }).toFixed(2)),
        height: parseFloat(faker.number.float({ min: 1, max: 100 }).toFixed(2)),
        unit: 'cm'
      },
      weight: {
        value: parseFloat(faker.number.float({ min: 0.1, max: 50 }).toFixed(2)),
        unit: 'kg'
      },
      isActive: true,
      supplier: faker.company.name(),
      tags: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => faker.commerce.productAdjective())
    };
    
    onAdd(newItem);
    setIsOpen(false);
    // Reset form
    setFormData({
      name: "",
      sku: "",
      category: "",
      cost: 0,
      rrp: 0,
      stock: 0,
      location: "",
      minStockCount: 5,
      lowStockThreshold: 10,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'cost' || name === 'rrp' || name === 'minStockCount' || name === 'lowStockThreshold' 
        ? Number(value) 
        : value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Fill in the details for the new inventory item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">SKU</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Auto-generated if empty"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Auto-generated if empty"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">Cost Price *</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                className="col-span-3"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rrp" className="text-right">RRP</Label>
              <Input
                id="rrp"
                name="rrp"
                type="number"
                value={formData.rrp}
                onChange={handleChange}
                className="col-span-3"
                min="0"
                step="0.01"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">Initial Stock *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                className="col-span-3"
                required
                min="0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lowStockThreshold" className="text-right">Low Stock Alert</Label>
              <Input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                className="col-span-3"
                min="0"
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
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
