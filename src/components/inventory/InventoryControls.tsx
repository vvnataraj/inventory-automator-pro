
import React from "react";
import { SortField, SortDirection } from "@/types/inventory";
import { SearchInput } from "./controls/SearchInput";
import { ViewModeToggle } from "./controls/ViewModeToggle";
import { CategoryFilter } from "./controls/CategoryFilter";
import { SortControl } from "./controls/SortControl";

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
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <SearchInput 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      <ViewModeToggle 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
      />
      
      <CategoryFilter 
        categoryFilter={categoryFilter} 
        onCategoryFilterChange={onCategoryFilterChange}
      />
      
      <SortControl 
        sortField={sortField} 
        sortDirection={sortDirection} 
        onSort={onSort} 
        onSortDirectionChange={onSortDirectionChange}
      />
    </div>
  );
};
