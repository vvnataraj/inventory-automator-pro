
import React from "react";
import { Search, Filter, ArrowUpDown, Grid, Table, List, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
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

export type SortDirection = "asc" | "desc";
export type ViewMode = "grid" | "table" | "card" | "collapsible";

interface SortOption {
  field: string;
  label: string;
}

interface ListControlsProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  availableViewModes?: ViewMode[];
  sortField?: string;
  sortDirection?: SortDirection;
  onSortChange?: (field: string) => void;
  onSortDirectionChange?: (direction: SortDirection) => void;
  sortOptions?: SortOption[];
  onFilterClick?: () => void;
  showFilter?: boolean;
  className?: string;
}

export const ListControls: React.FC<ListControlsProps> = ({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  viewMode,
  onViewModeChange,
  availableViewModes = ["grid", "table"],
  sortField,
  sortDirection = "asc",
  onSortChange,
  onSortDirectionChange,
  sortOptions = [],
  onFilterClick,
  showFilter = true,
  className = "",
}) => {
  const getViewModeIcon = (mode: ViewMode) => {
    switch (mode) {
      case "grid":
        return <Grid className="h-4 w-4" />;
      case "table":
        return <Table className="h-4 w-4" />;
      case "card":
        return <Grid className="h-4 w-4" />;
      case "collapsible":
        return <List className="h-4 w-4" />;
      default:
        return <Grid className="h-4 w-4" />;
    }
  };

  const getViewModeLabel = (mode: ViewMode) => {
    switch (mode) {
      case "grid":
        return "Grid View";
      case "table":
        return "Table View";
      case "card":
        return "Card View";
      case "collapsible":
        return "Collapsible View";
      default:
        return "Grid View";
    }
  };

  return (
    <div className={`flex flex-col md:flex-row gap-4 mb-6 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-10"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {onViewModeChange && availableViewModes.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {viewMode && getViewModeIcon(viewMode)}
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Layout</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableViewModes.map((mode) => (
              <DropdownMenuItem 
                key={mode} 
                onClick={() => onViewModeChange(mode)}
              >
                {getViewModeIcon(mode)}
                <span className="ml-2">{getViewModeLabel(mode)}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {showFilter && (
        <Button variant="outline" className="gap-2" onClick={onFilterClick}>
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      )}
      
      {sortOptions.length > 0 && onSortChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {sortOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.field} 
                  onClick={() => onSortChange(option.field)}
                >
                  {option.label}
                  {sortField === option.field && (
                    sortDirection === 'asc' ? 
                      <ChevronUp className="h-4 w-4 ml-auto" /> : 
                      <ChevronDown className="h-4 w-4 ml-auto" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            
            {onSortDirectionChange && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => onSortDirectionChange('asc')}>
                    Ascending
                    {sortDirection === 'asc' && <ChevronUp className="h-4 w-4 ml-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSortDirectionChange('desc')}>
                    Descending
                    {sortDirection === 'desc' && <ChevronDown className="h-4 w-4 ml-auto" />}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
