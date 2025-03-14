
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useInventoryFilters() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  // Update filters only once during initial load
  useEffect(() => {
    if (!initialLoadDone) {
      const newSearchFromUrl = searchParams.get("search") || "";
      
      console.log(`Setting filters from URL during initial load: 
        search: ${newSearchFromUrl}`);
      
      setSearchQuery(newSearchFromUrl);
      setInitialLoadDone(true);
    }
  }, [searchParams, initialLoadDone]);
  
  // Add a custom search handler
  const handleSetSearchQuery = useCallback((query: string) => {
    console.log(`Setting search query to: ${query}`);
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSetSearchQuery
  };
}
