
import React, { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface CategoryFilterProps {
  categoryFilter?: string;
  onCategoryFilterChange?: (category: string | undefined) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categoryFilter,
  onCategoryFilterChange,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || "");
  
  // Update local state when prop changes
  useEffect(() => {
    setSelectedCategory(categoryFilter || "");
  }, [categoryFilter]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .select('category')
          .not('category', 'is', null);
        
        if (error) {
          console.error("Error fetching categories:", error);
          fallbackToLocalCategories();
          return;
        }
        
        if (data && data.length > 0) {
          // Cast data to array of objects with category property
          const categoriesData = data as { category: string }[];
          const uniqueCategories = Array.from(
            new Set(categoriesData.map(item => item.category).filter(Boolean) as string[])
          ).sort();
          
          console.log("Fetched categories:", uniqueCategories);
          setCategories(uniqueCategories);
        } else {
          fallbackToLocalCategories();
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        fallbackToLocalCategories();
      }
    };
    
    const fallbackToLocalCategories = () => {
      import('@/data/inventoryData').then(({ inventoryItems }) => {
        const uniqueCategories = new Set<string>();
        inventoryItems.forEach(item => {
          if (item.category) {
            uniqueCategories.add(item.category);
          }
        });
        setCategories(Array.from(uniqueCategories).sort());
      });
    };
    
    fetchCategories();
  }, []);

  const handleCategoryChange = (value: string) => {
    console.log("Category changed to:", value);
    setSelectedCategory(value);
    onCategoryFilterChange?.(value === "" ? undefined : value);
    setFilterOpen(false);
  };

  const clearFilter = () => {
    console.log("Clearing filter");
    setSelectedCategory("");
    onCategoryFilterChange?.(undefined);
    setFilterOpen(false);
  };

  return (
    <>
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={`gap-2 ${categoryFilter ? "bg-primary/10" : ""}`}
          >
            <Filter className="h-4 w-4" />
            {categoryFilter ? (
              <span className="flex items-center">
                Filter: {categoryFilter}
              </span>
            ) : (
              "Filter"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 z-50 bg-background" align="end">
          <div className="space-y-4">
            <h4 className="font-medium">Filter Inventory</h4>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select 
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-background">
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilter}
                disabled={!categoryFilter}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filter
              </Button>
              <Button 
                size="sm" 
                onClick={() => setFilterOpen(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {categoryFilter && (
        <div className="flex items-center ml-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            {categoryFilter}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 p-0 ml-1 rounded-full" 
              onClick={() => onCategoryFilterChange?.(undefined)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}
    </>
  );
};
