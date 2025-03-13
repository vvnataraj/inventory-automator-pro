import { useState, useEffect, useCallback } from "react";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { getInventoryItems, inventoryItems } from "@/data/inventoryData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useInventoryItems(
  page: number = 1, 
  searchQuery: string = "",
  sortField: SortField = 'name',
  sortDirection: SortDirection = 'asc',
  categoryFilter?: string,
  locationFilter?: string
) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      let dbItems: InventoryItem[] = [];
      let supabaseQuery = supabase
        .from('inventory_items')
        .select('*');
      
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.toLowerCase().trim();
        supabaseQuery = supabaseQuery.or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
      }
      
      if (categoryFilter) {
        supabaseQuery = supabaseQuery.eq('category', categoryFilter);
      }
      
      if (locationFilter) {
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
        throw new Error("Failed to fetch from database");
      }
      
      if (data && data.length > 0) {
        dbItems = data.map(item => {
          const dimensionsObj = item.dimensions as Record<string, any> | null;
          const weightObj = item.weight as Record<string, any> | null;
          
          return {
            id: item.id,
            sku: item.sku,
            name: item.name,
            description: item.description || "",
            category: item.category || "",
            subcategory: item.subcategory || "",
            brand: item.brand || "",
            rrp: item.price || 0,
            cost: item.cost || 0,
            stock: item.stock || 0,
            lowStockThreshold: item.low_stock_threshold || 5,
            minStockCount: item.min_stock_count || 1,
            location: item.location || "",
            barcode: item.barcode || "",
            dateAdded: item.date_added,
            lastUpdated: item.last_updated,
            imageUrl: item.image_url,
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
            isActive: item.is_active,
            supplier: item.supplier || "",
            tags: item.tags || []
          } as InventoryItem;
        });
        
        setItems(dbItems);
        setTotalItems(count || dbItems.length);
        console.log("Fetched items from Supabase:", dbItems);
      } else {
        console.log("No data in Supabase, using local data");
        let filteredItems = [...inventoryItems];
        
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          filteredItems = filteredItems.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.sku.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
          );
        }
        
        if (categoryFilter) {
          filteredItems = filteredItems.filter(item => 
            item.category.toLowerCase() === categoryFilter.toLowerCase()
          );
        }
        
        if (locationFilter) {
          filteredItems = filteredItems.filter(item => 
            item.location.toLowerCase() === locationFilter.toLowerCase()
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
        
        setItems(paginatedItems);
        setTotalItems(total);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch inventory items"));
      console.error("Failed to fetch inventory items:", err);
      
      const filteredItems = [...inventoryItems];
      const pageSize = 20;
      const start = (page - 1) * pageSize;
      const paginatedItems = filteredItems.slice(start, start + pageSize);
      
      setItems(paginatedItems);
      setTotalItems(filteredItems.length);
      
      toast.error("Failed to fetch items from database, using local data");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, sortField, sortDirection, categoryFilter, locationFilter]);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchItems();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchItems]);
  
  const updateItem = useCallback(async (updatedItem: InventoryItem) => {
    try {
      setItems(currentItems => 
        currentItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      
      const { error } = await supabase
        .from('inventory_items')
        .update({
          sku: updatedItem.sku,
          name: updatedItem.name,
          description: updatedItem.description,
          category: updatedItem.category,
          subcategory: updatedItem.subcategory,
          brand: updatedItem.brand,
          price: updatedItem.rrp,
          cost: updatedItem.cost,
          stock: updatedItem.stock,
          low_stock_threshold: updatedItem.lowStockThreshold,
          min_stock_count: updatedItem.minStockCount,
          location: updatedItem.location,
          barcode: updatedItem.barcode,
          last_updated: new Date().toISOString(),
          image_url: updatedItem.imageUrl,
          dimensions: updatedItem.dimensions,
          weight: updatedItem.weight,
          is_active: updatedItem.isActive,
          supplier: updatedItem.supplier,
          tags: updatedItem.tags
        })
        .eq('id', updatedItem.id);
      
      if (error) {
        console.error("Error updating item in Supabase:", error);
        throw error;
      }
      
      const itemIndex = inventoryItems.findIndex(item => item.id === updatedItem.id);
      if (itemIndex !== -1) {
        inventoryItems[itemIndex] = updatedItem;
      }
      
      console.log("Item updated successfully:", updatedItem);
    } catch (error) {
      console.error("Failed to update item:", error);
      toast.error("Failed to update item in database");
      
      const itemIndex = inventoryItems.findIndex(item => item.id === updatedItem.id);
      if (itemIndex !== -1) {
        inventoryItems[itemIndex] = updatedItem;
      }
    }
  }, []);
  
  const addItem = useCallback(async (newItem: InventoryItem) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .insert({
          id: newItem.id,
          sku: newItem.sku,
          name: newItem.name,
          description: newItem.description,
          category: newItem.category,
          subcategory: newItem.subcategory,
          brand: newItem.brand,
          price: newItem.rrp,
          cost: newItem.cost,
          stock: newItem.stock,
          low_stock_threshold: newItem.lowStockThreshold,
          min_stock_count: newItem.minStockCount,
          location: newItem.location,
          barcode: newItem.barcode,
          date_added: newItem.dateAdded,
          last_updated: newItem.lastUpdated,
          image_url: newItem.imageUrl,
          dimensions: newItem.dimensions,
          weight: newItem.weight,
          is_active: newItem.isActive,
          supplier: newItem.supplier,
          tags: newItem.tags
        });
      
      if (error) {
        console.error("Error adding item to Supabase:", error);
        throw error;
      }
      
      inventoryItems.unshift(newItem);
      
      const pageSize = 20;
      const start = (page - 1) * pageSize;
      const paginatedItems = inventoryItems.slice(start, start + pageSize);
      
      setItems(paginatedItems);
      setTotalItems(inventoryItems.length);
      
      console.log("Item added successfully:", newItem);
    } catch (error) {
      console.error("Failed to add item:", error);
      toast.error("Failed to add item to database");
      
      inventoryItems.unshift(newItem);
      
      const pageSize = 20;
      const start = (page - 1) * pageSize;
      const paginatedItems = inventoryItems.slice(start, start + pageSize);
      
      setItems(paginatedItems);
      setTotalItems(inventoryItems.length);
    }
  }, [page]);
  
  const deleteItem = useCallback(async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemId);
      
      if (error) {
        console.error("Error deleting item from Supabase:", error);
        throw error;
      }
      
      setItems(currentItems => 
        currentItems.filter(item => item.id !== itemId)
      );
      
      const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        inventoryItems.splice(itemIndex, 1);
      }
      
      setTotalItems(prev => prev - 1);
      
      console.log("Item deleted successfully:", itemId);
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Failed to delete item from database");
      
      setItems(currentItems => 
        currentItems.filter(item => item.id !== itemId)
      );
      
      const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        inventoryItems.splice(itemIndex, 1);
      }
      
      setTotalItems(prev => prev - 1);
    }
  }, []);
  
  const reorderItem = useCallback((itemId: string, direction: 'up' | 'down') => {
    setItems(currentItems => {
      const itemIndex = currentItems.findIndex(item => item.id === itemId);
      if (itemIndex === -1) return currentItems;
      
      if ((direction === 'up' && itemIndex === 0) || 
          (direction === 'down' && itemIndex === currentItems.length - 1)) {
        return currentItems;
      }
      
      const newItems = [...currentItems];
      const swapIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
      
      [newItems[itemIndex], newItems[swapIndex]] = [newItems[swapIndex], newItems[itemIndex]];
      
      return newItems;
    });
  }, []);
  
  const reorderStock = useCallback(async (item: InventoryItem, quantity: number = 0) => {
    try {
      const reorderedItem = {
        ...item,
        stock: item.stock + (quantity > 0 ? quantity : Math.max(item.minStockCount, item.lowStockThreshold * 2)),
        lastUpdated: new Date().toISOString()
      };
      
      await updateItem(reorderedItem);
      
      return reorderedItem;
    } catch (error) {
      console.error("Failed to reorder stock:", error);
      toast.error("Failed to reorder stock");
      return item;
    }
  }, []);
  
  const reactivateAllItems = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data: discontinuedItems, error: fetchError } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('is_active', false);
      
      if (fetchError) {
        console.error("Error fetching discontinued items from Supabase:", fetchError);
        throw new Error("Failed to fetch discontinued items");
      }
      
      if (!discontinuedItems || discontinuedItems.length === 0) {
        toast.info("No discontinued items found to reactivate");
        setIsLoading(false);
        return;
      }
      
      const updatePromises = discontinuedItems.map(item => 
        supabase
          .from('inventory_items')
          .update({ 
            is_active: true,
            last_updated: new Date().toISOString()
          })
          .eq('id', item.id)
      );
      
      await Promise.all(updatePromises);
      
      inventoryItems.forEach(item => {
        if (!item.isActive) {
          item.isActive = true;
          item.lastUpdated = new Date().toISOString();
        }
      });
      
      await fetchItems();
      
      toast.success(`Successfully reactivated ${discontinuedItems.length} discontinued items`);
    } catch (error) {
      console.error("Failed to reactivate discontinued items:", error);
      toast.error("Failed to reactivate discontinued items");
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems]);
  
  return { 
    items, 
    totalItems, 
    isLoading, 
    error, 
    updateItem, 
    addItem, 
    deleteItem,
    reorderItem,
    reorderStock,
    fetchItems,
    reactivateAllItems
  };
}
