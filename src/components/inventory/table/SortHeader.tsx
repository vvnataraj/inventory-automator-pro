
import React from "react";
import { SortField } from "@/types/inventory";

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
}) => (
  <th 
    className="py-3 px-4 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
    onClick={() => onSort(field)}
  >
    <div className="flex items-center gap-1">
      {label}
      {sortField === field && (
        sortDirection === 'asc' ? 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m18 15-6-6-6 6"/></svg> : 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m6 9 6 6 6-6"/></svg>
      )}
    </div>
  </th>
);
