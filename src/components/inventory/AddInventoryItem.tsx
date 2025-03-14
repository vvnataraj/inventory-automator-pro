
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InventoryItem } from "@/types/inventory";
import { InventoryItemForm, InventoryItemFormData } from "./form/InventoryItemForm";
import { generateInventoryItem } from "@/utils/inventoryItemGenerator";
import { useUserRoles } from "@/hooks/useUserRoles";
import { logInventoryActivity } from "@/utils/logging";

interface AddInventoryItemProps {
  onAdd: (newItem: InventoryItem) => void;
}

export const AddInventoryItem = ({ onAdd }: AddInventoryItemProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isManager } = useUserRoles();
  const [formData, setFormData] = React.useState<InventoryItemFormData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem = generateInventoryItem(formData);
    
    // Log the item creation
    await logInventoryActivity('add_item_initiated', newItem.id, newItem.name, {
      sku: newItem.sku,
      category: newItem.category,
      stock: newItem.stock,
      cost: newItem.cost,
      rrp: newItem.rrp
    });
    
    onAdd(newItem);
    setIsOpen(false);
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

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      location: value
    }));
  };

  if (!isManager()) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Fill in the details for the new inventory item.
          </DialogDescription>
        </DialogHeader>
        <InventoryItemForm 
          formData={formData}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onLocationChange={handleLocationChange}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
