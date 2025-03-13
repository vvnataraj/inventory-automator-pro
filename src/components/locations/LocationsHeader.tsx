
import React from "react";
import { AddLocationModal } from "@/components/locations/AddLocationModal";
import { LocationFormData } from "@/components/locations/AddLocationModal";

interface LocationsHeaderProps {
  onLocationAdded: (location: LocationFormData) => void;
}

export function LocationsHeader({ onLocationAdded }: LocationsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-semibold tracking-tight">Locations</h1>
      <div className="flex gap-2">
        <AddLocationModal onLocationAdded={onLocationAdded} />
      </div>
    </div>
  );
}
