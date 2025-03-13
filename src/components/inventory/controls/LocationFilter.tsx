
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locations } from "@/data/inventoryData";

interface LocationFilterProps {
  locationFilter: string | undefined;
  onLocationFilterChange: (location: string | undefined) => void;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  locationFilter,
  onLocationFilterChange,
}) => {
  const [locationOptions, setLocationOptions] = useState<string[]>([]);

  useEffect(() => {
    // Use the locations from the data file
    setLocationOptions(locations);
  }, []);

  const handleLocationChange = (value: string) => {
    if (value === "all") {
      onLocationFilterChange(undefined);
    } else {
      onLocationFilterChange(value);
    }
  };

  return (
    <div className="w-full md:w-[200px]">
      <Select
        value={locationFilter || "all"}
        onValueChange={handleLocationChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {locationOptions.map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
