
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown, Grid, Table, ArrowUpAZ, ArrowDownAz, X } from "lucide-react";
import { SortField, SortDirection } from "@/types/inventory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { inventoryItems } from "@/data/inventoryData";

interface InventoryControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
  categoryFilter?: string;
  onCategoryFilterChange?: (category: string | undefined) => void;
}

export const InventoryControls: React.FC<InventoryControlsProps> = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  sortField,
  sortDirection,
  onSort,
  onSortDirectionChange,
  categoryFilter,
  onCategoryFilterChange,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Extract unique categories from inventory items
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set<string>();
    inventoryItems.forEach(item => {
      if (item.category) {
        uniqueCategories.add(item.category);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, []);

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
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, SKU, or category..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setViewMode("grid")}
          className={viewMode === "grid" ? "bg-muted" : ""}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setViewMode("table")}
          className={viewMode === "table" ? "bg-muted" : ""}
        >
          <Table className="h-4 w-4" />
        </Button>
      </div>
      
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            {categoryFilter ? (
              <span className="flex items-center">
                Filter: {categoryFilter}
              </span>
            ) : (
              "Filter"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <h4 className="font-medium">Filter Inventory</h4>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select 
                value={categoryFilter || ""}
                onValueChange={(value) => {
                  onCategoryFilterChange?.(value === "" ? undefined : value);
                  setFilterOpen(false);
                }}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  onCategoryFilterChange?.(undefined);
                  setFilterOpen(false);
                }}
                disabled={!categoryFilter}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filter
              </Button>
              <Button 
                size="sm" 
                onClick={() => setFilterOpen(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
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
      
      {categoryFilter && (
        <div className="flex items-center ml-2">
          <Badge className="flex items-center gap-1">
            {categoryFilter}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 p-0 ml-1" 
              onClick={() => onCategoryFilterChange?.(undefined)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}
    </div>
  );
};
