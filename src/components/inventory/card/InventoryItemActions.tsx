
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/types/inventory";
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
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1">
          {onReorder && (
            <ReorderInventoryItem
              item={item}
              isFirst={isFirst}
              isLast={isLast}
              onReorder={onReorder}
              showLabel={false}
            />
          )}
        </div>
        
        <div className="flex gap-1">
          {onReorderStock && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2" 
                    onClick={() => setReorderDialogOpen(true)}
                    tabIndex={0}
                    role="button"
                    aria-label="Reorder stock"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reorder stock</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <TransferInventoryItem item={item} onTransfer={onTransfer} showLabel={false} />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={item.isActive ? "outline" : "ghost"} 
                  size="icon"
                  className={cn(
                    "h-8 w-8 cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    item.isActive ? "text-amber-600 hover:bg-amber-100 hover:text-amber-700" : "text-green-600 hover:bg-green-100 hover:text-green-700"
                  )}
                  onClick={() => setDiscontinueDialogOpen(true)}
                  tabIndex={0}
                  role="button"
                  aria-label={item.isActive ? "Discontinue item" : "Reactivate item"}
                >
                  <CircleSlash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.isActive ? "Discontinue" : "Reactivate"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DeleteInventoryItem item={item} onDelete={onDelete} showLabel={false} />
        </div>
      </div>
      
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
            <AlertDialogCancel className="focus:ring-2 focus:ring-ring focus:ring-offset-2">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDiscontinue}
              className={cn(
                "focus:ring-2 focus:ring-ring focus:ring-offset-2",
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
