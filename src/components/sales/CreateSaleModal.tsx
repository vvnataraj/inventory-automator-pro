
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
import { CheckCircle, MinusCircle, PlusCircle, Search } from "lucide-react";

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

          <div className="grid gap-2">
            <Label>Add Items</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory items..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {inventoryItems.length > 0 && (
            <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
              <h3 className="font-medium mb-2">Inventory Items</h3>
              <div className="grid gap-2">
                {inventoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-2 hover:bg-muted p-2 rounded-sm"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.cost.toFixed(2)} - Stock: {item.stock}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAddItem(item)}
                      disabled={item.stock <= 0}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedItems.length > 0 && (
            <div className="border rounded-md p-2">
              <h3 className="font-medium mb-2">Selected Items</h3>
              <div className="grid gap-2">
                {selectedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} x {item.quantity} = ${item.subtotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(index, item.quantity - 1)}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(index, item.quantity + 1)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <MinusCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-2 font-bold">
                  <span>Total:</span>
                  <span>
                    ${selectedItems
                      .reduce((sum, item) => sum + item.subtotal, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
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
