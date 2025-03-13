
import { useState, useCallback, useMemo } from "react";
import { locationsData } from "@/data/inventoryData";
import { LocationFormData } from "@/components/locations/AddLocationModal";

interface Location {
  id: string;
  name: string;
  type: string;
  itemCount: number;
  totalUnits: number;
  stockValue: number;
  spaceUtilization: number;
  phoneNumber?: string;
}

export function useLocations() {
  // Initialize locations with the data, ensuring each has a default phone number if not provided
  const [locations, setLocations] = useState<Location[]>(
    locationsData.map(location => ({
      ...location,
      phoneNumber: "phoneNumber" in location ? location.phoneNumber : ""
    }))
  );
  const [isLoading, setIsLoading] = useState(false);

  const addLocation = useCallback((locationData: LocationFormData) => {
    const newLocation: Location = {
      id: `location-${Date.now()}`,
      name: locationData.name,
      type: locationData.type,
      itemCount: 0,
      totalUnits: 0,
      stockValue: 0,
      spaceUtilization: locationData.spaceUtilization,
      phoneNumber: locationData.phoneNumber || "",
    };
    
    setLocations(prev => [...prev, newLocation]);
    return newLocation;
  }, []);

  const updateLocation = useCallback((id: string, locationData: LocationFormData) => {
    setLocations(prev => 
      prev.map(location => 
        location.id === id 
          ? { 
              ...location, 
              name: locationData.name, 
              type: locationData.type, 
              spaceUtilization: locationData.spaceUtilization,
              phoneNumber: locationData.phoneNumber || location.phoneNumber || "", 
            } 
          : location
      )
    );
  }, []);

  const deleteLocation = useCallback((id: string) => {
    setLocations(prev => prev.filter(location => location.id !== id));
  }, []);

  return {
    locations,
    isLoading,
    addLocation,
    updateLocation,
    deleteLocation
  };
}
