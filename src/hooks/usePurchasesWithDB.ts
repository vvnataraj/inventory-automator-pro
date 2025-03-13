
import { useState, useCallback, useEffect } from 'react';
import { Purchase, PurchaseStatus } from '@/types/purchase';
import { supabase } from '@/integrations/supabase/client';
import { generatePurchaseOrders } from '@/data/inventoryData';
import { toast } from 'sonner';

export function usePurchasesWithDB(
  page: number = 1,
  pageSize: number = 20,
  searchQuery: string = ''
) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPurchases = useCallback(async () => {
    setIsLoading(true);
    try {
      // First try to fetch from Supabase
      let query = supabase
        .from('purchases')
        .select('*, items:purchase_items(*)', { count: 'exact' });

      // Apply search filter
      if (searchQuery) {
        query = query.or(`poNumber.ilike.%${searchQuery}%,supplier.ilike.%${searchQuery}%`);
      }

      // Apply pagination
      const start = (page - 1) * pageSize;
      query = query.range(start, start + pageSize - 1)
        .order('orderDate', { ascending: false });

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        console.error("Error fetching purchases from Supabase:", fetchError);
        throw new Error("Failed to fetch from database");
      }

      if (data && data.length > 0) {
        // Transform Supabase data to match our Purchase type
        const dbPurchases: Purchase[] = data.map(purchase => ({
          id: purchase.id,
          poNumber: purchase.poNumber,
          supplier: purchase.supplier,
          items: purchase.items.map(item => ({
            itemId: item.itemId,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            unitCost: item.unitCost,
            totalCost: item.totalCost
          })),
          status: purchase.status as PurchaseStatus,
          totalCost: purchase.totalCost,
          orderDate: purchase.orderDate,
          expectedDeliveryDate: purchase.expectedDeliveryDate,
          receivedDate: purchase.receivedDate,
          notes: purchase.notes
        }));

        setPurchases(dbPurchases);
        setTotalPurchases(count || dbPurchases.length);
      } else {
        // If no data in Supabase, use local mock data
        console.log("No purchases data in database, using local data");
        const mockPurchases = generatePurchaseOrders(10);
        setPurchases(mockPurchases.slice((page - 1) * pageSize, page * pageSize));
        setTotalPurchases(mockPurchases.length);

        // Optionally seed the database with mock data
        // Uncomment this to seed the database
        /*
        await seedPurchasesData();
        toast.success("Seeded database with mock purchases data");
        */
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch purchases"));
      console.error("Failed to fetch purchases:", err);
      
      // Fall back to mock data
      const mockPurchases = generatePurchaseOrders(10);
      setPurchases(mockPurchases.slice((page - 1) * pageSize, page * pageSize));
      setTotalPurchases(mockPurchases.length);
      
      toast.error("Failed to fetch purchases from database, using local data");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const addPurchase = useCallback(async (newPurchase: Purchase) => {
    try {
      // First insert the purchase
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          id: newPurchase.id,
          poNumber: newPurchase.poNumber,
          supplier: newPurchase.supplier,
          status: newPurchase.status,
          totalCost: newPurchase.totalCost,
          orderDate: newPurchase.orderDate,
          expectedDeliveryDate: newPurchase.expectedDeliveryDate,
          receivedDate: newPurchase.receivedDate,
          notes: newPurchase.notes
        })
        .select()
        .single();

      if (purchaseError) {
        throw purchaseError;
      }

      // Then insert the purchase items
      const purchaseItems = newPurchase.items.map(item => ({
        purchaseId: purchaseData.id,
        itemId: item.itemId,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        unitCost: item.unitCost,
        totalCost: item.totalCost
      }));

      const { error: itemsError } = await supabase
        .from('purchase_items')
        .insert(purchaseItems);

      if (itemsError) {
        throw itemsError;
      }

      // Update local state
      setPurchases(prev => [newPurchase, ...prev]);
      setTotalPurchases(prev => prev + 1);
      
      toast.success(`Purchase order ${newPurchase.poNumber} created successfully`);
      return true;
    } catch (error) {
      console.error("Failed to add purchase:", error);
      toast.error("Failed to add purchase to database");
      return false;
    }
  }, []);

  const updatePurchase = useCallback(async (updatedPurchase: Purchase) => {
    try {
      // Update the purchase record
      const { error: purchaseError } = await supabase
        .from('purchases')
        .update({
          poNumber: updatedPurchase.poNumber,
          supplier: updatedPurchase.supplier,
          status: updatedPurchase.status,
          totalCost: updatedPurchase.totalCost,
          orderDate: updatedPurchase.orderDate,
          expectedDeliveryDate: updatedPurchase.expectedDeliveryDate,
          receivedDate: updatedPurchase.receivedDate,
          notes: updatedPurchase.notes
        })
        .eq('id', updatedPurchase.id);

      if (purchaseError) {
        throw purchaseError;
      }

      // Delete existing purchase items
      const { error: deleteError } = await supabase
        .from('purchase_items')
        .delete()
        .eq('purchaseId', updatedPurchase.id);

      if (deleteError) {
        throw deleteError;
      }

      // Insert updated purchase items
      const purchaseItems = updatedPurchase.items.map(item => ({
        purchaseId: updatedPurchase.id,
        itemId: item.itemId,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        unitCost: item.unitCost,
        totalCost: item.totalCost
      }));

      const { error: itemsError } = await supabase
        .from('purchase_items')
        .insert(purchaseItems);

      if (itemsError) {
        throw itemsError;
      }

      // Update local state
      setPurchases(prev => 
        prev.map(purchase => 
          purchase.id === updatedPurchase.id ? updatedPurchase : purchase
        )
      );
      
      toast.success(`Purchase order ${updatedPurchase.poNumber} updated successfully`);
      return true;
    } catch (error) {
      console.error("Failed to update purchase:", error);
      toast.error("Failed to update purchase in database");
      return false;
    }
  }, []);

  const deletePurchase = useCallback(async (purchaseId: string) => {
    try {
      // Delete the purchase (purchase items will be deleted via cascade)
      const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', purchaseId);

      if (error) {
        throw error;
      }

      // Update local state
      setPurchases(prev => prev.filter(purchase => purchase.id !== purchaseId));
      setTotalPurchases(prev => prev - 1);
      
      toast.success("Purchase order deleted successfully");
      return true;
    } catch (error) {
      console.error("Failed to delete purchase:", error);
      toast.error("Failed to delete purchase from database");
      return false;
    }
  }, []);

  // Utility function to seed the database with mock data
  const seedPurchasesData = useCallback(async () => {
    try {
      const mockPurchases = generatePurchaseOrders(20);
      
      for (const purchase of mockPurchases) {
        // Insert purchase
        const { data: purchaseData, error: purchaseError } = await supabase
          .from('purchases')
          .insert({
            id: purchase.id,
            poNumber: purchase.poNumber,
            supplier: purchase.supplier,
            status: purchase.status,
            totalCost: purchase.totalCost,
            orderDate: purchase.orderDate,
            expectedDeliveryDate: purchase.expectedDeliveryDate,
            receivedDate: purchase.receivedDate,
            notes: purchase.notes
          })
          .select()
          .single();
        
        if (purchaseError) {
          console.error("Error inserting purchase:", purchaseError);
          continue;
        }
        
        // Insert purchase items
        const purchaseItems = purchase.items.map(item => ({
          purchaseId: purchaseData.id,
          itemId: item.itemId,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalCost: item.totalCost
        }));
        
        const { error: itemsError } = await supabase
          .from('purchase_items')
          .insert(purchaseItems);
        
        if (itemsError) {
          console.error("Error inserting purchase items:", itemsError);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Failed to seed purchases data:", error);
      return false;
    }
  }, []);

  return {
    purchases,
    totalPurchases,
    isLoading,
    error,
    fetchPurchases,
    addPurchase,
    updatePurchase,
    deletePurchase,
    seedPurchasesData
  };
}
