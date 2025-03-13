
import React from "react";
import { InventoryItem } from "@/types/inventory";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { InventoryItemImage } from "./card/InventoryItemImage";
import { InventoryItemDetails } from "./card/InventoryItemDetails";
import { InventoryItemActions } from "./card/InventoryItemActions";

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
  return (
    <Card className={`h-full flex flex-col transition-all hover:shadow-md ${!item.isActive ? 'opacity-60' : ''}`}>
      <InventoryItemImage item={item} />
      
      <CardHeader className="pb-0">
        <InventoryItemDetails item={item} />
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        {/* This space intentionally left empty for flex layout purposes */}
      </CardContent>
      
      <CardFooter className="pt-0 flex gap-2 flex-wrap">
        <InventoryItemActions 
          item={item}
          onSave={onSave}
          onTransfer={onTransfer}
          onDelete={onDelete}
          onReorder={onReorder}
          onReorderStock={onReorderStock}
          isFirst={isFirst}
          isLast={isLast}
        />
      </CardFooter>
    </Card>
  );
}
