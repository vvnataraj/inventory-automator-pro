
import React from "react";
import { SortField, SortDirection } from "@/types/inventory";
import { ViewModeToggle } from "./controls/ViewModeToggle";
import { SortControl } from "./controls/SortControl";
import { InventoryFilter } from "./controls/InventoryFilter";

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
  locationFilter?: string;
  onLocationFilterChange?: (location: string | undefined) => void;
}

export const InventoryControls: React.FC<InventoryControlsProps> = ({
  viewMode,
  setViewMode,
  sortField,
  sortDirection,
  onSort,
  onSortDirectionChange,
  categoryFilter,
  onCategoryFilterChange,
  locationFilter,
  onLocationFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex flex-wrap gap-2 ml-auto">
        {onCategoryFilterChange && onLocationFilterChange && (
          <InventoryFilter
            categoryFilter={categoryFilter}
            onCategoryFilterChange={onCategoryFilterChange}
            locationFilter={locationFilter}
            onLocationFilterChange={onLocationFilterChange}
          />
        )}
        
        <ViewModeToggle 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
        />
        
        <SortControl 
          sortField={sortField} 
          sortDirection={sortDirection} 
          onSort={onSort} 
          onSortDirectionChange={onSortDirectionChange}
        />
      </div>
    </div>
  );
};
