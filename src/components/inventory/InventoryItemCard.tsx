
import React, { useState } from "react";
import { InventoryItem } from "@/types/inventory";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditInventoryItem } from "./EditInventoryItem";
import { TransferInventoryItem } from "./TransferInventoryItem";
import { DeleteInventoryItem } from "./DeleteInventoryItem";
import { ReorderInventoryItem } from "./ReorderInventoryItem";
import { ReorderDialog } from "./ReorderDialog";
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

interface InventoryItemCardProps {
  item: InventoryItem;
  onSave: (updatedItem: InventoryItem) => void;
  onTransfer: (item: InventoryItem, quantity: number, newLocation: string) => void;
  onDelete: (itemId: string) => void;
  onReorder?: (itemId: string, direction: 'up' | 'down') => void;
  onReorderStock?: (item: InventoryItem, quantity: number) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ 
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
  
  return (
    <Card className={`h-full flex flex-col transition-all hover:shadow-md ${!item.isActive ? 'opacity-60' : ''}`}>
      <div className="relative pt-[100%] overflow-hidden bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/20">
              <span className="text-muted-foreground">{item.category}</span>
            </div>
          )}
        </div>
        <Badge 
          className={`absolute top-2 right-2 ${
            item.stock <= item.lowStockThreshold
              ? "bg-red-500"
              : item.stock <= item.lowStockThreshold * 2
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        >
          {item.stock}
        </Badge>
        {!item.isActive && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            Discontinued
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-0">
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-semibold text-base break-words">{item.name}</h3>
          <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">RRP</p>
            <p className="font-medium">${item.rrp ? item.rrp.toFixed(2) : "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Cost</p>
            <p className="font-medium">${item.cost.toFixed(2)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium">{item.location}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex gap-2 flex-wrap">
        {!isReadOnly() && (
          <>
            {onReorder && (
              <ReorderInventoryItem
                item={item}
                isFirst={isFirst}
                isLast={isLast}
                onReorder={onReorder}
              />
            )}
            {onReorderStock && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => setReorderDialogOpen(true)}
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={item.isActive ? "outline" : "ghost"} 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDiscontinueDialogOpen(true)}
                  >
                    <CircleSlash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.isActive ? "Discontinue" : "Reactivate"} item</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <EditInventoryItem item={item} onSave={onSave} />
            <TransferInventoryItem item={item} onTransfer={onTransfer} />
            <DeleteInventoryItem item={item} onDelete={onDelete} />
          </>
        )}
      </CardFooter>
      
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
    </Card>
  );
}
