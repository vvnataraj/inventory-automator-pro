
import { useState, useCallback, useMemo, useEffect } from "react";
import { locationsData } from "@/data/inventoryData";
import { LocationFormData } from "@/components/locations/AddLocationModal";
import { availableLocations } from "@/components/inventory/form/FormFields";

interface Location {
  id: string;
  name: string;
  type: string;
  itemCount: number;
  totalUnits: number;
  stockValue: number;
  spaceUtilization: number;
  address?: string;
}

export function useLocations() {
  // Initialize locations with the data
  const [locations, setLocations] = useState<Location[]>(
    locationsData.map(location => ({
      ...location
    }))
  );
  const [isLoading, setIsLoading] = useState(false);

  // On mount, ensure all available locations from inventory are represented
  useEffect(() => {
    const existingLocationNames = new Set(locations.map(loc => loc.name));
    
    // Add any missing locations from the availableLocations list
    const locationsToAdd: Location[] = [];
    
    availableLocations.forEach(name => {
      if (!existingLocationNames.has(name)) {
        locationsToAdd.push({
          id: `location-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name,
          type: "Warehouse",
          itemCount: 0,
          totalUnits: 0,
          stockValue: 0,
          spaceUtilization: 50, // Default value
        });
      }
    });
    
    if (locationsToAdd.length > 0) {
      setLocations(prev => [...prev, ...locationsToAdd]);
    }
  }, []);

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
              spaceUtilization: locationData.spaceUtilization,
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
