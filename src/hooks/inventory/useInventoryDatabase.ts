
import { useCallback } from "react";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { inventoryItems } from "@/data/inventoryData";
import { supabase } from "@/integrations/supabase/client";

export function useInventoryDatabase() {
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
        supabaseQuery = supabaseQuery.or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
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
      
      const dbItems = data.map(item => mapSupabaseItemToInventoryItem(item));
      console.log(`Successfully fetched ${dbItems.length} items from Supabase`);
      return { items: dbItems, count: count || dbItems.length, error: null };
    } catch (error) {
      console.error("Exception in fetchFromSupabase:", error);
      return { items: [], count: 0, error };
    }
  }, []);

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

  const mapSupabaseItemToInventoryItem = (item: any): InventoryItem => {
    const dimensionsObj = item.dimensions as Record<string, any> | null;
    const weightObj = item.weight as Record<string, any> | null;
    
    return {
      id: item.id || "",
      sku: item.sku || "",
      name: item.name || "",
      description: item.description || "",
      category: item.category || "",
      subcategory: item.subcategory || "",
      brand: item.brand || "",
      price: typeof item.price === 'number' ? item.price : 0,
      rrp: typeof item.price === 'number' ? item.price : 0,
      cost: typeof item.cost === 'number' ? item.cost : 0,
      stock: typeof item.stock === 'number' ? item.stock : 0,
      lowStockThreshold: typeof item.low_stock_threshold === 'number' ? item.low_stock_threshold : 5,
      minStockCount: typeof item.min_stock_count === 'number' ? item.min_stock_count : 1,
      location: item.location || "",
      barcode: item.barcode || "",
      dateAdded: item.date_added || new Date().toISOString(),
      lastUpdated: item.last_updated || new Date().toISOString(),
      imageUrl: item.image_url || "",
      dimensions: dimensionsObj ? {
        length: Number(dimensionsObj.length) || 0,
        width: Number(dimensionsObj.width) || 0,
        height: Number(dimensionsObj.height) || 0,
        unit: (dimensionsObj.unit as 'cm' | 'mm' | 'in') || 'cm'
      } : undefined,
      weight: weightObj ? {
        value: Number(weightObj.value) || 0,
        unit: (weightObj.unit as 'kg' | 'g' | 'lb') || 'kg'
      } : undefined,
      isActive: Boolean(item.is_active !== false), // Default to true if undefined
      supplier: item.supplier || "",
      tags: Array.isArray(item.tags) ? item.tags : []
    };
  };

  const mapInventoryItemToSupabaseItem = (item: InventoryItem) => {
    return {
      id: item.id,
      sku: item.sku,
      name: item.name,
      description: item.description,
      category: item.category,
      subcategory: item.subcategory,
      brand: item.brand,
      price: item.rrp, // Map rrp to price
      cost: item.cost,
      stock: item.stock,
      low_stock_threshold: item.lowStockThreshold,
      min_stock_count: item.minStockCount,
      location: item.location,
      barcode: item.barcode,
      date_added: item.dateAdded,
      last_updated: item.lastUpdated || new Date().toISOString(),
      image_url: item.imageUrl,
      dimensions: item.dimensions,
      weight: item.weight,
      is_active: item.isActive,
      supplier: item.supplier,
      tags: item.tags
    };
  };

  return {
    fetchFromSupabase,
    fetchFromLocal,
    mapSupabaseItemToInventoryItem,
    mapInventoryItemToSupabaseItem
  };
}
