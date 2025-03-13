
import React from "react";
import { AddLocationModal } from "@/components/locations/AddLocationModal";
import { LocationFormData } from "@/components/locations/AddLocationModal";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LocationsHeaderProps {
  onLocationAdded: (location: LocationFormData) => void;
  locationFilter?: string;
  onLocationFilterChange: (value: string | undefined) => void;
}

export function LocationsHeader({ 
  onLocationAdded, 
  locationFilter, 
  onLocationFilterChange 
}: LocationsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Locations</h1>
        <div className="flex gap-2">
          <AddLocationModal onLocationAdded={onLocationAdded} />
        </div>
      </div>
      
      {locationFilter && (
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">Filtered by:</div>
          <Badge 
            variant="secondary" 
            className={cn(
              "flex items-center gap-1 px-3 py-1"
            )}
          >
            <Filter className="h-3 w-3" />
            <span>Location: {locationFilter}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
              onClick={() => onLocationFilterChange(undefined)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove filter</span>
            </Button>
          </Badge>
        </div>
      )}
    </div>
  );
}
