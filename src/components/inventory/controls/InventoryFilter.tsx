
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Filter } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { availableLocations } from "@/components/inventory/form/FormFields";

interface InventoryFilterProps {
  categoryFilter: string | undefined;
  onCategoryFilterChange: (category: string | undefined) => void;
  locationFilter: string | undefined;
  onLocationFilterChange: (location: string | undefined) => void;
}

export const InventoryFilter: React.FC<InventoryFilterProps> = ({
  categoryFilter,
  onCategoryFilterChange,
  locationFilter,
  onLocationFilterChange,
}) => {
  const [open, setOpen] = useState(false);
  
  // Common categories in hardware inventory
  const categories = [
    "Tools",
    "Hardware",
    "Fasteners",
    "Electrical",
    "Plumbing",
    "Paint",
    "Garden",
    "Storage",
    "Building Materials"
  ];

  const handleCategorySelect = (value: string) => {
    if (value === "all") {
      onCategoryFilterChange(undefined);
    } else {
      onCategoryFilterChange(value);
    }
  };

  const handleLocationSelect = (value: string) => {
    if (value === "all") {
      onLocationFilterChange(undefined);
    } else {
      onLocationFilterChange(value);
    }
  };

  const activeFiltersCount = [
    categoryFilter !== undefined,
    locationFilter !== undefined
  ].filter(Boolean).length;

  // Function to reset all filters
  const resetAllFilters = () => {
    onCategoryFilterChange(undefined);
    onLocationFilterChange(undefined);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex gap-2 w-full md:w-auto justify-between"
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 rounded-full px-1">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search filters..." />
          <CommandList>
            <CommandEmpty>No filters found.</CommandEmpty>

            <CommandGroup heading="Category">
              <CommandItem 
                onSelect={() => handleCategorySelect("all")}
                className="flex items-center gap-2"
              >
                <div className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-sm border",
                  !categoryFilter ? "bg-primary border-primary" : "opacity-50 border-input"
                )}>
                  {!categoryFilter && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                <span>All Categories</span>
              </CommandItem>
              
              {categories.map((category) => (
                <CommandItem 
                  key={category} 
                  onSelect={() => handleCategorySelect(category)}
                  className="flex items-center gap-2"
                >
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm border",
                    categoryFilter === category ? "bg-primary border-primary" : "opacity-50 border-input"
                  )}>
                    {categoryFilter === category && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <span>{category}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <Separator className="my-1" />

            <CommandGroup heading="Location">
              <CommandItem 
                onSelect={() => handleLocationSelect("all")}
                className="flex items-center gap-2"
              >
                <div className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-sm border",
                  !locationFilter ? "bg-primary border-primary" : "opacity-50 border-input"
                )}>
                  {!locationFilter && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                <span>All Locations</span>
              </CommandItem>
              
              {availableLocations.map((location) => (
                <CommandItem 
                  key={location} 
                  onSelect={() => handleLocationSelect(location)}
                  className="flex items-center gap-2"
                >
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm border",
                    locationFilter === location ? "bg-primary border-primary" : "opacity-50 border-input"
                  )}>
                    {locationFilter === location && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <span>{location}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          <div className="flex items-center justify-between p-2 border-t">
            <div className="text-sm text-muted-foreground">
              {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetAllFilters}
              disabled={activeFiltersCount === 0}
            >
              Reset all
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
