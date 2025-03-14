
import React from "react";

export const InventoryEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <h3 className="text-xl font-semibold mb-2">No inventory items found</h3>
      <p className="text-muted-foreground mb-4">Try changing your search criteria or add new items.</p>
    </div>
  );
};
