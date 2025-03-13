
import React, { useState, useEffect } from "react";
import { useInventoryItems } from "@/hooks/useInventoryItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sale, SaleItem } from "@/types/sale";
import { InventoryItem } from "@/types/inventory";
import { CheckCircle } from "lucide-react";
import { InventoryItemSelector } from "./InventoryItemSelector";
import { SelectedItemsList } from "./SelectedItemsList";

interface CreateSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSale: (sale: Sale) => void;
}

export const CreateSaleModal: React.FC<CreateSaleModalProps> = ({
  isOpen,
  onClose,
  onCreateSale,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const { items: inventoryItems } = useInventoryItems(1, searchQuery);
  
  // Reset form on open/close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setCustomerName("");
      setSelectedItems([]);
    }
  }, [isOpen]);

  const handleAddItem = (item: InventoryItem) => {
    // Check if item already exists in the selection
    const existingItemIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.inventoryItemId === item.id
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].subtotal = 
        updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
      setSelectedItems(updatedItems);
    } else {
      // Add new item to the selection
      setSelectedItems([
        ...selectedItems,
        {
          inventoryItemId: item.id,
          name: item.name,
          quantity: 1,
          price: item.cost,
          subtotal: item.cost,
        },
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = newQuantity;
    updatedItems[index].subtotal = newQuantity * updatedItems[index].price;
    setSelectedItems(updatedItems);
  };

  const handleCreateSale = () => {
    if (!customerName || selectedItems.length === 0) return;

    const total = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      saleNumber: `S-${Math.floor(Math.random() * 10000)}`,
      customerName,
      items: selectedItems,
      total,
      date: new Date().toISOString(),
      status: "completed"
    };

    onCreateSale(newSale);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Sale</DialogTitle>
          <DialogDescription>
            Add items to create a new sale record
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="customer">Customer Name</Label>
            <Input
              id="customer"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>

          <InventoryItemSelector 
            inventoryItems={inventoryItems}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddItem={handleAddItem}
          />

          <SelectedItemsList 
            selectedItems={selectedItems}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateSale} 
            disabled={!customerName || selectedItems.length === 0}
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Complete Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
