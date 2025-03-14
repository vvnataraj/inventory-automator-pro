import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { Purchase } from "@/types/purchase";
import { inventoryItems } from "./inventoryItems";
import { purchaseOrders } from "./mockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const getInventoryItems = (
  page: number = 1,
  pageSize: number = 20,
  searchQuery: string = "",
  sortField: string = "name",
  sortDirection: "asc" | "desc" = "asc",
  categoryFilter?: string,
  locationFilter?: string
): { items: InventoryItem[], total: number } => {
  let filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply category filter if provided
  if (categoryFilter) {
    filteredItems = filteredItems.filter(item => 
      item.category === categoryFilter
    );
  }

  // Apply location filter if provided
  if (locationFilter) {
    filteredItems = filteredItems.filter(item => 
      item.location === locationFilter
    );
  }

  const start = (page - 1) * pageSize;
  const paginatedItems = filteredItems.slice(start, start + pageSize);

  return {
    items: paginatedItems,
    total: filteredItems.length
  };
};

// Function to get paginated and filtered purchase orders
export const getPurchases = (
  page: number = 1,
  pageSize: number = 20,
  searchQuery: string = ""
): { items: Purchase[], total: number } => {
  const filteredPurchases = purchaseOrders.filter(purchase =>
    purchase.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    purchase.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const start = (page - 1) * pageSize;
  const paginatedPurchases = filteredPurchases.slice(start, start + pageSize);

  return {
    items: paginatedPurchases,
    total: filteredPurchases.length
  };
};

// New function to sync all inventory items to Supabase
export const syncInventoryItemsToSupabase = async (): Promise<{success: boolean, message: string, count: number}> => {
  try {
    console.log("Starting inventory sync to Supabase...");
    
    // Map local inventory items to Supabase format
    const supabaseItems = inventoryItems.map(item => {
      // Ensure the item has a valid UUID for Supabase
      // For items without a UUID, we'll keep their existing ID but they won't be synced
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);
      
      if (!isValidUUID) {
        console.log(`Skipping item ${item.id} (${item.name}) - not a valid UUID`);
        return null;
      }
      
      return {
        id: item.id,
        sku: item.sku,
        name: item.name,
        description: item.description || "",
        category: item.category || "",
        subcategory: item.subcategory || "",
        brand: item.brand || "",
        price: item.price || 0,
        rrp: item.rrp || 0,
        cost: item.cost || 0,
        stock: item.stock || 0,
        low_stock_threshold: item.lowStockThreshold || 5,
        min_stock_count: item.minStockCount || 1,
        location: item.location || "",
        barcode: item.barcode || "",
        date_added: item.dateAdded || new Date().toISOString(),
        last_updated: item.lastUpdated || new Date().toISOString(),
        image_url: item.imageUrl || "",
        dimensions: item.dimensions || null,
        weight: item.weight || null,
        is_active: item.isActive !== undefined ? item.isActive : true,
        supplier: item.supplier || "",
        tags: item.tags || []
      };
    }).filter(Boolean); // Remove any null items (those without UUIDs)
    
    console.log(`Preparing to sync ${supabaseItems.length} items to Supabase...`);
    
    // Use upsert to insert or update items
    const { error, count } = await supabase
      .from('inventory_items')
      .upsert(supabaseItems, { 
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select('count');
      
    if (error) {
      console.error("Error syncing inventory to Supabase:", error);
      return {
        success: false,
        message: `Error syncing inventory: ${error.message}`,
        count: 0
      };
    }
    
    console.log(`Successfully synced ${supabaseItems.length} inventory items to Supabase`);
    return {
      success: true,
      message: `Successfully synced ${supabaseItems.length} inventory items to Supabase`,
      count: supabaseItems.length
    };
  } catch (error) {
    console.error("Exception in syncInventoryItemsToSupabase:", error);
    return {
      success: false,
      message: `Exception during sync: ${error instanceof Error ? error.message : 'Unknown error'}`,
      count: 0
    };
  }
};
