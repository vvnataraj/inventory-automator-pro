
import React from "react";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/types/inventory";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReorderInventoryItemProps {
  item: InventoryItem;
  isFirst: boolean;
  isLast: boolean;
  onReorder: (itemId: string, direction: 'up' | 'down') => void;
  showLabel?: boolean;
}

export const ReorderInventoryItem: React.FC<ReorderInventoryItemProps> = ({
  item,
  isFirst,
  isLast,
  onReorder,
  showLabel = false
}) => {
  if (showLabel) {
    return (
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReorder(item.id, 'up')}
          disabled={isFirst}
          className="h-8 flex gap-1"
        >
          <ArrowUp className="h-4 w-4" />
          Move Up
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onReorder(item.id, 'down')}
          disabled={isLast}
          className="h-8 flex gap-1"
        >
          <ArrowDown className="h-4 w-4" />
          Move Down
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onReorder(item.id, 'up')}
              disabled={isFirst}
              className="h-8 w-8"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Move up</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onReorder(item.id, 'down')}
              disabled={isLast}
              className="h-8 w-8"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Move down</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
