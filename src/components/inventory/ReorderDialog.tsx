
import { useState } from "react";
import { InventoryItem } from "@/types/inventory";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReorderDialogProps {
  item: InventoryItem;
  open: boolean;
  onClose: () => void;
  onReorder: (item: InventoryItem, quantity: number) => void;
}

export const ReorderDialog: React.FC<ReorderDialogProps> = ({
  item,
  open,
  onClose,
  onReorder,
}) => {
  const [quantity, setQuantity] = useState(item.minStockCount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReorder(item, quantity);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Reorder Stock</DialogTitle>
            <DialogDescription>
              Place a new order for {item.name} from {item.supplier}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>
              <Input
                id="supplier"
                value={item.supplier}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-stock" className="text-right">
                Current Stock
              </Label>
              <Input
                id="current-stock"
                value={item.stock}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Place Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
