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
    
    // First, ensure we remove any duplicate SKUs from the items to sync
    // Keep only the first occurrence of each SKU
    const seenSkus = new Set<string>();
    const uniqueItems = inventoryItems.filter(item => {
      if (!item.sku || seenSkus.has(item.sku)) {
        console.log(`Skipping duplicate or empty SKU: ${item.sku}`, item.name);
        return false;
      }
      seenSkus.add(item.sku);
      return true;
    });
    
    console.log(`Filtered down to ${uniqueItems.length} unique SKU items (removed ${inventoryItems.length - uniqueItems.length} duplicates)`);
    
    const supabaseItems = uniqueItems.map(item => {
      // Prepare item for Supabase - don't include an id for insert operations
      // This will allow the database to generate its own UUIDs
      return {
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
        last_updated: new Date().toISOString(), // Always update the timestamp
        image_url: item.imageUrl || "", // Ensure image_url is properly set
        dimensions: item.dimensions || null,
        weight: item.weight || null,
        is_active: item.isActive !== undefined ? item.isActive : true,
        supplier: item.supplier || "",
        tags: item.tags || []
      };
    });
    
    console.log(`Preparing to sync ${supabaseItems.length} items to Supabase...`);
    
    // Process in smaller batches to avoid potential errors with large datasets
    const batchSize = 50;
    let successCount = 0;
    let errors = [];
    
    for (let i = 0; i < supabaseItems.length; i += batchSize) {
      const batch = supabaseItems.slice(i, i + batchSize);
      console.log(`Processing batch ${i/batchSize + 1}, size: ${batch.length}`);
      
      const { error, count } = await supabase
        .from('inventory_items')
        .upsert(batch, { 
          onConflict: 'sku',
          ignoreDuplicates: false
        });
      
      if (error) {
        console.error(`Error in batch ${i/batchSize + 1}:`, error);
        errors.push(error.message);
      } else {
        successCount += batch.length;
        console.log(`Batch ${i/batchSize + 1} completed successfully`);
      }
    }
    
    if (errors.length > 0) {
      return {
        success: successCount > 0, // Partial success if at least some items were synced
        message: `Synced ${successCount} items with ${errors.length} errors: ${errors[0]}${errors.length > 1 ? ` (and ${errors.length - 1} more)` : ''}`,
        count: successCount
      };
    }
    
    console.log(`Successfully synced ${successCount} inventory items to Supabase`);
    return {
      success: true,
      message: `Successfully synced ${successCount} inventory items to Supabase`,
      count: successCount
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
