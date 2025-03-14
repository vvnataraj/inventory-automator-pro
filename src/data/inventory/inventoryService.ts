import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { Purchase } from "@/types/purchase";
import { inventoryItems } from "./inventoryItems";
import { purchaseOrders } from "./mockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

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

  if (categoryFilter) {
    filteredItems = filteredItems.filter(item => 
      item.category === categoryFilter
    );
  }

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

export const syncInventoryItemsToSupabase = async (): Promise<{success: boolean, message: string, count: number}> => {
  try {
    console.log("Starting inventory sync to Supabase...");
    
    const supabaseItems = inventoryItems.map(item => {
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);
      
      const itemId = isValidUUID ? item.id : uuidv4();
      
      if (!isValidUUID) {
        console.log(`Item ${item.id} (${item.name}) doesn't have a valid UUID - generating new UUID: ${itemId}`);
      }
      
      return {
        id: itemId,
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
    });
    
    console.log(`Preparing to sync ${supabaseItems.length} items to Supabase...`);
    
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
