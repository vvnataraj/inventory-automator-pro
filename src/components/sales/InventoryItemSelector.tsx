
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, PlusCircle } from "lucide-react";
import { InventoryItem } from "@/types/inventory";

interface InventoryItemSelectorProps {
  inventoryItems: InventoryItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddItem: (item: InventoryItem) => void;
}

export const InventoryItemSelector: React.FC<InventoryItemSelectorProps> = ({
  inventoryItems,
  searchQuery,
  onSearchChange,
  onAddItem,
}) => {
  // Create a local state to track the input value
  const [inputValue, setInputValue] = useState(searchQuery);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle input changes with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Clear the previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set up a new timer
    debounceTimerRef.current = setTimeout(() => {
      console.log("Executing inventory item search with query:", newValue);
      onSearchChange(newValue);
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
  
  // Update the local input value if the searchQuery prop changes
  useEffect(() => {
    if (searchQuery !== inputValue) {
      setInputValue(searchQuery);
    }
  }, [searchQuery]);

  return (
    <div className="grid gap-2">
      <Label>Add Items</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search inventory items..."
          className="pl-10"
          value={inputValue}
          onChange={handleSearchChange}
        />
      </div>

      {inventoryItems.length > 0 && (
        <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
          <h3 className="font-medium mb-2">Inventory Items</h3>
          <div className="grid gap-2">
            {inventoryItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-2 hover:bg-muted p-2 rounded-sm"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item.cost.toFixed(2)} - Stock: {item.stock}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAddItem(item)}
                  disabled={item.stock <= 0}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
