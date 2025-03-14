
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { logActivity } from "@/utils/logging";

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
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle input changes immediately in the local state
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Clear the previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set up a new timer
    debounceTimerRef.current = setTimeout(() => {
      console.log("Executing search with query:", newValue);
      setSearchQuery(newValue);
      
      // Log search activity
      if (newValue.trim() !== '') {
        logActivity({
          action: 'search_inventory',
          target_type: 'inventory',
          details: {
            search_query: newValue
          }
        });
      }
    }, 500);
  };
  
  // Clear the timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  // Update the local input value if the searchQuery prop changes (e.g., from URL parameters)
  useEffect(() => {
    if (searchQuery !== inputValue) {
      setInputValue(searchQuery);
    }
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
