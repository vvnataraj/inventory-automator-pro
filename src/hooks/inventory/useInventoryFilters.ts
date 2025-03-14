
import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useInventoryFilters() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const initializedRef = useRef(false);
  const skipEffectRef = useRef(false);
  
  // Initialize search query from URL params only once
  useEffect(() => {
    if (!initializedRef.current) {
      const searchFromUrl = searchParams.get("search") || "";
      
      if (searchQuery !== searchFromUrl) {
        console.log(`Setting initial search from URL: "${searchFromUrl}"`);
        // Set skip flag to prevent double effects
        skipEffectRef.current = true;
        setSearchQuery(searchFromUrl);
      }
      initializedRef.current = true;
    }
  }, [searchParams, searchQuery]);
  
  // Custom search handler that doesn't cause resets
  const handleSetSearchQuery = useCallback((query: string) => {
    if (query === searchQuery) return; // Don't update if unchanged
    
    console.log(`Setting search query to: "${query}"`);
    skipEffectRef.current = true;
    setSearchQuery(query);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    skipNextEffect: () => skipEffectRef.current = true,
    isSkippingEffect: () => {
      const shouldSkip = skipEffectRef.current;
      if (shouldSkip) {
        skipEffectRef.current = false; // Reset after checking
      }
      return shouldSkip;
    }
  };
}
