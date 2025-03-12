
import React from "react";
import { Button } from "@/components/ui/button";

interface SalesPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const SalesPagination: React.FC<SalesPaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
        <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> of{" "}
        <span className="font-medium">{totalItems}</span> sales
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, Math.ceil(totalItems / pageSize)))}
          disabled={currentPage === Math.ceil(totalItems / pageSize)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
