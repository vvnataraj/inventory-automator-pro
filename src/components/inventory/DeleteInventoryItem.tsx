
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

interface DeleteInventoryItemProps {
  item: InventoryItem;
  onDelete: (itemId: string) => void;
}

export const DeleteInventoryItem: React.FC<DeleteInventoryItemProps> = ({ 
  item, 
  onDelete 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDelete = () => {
    onDelete(item.id);
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 hover:text-red-600">
          <Trash2 className="h-4 w-4" />
        </Button>
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
