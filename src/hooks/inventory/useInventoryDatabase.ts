
import { useCallback } from "react";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { useInventoryFetch } from "./useInventoryFetch";
import { mapInventoryItemToSupabaseItem } from "./useInventoryMappers";

/**
 * Hook that provides database operations for inventory items
 */
export function useInventoryDatabase() {
  const { fetchFromSupabase, fetchFromLocal } = useInventoryFetch();

  return {
    fetchFromSupabase,
    fetchFromLocal,
    mapInventoryItemToSupabaseItem,
    // We still export mapSupabaseItemToInventoryItem for backward compatibility
    // but it's imported from useInventoryMappers internally
    mapSupabaseItemToInventoryItem: (item: any): InventoryItem => {
      // Import dynamically to avoid circular dependencies
      const { mapDatabaseItemToInventoryItem } = require("./useInventoryMappers");
      return mapDatabaseItemToInventoryItem(item);
    }
  };
}
