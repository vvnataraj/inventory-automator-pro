
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { inventoryItems } from "@/data/inventoryData";

interface CategoryFilterProps {
  categoryFilter: string | undefined;
  onCategoryFilterChange: (category: string | undefined) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categoryFilter,
  onCategoryFilterChange,
}) => {
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique categories from inventory items
    const categories = Array.from(
      new Set(inventoryItems.map((item) => item.category))
    ).sort();
    setCategoryOptions(categories);
  }, []);

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      onCategoryFilterChange(undefined);
    } else {
      onCategoryFilterChange(value);
    }
  };

  return (
    <div className="w-full md:w-[200px]">
      <Select
        value={categoryFilter || "all"}
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categoryOptions.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
