
import { useState, useEffect, useCallback } from "react";
import { Sale, SaleDB, SaleItem, SaleItemDB, SaleStatus } from "@/types/sale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export function useSalesWithDB(page = 1, pageSize = 10, searchQuery = "") {
  const [sales, setSales] = useState<Sale[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch sales from the database
  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('sales')
        .select(`
          *,
          items:sale_items(*)
        `, { count: 'exact' })
        .order('date', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (searchQuery) {
        query = query.or(`salenumber.ilike.%${searchQuery}%,customername.ilike.%${searchQuery}%`);
      }
      
      const { data: salesData, error: salesError, count } = await query;
      
      if (salesError) {
        throw salesError;
      }
      
      if (!salesData) {
        setSales([]);
        setTotalSales(0);
        return;
      }
      
      // Transform data to match our Sale type
      const transformedSales: Sale[] = salesData.map((saleDB: SaleDB) => {
        // Extract items from the joined data
        const items = Array.isArray(saleDB.items) ? saleDB.items.map((item: SaleItemDB) => ({
          inventoryItemId: item.inventoryitemid,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        })) : [];
        
        return {
          id: saleDB.id,
          saleNumber: saleDB.salenumber,
          customerName: saleDB.customername,
          items: items,
          total: saleDB.total,
          date: saleDB.date,
          status: saleDB.status as SaleStatus,
          paymentMethod: saleDB.paymentmethod,
          notes: saleDB.notes || ''
        };
      });
      
      setSales(transformedSales);
      setTotalSales(count || transformedSales.length);
      setError(null);
    } catch (err) {
      console.error("Error fetching sales:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch sales"));
      toast.error("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // Add a new sale to the database
  const addSale = useCallback(async (newSale: Omit<Sale, "id">) => {
    try {
      // Generate a new UUID for the sale
      const saleId = uuidv4();
      
      // Insert the sale
      const { error: saleError } = await supabase
        .from('sales')
        .insert({
          id: saleId,
          salenumber: newSale.saleNumber,
          customername: newSale.customerName,
          total: newSale.total,
          date: newSale.date,
          status: newSale.status,
          paymentmethod: newSale.paymentMethod,
          notes: newSale.notes
        });
      
      if (saleError) throw saleError;
      
      // Insert all the sale items
      if (newSale.items && newSale.items.length > 0) {
        const saleItems = newSale.items.map(item => ({
          saleid: saleId,
          inventoryitemid: item.inventoryItemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }));
        
        const { error: itemsError } = await supabase
          .from('sale_items')
          .insert(saleItems);
        
        if (itemsError) throw itemsError;
      }
      
      // Refresh sales after adding
      await fetchSales();
      toast.success('Sale created successfully');
      return { success: true, id: saleId };
    } catch (error) {
      console.error("Error adding sale:", error);
      toast.error("Failed to create sale");
      return { success: false, id: null };
    }
  }, [fetchSales]);

  // Update an existing sale
  const updateSale = useCallback(async (updatedSale: Sale) => {
    try {
      // Update the sale
      const { error: saleError } = await supabase
        .from('sales')
        .update({
          salenumber: updatedSale.saleNumber,
          customername: updatedSale.customerName,
          total: updatedSale.total,
          date: updatedSale.date,
          status: updatedSale.status,
          paymentmethod: updatedSale.paymentMethod,
          notes: updatedSale.notes
        })
        .eq('id', updatedSale.id);
      
      if (saleError) throw saleError;
      
      // Delete existing sale items and insert updated ones
      const { error: deleteItemsError } = await supabase
        .from('sale_items')
        .delete()
        .eq('saleid', updatedSale.id);
      
      if (deleteItemsError) throw deleteItemsError;
      
      // Insert updated items
      if (updatedSale.items && updatedSale.items.length > 0) {
        const saleItems = updatedSale.items.map(item => ({
          saleid: updatedSale.id,
          inventoryitemid: item.inventoryItemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }));
        
        const { error: insertItemsError } = await supabase
          .from('sale_items')
          .insert(saleItems);
        
        if (insertItemsError) throw insertItemsError;
      }
      
      // Refresh sales after updating
      await fetchSales();
      toast.success('Sale updated successfully');
      return true;
    } catch (error) {
      console.error("Error updating sale:", error);
      toast.error("Failed to update sale");
      return false;
    }
  }, [fetchSales]);

  // Delete a sale from the database
  const deleteSale = useCallback(async (saleId: string) => {
    try {
      // Supabase will automatically delete the sale_items due to ON DELETE CASCADE
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId);
      
      if (error) throw error;
      
      // Update the local state
      setSales(prevSales => prevSales.filter(sale => sale.id !== saleId));
      setTotalSales(prev => prev - 1);
      
      toast.success('Sale deleted successfully');
      return true;
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast.error("Failed to delete sale");
      return false;
    }
  }, []);

  // Get sales statistics: total sales, average sale value, etc.
  const getSalesStatistics = useCallback(() => {
    const total = sales.length;
    const totalValue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
    const averageValue = total > 0 ? totalValue / total : 0;
    
    return {
      totalSales: total,
      totalValue,
      averageValue
    };
  }, [sales]);

  return {
    sales,
    totalSales,
    loading,
    error,
    page,
    setPage: (newPage: number) => {
      if (newPage > 0) setLoading(true);
      setPage(newPage);
    },
    pageSize,
    setPageSize: (newPageSize: number) => {
      setLoading(true);
      setPageSize(newPageSize);
    },
    fetchSales,
    addSale,
    updateSale,
    deleteSale,
    getSalesStatistics
  };
}
