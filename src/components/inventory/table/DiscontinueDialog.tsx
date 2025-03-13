
import React from "react";
import { InventoryItem } from "@/types/inventory";
import { cn } from "@/lib/utils";
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

interface DiscontinueDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const DiscontinueDialog: React.FC<DiscontinueDialogProps> = ({
  item,
  open,
  onOpenChange,
  onConfirm,
}) => {
  if (!item) return null;
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
            onClick={onConfirm}
            className={cn(
              item.isActive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
            )}
          >
            {item.isActive ? "Discontinue" : "Reactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
