
import React from "react";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle } from "lucide-react";
import { SaleItem } from "@/types/sale";

interface SelectedItemsListProps {
  selectedItems: SaleItem[];
  onQuantityChange: (index: number, newQuantity: number) => void;
  onRemoveItem: (index: number) => void;
}

export const SelectedItemsList: React.FC<SelectedItemsListProps> = ({
  selectedItems,
  onQuantityChange,
  onRemoveItem,
}) => {
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);

  if (selectedItems.length === 0) {
    return null;
  }

  return (
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
                onClick={() => onQuantityChange(index, item.quantity - 1)}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <span>{item.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onQuantityChange(index, item.quantity + 1)}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveItem(index)}
              >
                <MinusCircle className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
        <div className="flex justify-between pt-2 font-bold">
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
