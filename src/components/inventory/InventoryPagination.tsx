
import React from "react";
import { Button } from "@/components/ui/button";

interface InventoryPaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const InventoryPagination: React.FC<InventoryPaginationProps> = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
        <span className="font-medium">{totalItems}</span> items
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
