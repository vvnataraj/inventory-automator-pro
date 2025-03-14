
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { InventoryItem } from "@/types/inventory";
import { logInventoryActivity } from "@/utils/logging";

interface DeleteInventoryItemProps {
  item: InventoryItem;
  onDelete: (itemId: string) => void;
  showLabel?: boolean;
}

export const DeleteInventoryItem: React.FC<DeleteInventoryItemProps> = ({ 
  item, 
  onDelete,
  showLabel = false
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDelete = async () => {
    try {
      // Log the delete attempt before actually deleting
      await logInventoryActivity('delete_item_initiated', item.id, item.name, {
        sku: item.sku,
        category: item.category,
        stock: item.stock
      });
      
      // Call the parent component's delete handler
      onDelete(item.id);
      
      setIsOpen(false);
    } catch (error) {
      console.error("Error while deleting item:", error);
      // The actual delete may have succeeded, but logging failed
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {showLabel ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 flex gap-1 text-red-500 hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{item.name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
