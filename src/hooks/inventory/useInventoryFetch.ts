
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { inventoryItems } from "@/data/inventoryData";
import { supabase } from "@/integrations/supabase/client";
import { mapDatabaseItemToInventoryItem } from "./useInventoryMappers";
import { useCallback } from "react";

/**
 * Hook providing functions to fetch inventory items from Supabase or local data
 */
export function useInventoryFetch() {
  /**
   * Fetch inventory items from Supabase database
   */
  const fetchFromSupabase = useCallback(async (
    page: number = 1,
    searchQuery: string = "",
    sortField: SortField = 'name',
    sortDirection: SortDirection = 'asc',
    categoryFilter?: string,
    locationFilter?: string
  ) => {
    try {
      console.log("Attempting to fetch from Supabase with params:", {
        page, searchQuery, sortField, sortDirection, categoryFilter, locationFilter
      });
      
      let supabaseQuery = supabase
        .from('inventory_items')
        .select('*', { count: 'exact' });
      
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.toLowerCase().trim();
        // Improve the search query to properly search across name, sku, and category
        supabaseQuery = supabaseQuery.or(
          `name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`
        );
      }
      
      if (categoryFilter && categoryFilter !== "undefined") {
        console.log(`Filtering by category "${categoryFilter}"`);
        // Use exact match for category filtering
        supabaseQuery = supabaseQuery.eq('category', categoryFilter);
      }
      
      if (locationFilter && locationFilter !== "undefined") {
        supabaseQuery = supabaseQuery.eq('location', locationFilter);
      }
      
      const supabaseSortField = sortField === 'rrp' ? 'price' : sortField;
      supabaseQuery = supabaseQuery.order(supabaseSortField, { ascending: sortDirection === 'asc' });
      
      const pageSize = 20;
      const start = (page - 1) * pageSize;
      supabaseQuery = supabaseQuery.range(start, start + pageSize - 1);
      
      const { data, error: fetchError, count } = await supabaseQuery;
      
      if (fetchError) {
        console.error("Error fetching from Supabase:", fetchError);
        return { items: [], count: 0, error: fetchError };
      }
      
      if (!data || data.length === 0) {
        console.log("No items returned from Supabase, falling back to local data");
        return { items: [], count: 0, error: null };
      }
      
      const dbItems = data.map(item => mapDatabaseItemToInventoryItem(item));
      console.log(`Successfully fetched ${dbItems.length} items from Supabase`);
      return { items: dbItems, count: count || dbItems.length, error: null };
    } catch (error) {
      console.error("Exception in fetchFromSupabase:", error);
      return { items: [], count: 0, error };
    }
  }, []);

  /**
   * Fetch inventory items from local data
   */
  const fetchFromLocal = useCallback((
    page: number = 1,
    searchQuery: string = "",
    sortField: SortField = 'name',
    sortDirection: SortDirection = 'asc',
    categoryFilter?: string,
    locationFilter?: string
  ) => {
    console.log("Fetching from local data with params:", {
      page, searchQuery, sortField, sortDirection, categoryFilter, locationFilter
    });
    
    let filteredItems = [...inventoryItems];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      // Improve local search to match the same fields we're searching in Supabase
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    if (categoryFilter && categoryFilter !== "undefined") {
      console.log(`Filtering by category: "${categoryFilter}"`);
      filteredItems = filteredItems.filter(item => 
        item.category === categoryFilter
      );
    }
    
    if (locationFilter && locationFilter !== "undefined") {
      filteredItems = filteredItems.filter(item => 
        item.location === locationFilter
      );
    }
    
    const sortedItems = filteredItems.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      const comparison = typeof aValue === 'string' 
        ? aValue.localeCompare(bValue as string)
        : Number(aValue) - Number(bValue);
        
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    const total = sortedItems.length;
    const pageSize = 20;
    const start = (page - 1) * pageSize;
    const paginatedItems = sortedItems.slice(start, start + pageSize);
    
    console.log(`Returning ${paginatedItems.length} items from local data (total: ${total})`);
    return { items: paginatedItems, total };
  }, []);

  return {
    fetchFromSupabase,
    fetchFromLocal
  };
}
