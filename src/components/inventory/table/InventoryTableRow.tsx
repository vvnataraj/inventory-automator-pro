
import React from "react";
import { InventoryItem } from "@/types/inventory";
import { EditInventoryItem } from "../EditInventoryItem";
import { TransferInventoryItem } from "../TransferInventoryItem";
import { DeleteInventoryItem } from "../DeleteInventoryItem";
import { ReorderInventoryItem } from "../ReorderInventoryItem";
import { ShoppingCart, CircleSlash, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface InventoryTableRowProps {
  item: InventoryItem;
  index: number;
  totalItems: number;
  onSaveItem: (updatedItem: InventoryItem) => void;
  onTransferItem: (item: InventoryItem, quantity: number, newLocation: string) => void;
  onDeleteItem: (itemId: string) => void;
  onReorderItem: (itemId: string, direction: 'up' | 'down') => void;
  onOpenReorderDialog: (item: InventoryItem) => void;
  onDiscontinueClick: (item: InventoryItem) => void;
}

export const InventoryTableRow: React.FC<InventoryTableRowProps> = ({
  item,
  index,
  totalItems,
  onSaveItem,
  onTransferItem,
  onDeleteItem,
  onReorderItem,
  onOpenReorderDialog,
  onDiscontinueClick,
}) => {
  return (
    <tr className={`border-b hover:bg-muted/50 ${!item.isActive ? 'opacity-60' : ''}`}>
      <td className="py-3 px-4">
        <Avatar className="h-10 w-10">
          {item.imageUrl ? (
            <AvatarImage src={item.imageUrl} alt={item.name} />
          ) : null}
          <AvatarFallback className="bg-secondary/20">
            {item.imageUrl ? <ImageOff className="h-4 w-4" /> : item.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </td>
      <td className="py-3 px-4">{item.sku}</td>
      <td className="py-3 px-4 font-medium break-words max-w-[200px]">{item.name}</td>
      <td className="py-3 px-4">{item.category}</td>
      <td className="py-3 px-4">${item.cost.toFixed(2)}</td>
      <td className="py-3 px-4">${item.rrp ? item.rrp.toFixed(2) : "-"}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.stock <= item.lowStockThreshold
            ? "bg-red-100 text-red-800"
            : item.stock <= item.lowStockThreshold * 2
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800"
        }`}>
          {item.stock}
        </span>
      </td>
      <td className="py-3 px-4">
        {item.isActive ? (
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            Active
          </span>
        ) : (
          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
            Discontinued
          </span>
        )}
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => onOpenReorderDialog(item)}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reorder stock</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TransferInventoryItem item={item} onTransfer={onTransferItem} showLabel={false} />
          <EditInventoryItem item={item} onSave={onSaveItem} showLabel={false} />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={item.isActive ? "outline" : "ghost"} 
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    item.isActive ? "text-amber-600 hover:bg-amber-100 hover:text-amber-700" : "text-green-600 hover:bg-green-100 hover:text-green-700"
                  )}
                  onClick={() => onDiscontinueClick(item)}
                >
                  <CircleSlash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.isActive ? "Discontinue" : "Reactivate"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DeleteInventoryItem item={item} onDelete={onDeleteItem} showLabel={false} />
          
          <div className="ms-1">
            <ReorderInventoryItem 
              item={item}
              isFirst={index === 0}
              isLast={index === totalItems - 1}
              onReorder={onReorderItem}
            />
          </div>
        </div>
      </td>
    </tr>
  );
};
