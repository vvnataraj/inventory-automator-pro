
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
        setCategoryFilter(newCategoryFromUrl === "undefined" ? undefined : newCategoryFromUrl);
      }
      
      if (newLocationFromUrl !== null) {
        setLocationFilter(newLocationFromUrl === "undefined" ? undefined : newLocationFromUrl);
      }
      
      setSearchQuery(newSearchFromUrl);
      setInitialLoadDone(true);
    }
  }, [searchParams, initialLoadDone]);
  
  // Create a wrapper for setCategoryFilter that logs updates and handles undefined properly
  const handleSetCategoryFilter = useCallback((category: string | undefined) => {
    console.log(`Setting category filter to: ${category || 'undefined'}`);
    setCategoryFilter(category === "undefined" ? undefined : category);
  }, []);

  // Create a wrapper for setLocationFilter to ensure proper handling of undefined
  const handleSetLocationFilter = useCallback((location: string | undefined) => {
    console.log(`Setting location filter to: ${location || 'undefined'}`);
    setLocationFilter(location === "undefined" ? undefined : location);
  }, []);

  // Add a custom search handler
  const handleSetSearchQuery = useCallback((query: string) => {
    console.log(`Setting search query to: ${query}`);
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    categoryFilter,
    setCategoryFilter: handleSetCategoryFilter,
    locationFilter,
    setLocationFilter: handleSetLocationFilter
  };
}
