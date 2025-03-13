
import React from "react";
import { Building2 } from "lucide-react";

interface EmptyLocationsStateProps {
  searchQuery: string;
}

export function EmptyLocationsState({ searchQuery }: EmptyLocationsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium">No locations found</h3>
      <p className="text-muted-foreground mt-2">
        {searchQuery ? "Try a different search term" : "Add your first location to get started"}
      </p>
    </div>
  );
}
