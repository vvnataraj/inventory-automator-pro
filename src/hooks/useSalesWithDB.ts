
import { useState, useCallback, useEffect } from 'react';
import { Sale, SaleStatus } from '@/types/sale';
import { supabase } from '@/integrations/supabase/client';
import { generateSales } from '@/data/salesData';
import { toast } from 'sonner';

export function useSalesWithDB(
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = ''
) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    try {
      // First try to fetch from Supabase
      let query = supabase
        .from('sales')
        .select('*, items:sale_items(*)', { count: 'exact' });

      // Apply search filter
      if (searchQuery) {
        query = query.or(`saleNumber.ilike.%${searchQuery}%,customerName.ilike.%${searchQuery}%`);
      }

      // Apply pagination
      const start = (page - 1) * pageSize;
      query = query.range(start, start + pageSize - 1)
        .order('date', { ascending: false });

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        console.error("Error fetching sales from Supabase:", fetchError);
        throw new Error("Failed to fetch from database");
      }

      if (data && data.length > 0) {
        // Transform Supabase data to match our Sale type
        const dbSales: Sale[] = data.map(sale => ({
          id: sale.id,
          saleNumber: sale.saleNumber,
          customerName: sale.customerName,
          items: sale.items.map(item => ({
            inventoryItemId: item.inventoryItemId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal
          })),
          total: sale.total,
          date: sale.date,
          status: sale.status as SaleStatus,
          paymentMethod: sale.paymentMethod,
          notes: sale.notes
        }));

        setSales(dbSales);
        setTotalSales(count || dbSales.length);
      } else {
        // If no data in Supabase, use local mock data
        console.log("No sales data in database, using local data");
        const { items, total } = generateSales(page, pageSize, searchQuery);
        setSales(items);
        setTotalSales(total);

        // Optionally seed the database with mock data
        // Uncomment this to seed the database
        /*
        await seedSalesData();
        toast.success("Seeded database with mock sales data");
        */
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch sales"));
      console.error("Failed to fetch sales:", err);
      
      // Fall back to mock data
      const { items, total } = generateSales(page, pageSize, searchQuery);
      setSales(items);
      setTotalSales(total);
      
      toast.error("Failed to fetch sales from database, using local data");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const addSale = useCallback(async (newSale: Sale) => {
    try {
      // First insert the sale
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert({
          id: newSale.id,
          saleNumber: newSale.saleNumber,
          customerName: newSale.customerName,
          total: newSale.total,
          date: newSale.date,
          status: newSale.status,
          paymentMethod: newSale.paymentMethod,
          notes: newSale.notes
        })
        .select()
        .single();

      if (saleError) {
        throw saleError;
      }

      // Then insert the sale items
      const saleItems = newSale.items.map(item => ({
        saleId: saleData.id,
        inventoryItemId: item.inventoryItemId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) {
        throw itemsError;
      }

      // Update local state
      setSales(prev => [newSale, ...prev]);
      setTotalSales(prev => prev + 1);
      
      toast.success(`Sale ${newSale.saleNumber} created successfully`);
      return true;
    } catch (error) {
      console.error("Failed to add sale:", error);
      toast.error("Failed to add sale to database");
      return false;
    }
  }, []);

  const updateSale = useCallback(async (updatedSale: Sale) => {
    try {
      // Update the sale record
      const { error: saleError } = await supabase
        .from('sales')
        .update({
          saleNumber: updatedSale.saleNumber,
          customerName: updatedSale.customerName,
          total: updatedSale.total,
          date: updatedSale.date,
          status: updatedSale.status,
          paymentMethod: updatedSale.paymentMethod,
          notes: updatedSale.notes
        })
        .eq('id', updatedSale.id);

      if (saleError) {
        throw saleError;
      }

      // Delete existing sale items
      const { error: deleteError } = await supabase
        .from('sale_items')
        .delete()
        .eq('saleId', updatedSale.id);

      if (deleteError) {
        throw deleteError;
      }

      // Insert updated sale items
      const saleItems = updatedSale.items.map(item => ({
        saleId: updatedSale.id,
        inventoryItemId: item.inventoryItemId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) {
        throw itemsError;
      }

      // Update local state
      setSales(prev => 
        prev.map(sale => 
          sale.id === updatedSale.id ? updatedSale : sale
        )
      );
      
      toast.success(`Sale ${updatedSale.saleNumber} updated successfully`);
      return true;
    } catch (error) {
      console.error("Failed to update sale:", error);
      toast.error("Failed to update sale in database");
      return false;
    }
  }, []);

  const deleteSale = useCallback(async (saleId: string) => {
    try {
      // Delete the sale (sale items will be deleted via cascade)
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId);

      if (error) {
        throw error;
      }

      // Update local state
      setSales(prev => prev.filter(sale => sale.id !== saleId));
      setTotalSales(prev => prev - 1);
      
      toast.success("Sale deleted successfully");
      return true;
    } catch (error) {
      console.error("Failed to delete sale:", error);
      toast.error("Failed to delete sale from database");
      return false;
    }
  }, []);

  // Utility function to seed the database with mock data
  const seedSalesData = useCallback(async () => {
    try {
      const allSales = generateSales(1, 50, "").items;
      
      // Insert sales
      for (const sale of allSales) {
        const { error: saleError } = await supabase
          .from('sales')
          .insert({
            id: sale.id,
            saleNumber: sale.saleNumber,
            customerName: sale.customerName,
            total: sale.total,
            date: sale.date,
            status: sale.status,
            paymentMethod: sale.paymentMethod,
            notes: sale.notes
          });
        
        if (saleError) {
          console.error("Error inserting sale:", saleError);
          continue;
        }
        
        // Insert sale items
        const saleItems = sale.items.map(item => ({
          saleId: sale.id,
          inventoryItemId: item.inventoryItemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }));
        
        const { error: itemsError } = await supabase
          .from('sale_items')
          .insert(saleItems);
        
        if (itemsError) {
          console.error("Error inserting sale items:", itemsError);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Failed to seed sales data:", error);
      return false;
    }
  }, []);

  return {
    sales,
    totalSales,
    isLoading,
    error,
    fetchSales,
    addSale,
    updateSale,
    deleteSale,
    seedSalesData
  };
}
