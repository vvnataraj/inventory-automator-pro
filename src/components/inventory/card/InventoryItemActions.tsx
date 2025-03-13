
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/types/inventory";
import { EditInventoryItem } from "../EditInventoryItem";
import { TransferInventoryItem } from "../TransferInventoryItem";
import { DeleteInventoryItem } from "../DeleteInventoryItem";
import { ReorderInventoryItem } from "../ReorderInventoryItem";
import { ShoppingCart, CircleSlash } from "lucide-react";
import { useUserRoles } from "@/hooks/useUserRoles";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { ReorderDialog } from "../ReorderDialog";

interface InventoryItemActionsProps {
  item: InventoryItem;
  onSave: (updatedItem: InventoryItem) => void;
  onTransfer: (item: InventoryItem, quantity: number, newLocation: string) => void;
  onDelete: (itemId: string) => void;
  onReorder?: (itemId: string, direction: 'up' | 'down') => void;
  onReorderStock?: (item: InventoryItem, quantity: number) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const InventoryItemActions: React.FC<InventoryItemActionsProps> = ({
  item,
  onSave,
  onTransfer,
  onDelete,
  onReorder,
  onReorderStock,
  isFirst = false,
  isLast = false
}) => {
  const { isReadOnly } = useUserRoles();
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [discontinueDialogOpen, setDiscontinueDialogOpen] = useState(false);
  
  const handleReorderStock = (item: InventoryItem, quantity: number) => {
    if (onReorderStock) {
      onReorderStock(item, quantity);
    }
  };
  
  const handleDiscontinue = () => {
    const discontinuedItem = {
      ...item,
      isActive: !item.isActive,
      lastUpdated: new Date().toISOString()
    };
    onSave(discontinuedItem);
    setDiscontinueDialogOpen(false);
  };
  
  if (isReadOnly()) {
    return null;
  }
  
  return (
    <>
      {onReorder && (
        <ReorderInventoryItem
          item={item}
          isFirst={isFirst}
          isLast={isLast}
          onReorder={onReorder}
          showLabel={true}
        />
      )}
      
      {onReorderStock && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 flex gap-1" 
                onClick={() => setReorderDialogOpen(true)}
              >
                <ShoppingCart className="h-4 w-4" />
                Restock
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reorder stock</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <TransferInventoryItem item={item} onTransfer={onTransfer} showLabel={true} />
      <EditInventoryItem item={item} onSave={onSave} showLabel={true} />
      
      <Button 
        variant={item.isActive ? "outline" : "ghost"} 
        size="sm"
        className={cn(
          "h-8 flex gap-1",
          item.isActive ? "text-amber-600 hover:bg-amber-100 hover:text-amber-700" : "text-green-600 hover:bg-green-100 hover:text-green-700"
        )}
        onClick={() => setDiscontinueDialogOpen(true)}
      >
        <CircleSlash className="h-4 w-4" />
        {item.isActive ? "Discontinue" : "Reactivate"}
      </Button>
      
      <DeleteInventoryItem item={item} onDelete={onDelete} showLabel={true} />
      
      {onReorderStock && (
        <ReorderDialog
          item={item}
          open={reorderDialogOpen}
          onClose={() => setReorderDialogOpen(false)}
          onReorder={handleReorderStock}
        />
      )}
      
      <AlertDialog open={discontinueDialogOpen} onOpenChange={setDiscontinueDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {item.isActive ? "Discontinue" : "Reactivate"} Item
            </AlertDialogTitle>
            <AlertDialogDescription>
              {item.isActive 
                ? "This will mark the item as discontinued. It will remain in your inventory but won't be available for new sales."
                : "This will reactivate the discontinued item, making it available for sales again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDiscontinue}
              className={cn(
                item.isActive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
              )}
            >
              {item.isActive ? "Discontinue" : "Reactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
