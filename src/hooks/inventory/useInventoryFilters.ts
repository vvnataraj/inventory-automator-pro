
import { useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export function useInventoryFilters() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const initializedRef = useRef(false);
  
  // Initialize search query from URL params only once
  if (!initializedRef.current) {
    const searchFromUrl = searchParams.get("search") || "";
    if (searchQuery !== searchFromUrl) {
      console.log(`Setting initial search from URL: "${searchFromUrl}"`);
      setSearchQuery(searchFromUrl);
    }
    initializedRef.current = true;
  }
  
  // Custom search handler that doesn't cause resets
  const handleSetSearchQuery = useCallback((query: string) => {
    console.log(`Setting search query to: "${query}"`);
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSetSearchQuery
  };
}
