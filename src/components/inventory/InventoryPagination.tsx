
import React from "react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis
} from "@/components/ui/pagination";
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

  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show
    
    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than our maximum, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate which pages to show around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - maxVisiblePages + 2);
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('ellipsis-start');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis-end');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Ensure page change actually triggers data refresh
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      console.log(`Changing to page ${page}`);
      onPageChange(page);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{" "}
        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
        <span className="font-medium">{totalItems}</span> items
      </div>
      
      {totalItems > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(currentPage - 1)}
                className={`cursor-pointer ${currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-accent"}`}
                tabIndex={currentPage === 1 ? -1 : 0}
              />
            </PaginationItem>
            
            {pageNumbers.map((page, index) => {
              if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                return (
                  <PaginationItem key={`${page}-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              
              const pageNum = page as number;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={currentPage === pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className="cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(currentPage + 1)}
                className={`cursor-pointer ${currentPage === totalPages ? "pointer-events-none opacity-50" : "hover:bg-accent"}`}
                tabIndex={currentPage === totalPages ? -1 : 0}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
