
import React from "react";
import { SortField } from "@/types/inventory";
import { ArrowUpAZ, ArrowDownAz, ArrowUp, ArrowDown } from "lucide-react";

interface SortHeaderProps {
  field: SortField;
  label: string;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

export const SortHeader: React.FC<SortHeaderProps> = ({ 
  field, 
  label, 
  sortField, 
  sortDirection, 
  onSort 
}) => {
  const isActive = sortField === field;
  
  const getSortIcon = () => {
    if (!isActive) return null;
    
    if (field === 'name' || field === 'category' || field === 'sku' || field === 'location') {
      return sortDirection === 'asc' ? 
        <ArrowUpAZ className="h-4 w-4 ml-1" /> : 
        <ArrowDownAz className="h-4 w-4 ml-1" />;
    } else {
      return sortDirection === 'asc' ? 
        <ArrowUp className="h-4 w-4 ml-1" /> : 
        <ArrowDown className="h-4 w-4 ml-1" />;
    }
  };
  
  return (
    <th 
      className={`py-3 px-4 text-left font-medium cursor-pointer hover:bg-muted/50 transition-colors ${
        isActive ? 'text-primary' : 'text-muted-foreground'
      }`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {getSortIcon()}
      </div>
    </th>
  );
};
