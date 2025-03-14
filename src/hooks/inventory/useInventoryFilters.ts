
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useInventoryFilters() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [locationFilter, setLocationFilter] = useState<string | undefined>(undefined);
  
  // Update category filter when URL param changes
  useEffect(() => {
    const newCategoryFromUrl = searchParams.get("category");
    if (newCategoryFromUrl !== null) {
      console.log(`Setting category filter from URL: ${newCategoryFromUrl}`);
      setCategoryFilter(newCategoryFromUrl);
    } else if (categoryFilter && !newCategoryFromUrl) {
      console.log("Clearing category filter since URL param is removed");
      setCategoryFilter(undefined);
    }
  }, [searchParams, categoryFilter]);
  
  // Create a wrapper for setCategoryFilter that also resets the page
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
