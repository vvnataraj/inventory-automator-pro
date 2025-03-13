
import React from "react";
import { SortField, SortDirection } from "@/types/inventory";
import { SortHeader } from "./SortHeader";

interface InventoryTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export const InventoryTableHeader: React.FC<InventoryTableHeaderProps> = ({
  sortField,
  sortDirection,
  onSort,
}) => {
  return (
    <thead>
      <tr className="border-b bg-muted/50">
        <th className="py-3 px-4 text-left font-medium text-muted-foreground">Image</th>
        <SortHeader field="sku" label="SKU" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
        <SortHeader field="name" label="Name" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
        <SortHeader field="category" label="Category" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
        <SortHeader field="cost" label="Cost" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
        <SortHeader field="rrp" label="RRP" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
        <SortHeader field="stock" label="Stock" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
        <th className="py-3 px-4 text-left font-medium text-muted-foreground">Status</th>
        <th className="py-3 px-4 text-left font-medium text-muted-foreground">Actions</th>
      </tr>
    </thead>
  );
};
