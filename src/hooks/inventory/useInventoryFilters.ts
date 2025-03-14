
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useInventoryFilters() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [locationFilter, setLocationFilter] = useState<string | undefined>(undefined);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  // Update filters only once during initial load
  useEffect(() => {
    if (!initialLoadDone) {
      const newCategoryFromUrl = searchParams.get("category");
      const newLocationFromUrl = searchParams.get("location");
      const newSearchFromUrl = searchParams.get("search") || "";
      
      console.log(`Setting filters from URL during initial load: 
        category: ${newCategoryFromUrl || 'undefined'},
        location: ${newLocationFromUrl || 'undefined'},
        search: ${newSearchFromUrl}`);
      
      if (newCategoryFromUrl !== null) {
        setCategoryFilter(newCategoryFromUrl);
      }
      
      if (newLocationFromUrl !== null) {
        setLocationFilter(newLocationFromUrl);
      }
      
      setSearchQuery(newSearchFromUrl);
      setInitialLoadDone(true);
    }
  }, [searchParams, initialLoadDone]);
  
  // Create a wrapper for setCategoryFilter that logs updates
  const handleSetCategoryFilter = useCallback((category: string | undefined) => {
    console.log(`Setting category filter to: ${category || 'undefined'}`);
    setCategoryFilter(category);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter: handleSetCategoryFilter,
    locationFilter,
    setLocationFilter
  };
}
