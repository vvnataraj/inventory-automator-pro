
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { InventoryItem } from "@/types/inventory";
import { syncInventoryItemsToSupabase } from "@/data/inventory/inventoryService";
import { logInventoryActivity } from "@/utils/logging";

interface InventoryHeaderWithActionsProps {
  onAddItem: (newItem: InventoryItem) => void;
  items: InventoryItem[];
  onImportItems: (items: InventoryItem[]) => void;
  onRefreshItems: (forceRefresh?: boolean) => Promise<void>;
}

export const InventoryHeaderWithActions: React.FC<InventoryHeaderWithActionsProps> = ({
  onAddItem,
  items,
  onImportItems,
  onRefreshItems
}) => {
  const [syncingDb, setSyncingDb] = useState(false);

  const handleSyncToDatabase = async () => {
    setSyncingDb(true);
    try {
      const result = await syncInventoryItemsToSupabase();
      if (result.success) {
        toast.success(result.message);
        await logInventoryActivity('sync_to_database', 'batch', 'All Items', { 
          result: 'success',
          message: result.message
        });
        await onRefreshItems(true);
      } else {
        toast.error(result.message);
        await logInventoryActivity('sync_to_database', 'batch', 'All Items', { 
          result: 'error',
          message: result.message
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to sync inventory: ${errorMessage}`);
      await logInventoryActivity('sync_to_database', 'batch', 'All Items', { 
        result: 'error',
        message: errorMessage
      });
    } finally {
      setSyncingDb(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <InventoryHeader 
        onAddItem={onAddItem} 
        items={items}
        onImportItems={onImportItems}
      />
      <Button 
        onClick={handleSyncToDatabase} 
        disabled={syncingDb}
        variant="outline"
        className="ml-2 h-10"
      >
        {syncingDb ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Syncing...
          </>
        ) : (
          <>Sync to Database</>
        )}
      </Button>
    </div>
  );
};
