
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
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>(locationsData);
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
              spaceUtilization: locationData.spaceUtilization 
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
