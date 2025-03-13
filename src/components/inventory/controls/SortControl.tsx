
import React from "react";
import { ArrowUpDown, ArrowUpAZ, ArrowDownAz } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortField, SortDirection } from "@/types/inventory";

interface SortControlProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
}

export const SortControl: React.FC<SortControlProps> = ({
  sortField,
  sortDirection,
  onSort,
  onSortDirectionChange,
}) => {
  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    
    if (field === 'name' || field === 'category' || field === 'sku' || field === 'location') {
      return sortDirection === 'asc' ? <ArrowUpAZ className="h-4 w-4 ml-1" /> : <ArrowDownAz className="h-4 w-4 ml-1" />;
    } else {
      return sortDirection === 'asc' ? 
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1"><path d="M3 8L7 4M7 4L11 8M7 4V20"/><path d="M14 17L17 20M17 20L20 17M17 20V4"/></svg> : 
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1"><path d="M3 16L7 20M7 20L11 16M7 20V4"/><path d="M14 8L17 4M17 4L20 8M17 4V20"/></svg>;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Sort {getSortIcon(sortField)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onSort('name')}>
            Name {getSortIcon('name')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort('sku')}>
            SKU {getSortIcon('sku')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort('category')}>
            Category {getSortIcon('category')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort('cost')}>
            Cost {getSortIcon('cost')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort('rrp')}>
            RRP {getSortIcon('rrp')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort('stock')}>
            Stock {getSortIcon('stock')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort('location')}>
            Location {getSortIcon('location')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onSortDirectionChange('asc')}>
            Ascending {sortDirection === 'asc' && <ArrowUpAZ className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortDirectionChange('desc')}>
            Descending {sortDirection === 'desc' && <ArrowDownAz className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
