
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search by name, SKU, or category..."
}) => {
  // Create a local state to track the input value
  const [inputValue, setInputValue] = useState(searchQuery);
  
  // Handle input changes immediately in the local state
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Use debounce with useCallback to avoid recreating the function
  const debouncedSetSearchQuery = useCallback(() => {
    if (inputValue !== searchQuery) {
      console.log("Executing search with query:", inputValue);
      setSearchQuery(inputValue);
    }
  }, [inputValue, searchQuery, setSearchQuery]);
  
  // Set up an effect to debounce the search
  useEffect(() => {
    // Create a timeout that will execute the search after 500ms
    const timeoutId = setTimeout(() => {
      debouncedSetSearchQuery();
    }, 500);
    
    // Clear the timeout if the component unmounts or inputValue changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue, debouncedSetSearchQuery]);
  
  // Update the local input value if the searchQuery prop changes (e.g., from URL parameters)
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);
  
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10"
        value={inputValue}
        onChange={handleSearchChange}
        aria-label="Search inventory"
      />
    </div>
  );
};
