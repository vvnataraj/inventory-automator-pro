
import { useState, useEffect, useCallback } from "react";
import { Purchase, PurchaseDB, PurchaseItem, PurchaseItemDB, PurchaseStatus } from "@/types/purchase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export function usePurchasesWithDB(page = 1, searchQuery = "") {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pageSize = 12; // Fixed page size for purchases

  // Fetch purchases from the database
  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('purchases')
        .select(`
          *,
          items:purchase_items(*)
        `, { count: 'exact' })
        .order('orderdate', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (searchQuery) {
        query = query.or(`ponumber.ilike.%${searchQuery}%,supplier.ilike.%${searchQuery}%`);
      }
      
      const { data: purchasesData, error: purchasesError, count } = await query;
      
      if (purchasesError) {
        throw purchasesError;
      }
      
      if (!purchasesData) {
        setPurchases([]);
        setTotalPurchases(0);
        return;
      }
      
      // Transform data to match our Purchase type
      const transformedPurchases: Purchase[] = purchasesData.map((purchaseDB: PurchaseDB) => {
        // Extract items from the joined data
        const items = Array.isArray(purchaseDB.items) ? purchaseDB.items.map((item: PurchaseItemDB) => ({
          itemId: item.itemid,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          unitCost: item.unitcost,
          totalCost: item.totalcost
        })) : [];
        
        return {
          id: purchaseDB.id,
          poNumber: purchaseDB.ponumber,
          supplier: purchaseDB.supplier,
          items: items,
          status: purchaseDB.status as PurchaseStatus,
          totalCost: purchaseDB.totalcost,
          orderDate: purchaseDB.orderdate,
          expectedDeliveryDate: purchaseDB.expecteddeliverydate,
          receivedDate: purchaseDB.receiveddate,
          notes: purchaseDB.notes || ''
        };
      });
      
      setPurchases(transformedPurchases);
      setTotalPurchases(count || transformedPurchases.length);
      setError(null);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch purchases"));
      toast.error("Failed to fetch purchases");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, pageSize]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  // Add a new purchase to the database
  const addPurchase = useCallback(async (newPurchase: Omit<Purchase, "id">) => {
    try {
      // Generate a new UUID for the purchase
      const purchaseId = uuidv4();
      
      // Insert the purchase
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          id: purchaseId,
          ponumber: newPurchase.poNumber,
          supplier: newPurchase.supplier,
          status: newPurchase.status,
          totalcost: newPurchase.totalCost,
          orderdate: newPurchase.orderDate,
          expecteddeliverydate: newPurchase.expectedDeliveryDate,
          receiveddate: newPurchase.receivedDate,
          notes: newPurchase.notes
        });
      
      if (purchaseError) throw purchaseError;
      
      // Insert all the purchase items
      if (newPurchase.items && newPurchase.items.length > 0) {
        const purchaseItems = newPurchase.items.map(item => ({
          purchaseid: purchaseId,
          itemid: item.itemId,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          unitcost: item.unitCost,
          totalcost: item.totalCost
        }));
        
        const { error: itemsError } = await supabase
          .from('purchase_items')
          .insert(purchaseItems);
        
        if (itemsError) throw itemsError;
      }
      
      // Refresh purchases after adding
      await fetchPurchases();
      toast.success('Purchase order created successfully');
      return true;
    } catch (error) {
      console.error("Error adding purchase:", error);
      toast.error("Failed to create purchase order");
      return false;
    }
  }, [fetchPurchases]);

  // Update an existing purchase
  const updatePurchase = useCallback(async (updatedPurchase: Purchase) => {
    try {
      // Update the purchase
      const { error: purchaseError } = await supabase
        .from('purchases')
        .update({
          ponumber: updatedPurchase.poNumber,
          supplier: updatedPurchase.supplier,
          status: updatedPurchase.status,
          totalcost: updatedPurchase.totalCost,
          orderdate: updatedPurchase.orderDate,
          expecteddeliverydate: updatedPurchase.expectedDeliveryDate,
          receiveddate: updatedPurchase.receivedDate,
          notes: updatedPurchase.notes
        })
        .eq('id', updatedPurchase.id);
      
      if (purchaseError) throw purchaseError;
      
      // Delete existing purchase items and insert updated ones
      const { error: deleteItemsError } = await supabase
        .from('purchase_items')
        .delete()
        .eq('purchaseid', updatedPurchase.id);
      
      if (deleteItemsError) throw deleteItemsError;
      
      // Insert updated items
      if (updatedPurchase.items && updatedPurchase.items.length > 0) {
        const purchaseItems = updatedPurchase.items.map(item => ({
          purchaseid: updatedPurchase.id,
          itemid: item.itemId,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          unitcost: item.unitCost,
          totalcost: item.totalCost
        }));
        
        const { error: insertItemsError } = await supabase
          .from('purchase_items')
          .insert(purchaseItems);
        
        if (insertItemsError) throw insertItemsError;
      }
      
      // Refresh purchases after updating
      await fetchPurchases();
      toast.success('Purchase order updated successfully');
      return true;
    } catch (error) {
      console.error("Error updating purchase:", error);
      toast.error("Failed to update purchase order");
      return false;
    }
  }, [fetchPurchases]);

  // Delete a purchase from the database
  const deletePurchase = useCallback(async (purchaseId: string) => {
    try {
      // Supabase will automatically delete the purchase_items due to ON DELETE CASCADE
      const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', purchaseId);
      
      if (error) throw error;
      
      // Update the local state
      setPurchases(prevPurchases => prevPurchases.filter(purchase => purchase.id !== purchaseId));
      setTotalPurchases(prev => prev - 1);
      
      toast.success('Purchase order deleted successfully');
      return true;
    } catch (error) {
      console.error("Error deleting purchase:", error);
      toast.error("Failed to delete purchase order");
      return false;
    }
  }, []);

  // Update the status of a purchase
  const updatePurchaseStatus = useCallback(async (purchaseId: string, status: PurchaseStatus) => {
    try {
      const updateData: Partial<PurchaseDB> = { status };
      
      // Add received date when status is "delivered"
      if (status === 'delivered') {
        updateData.receiveddate = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('purchases')
        .update(updateData)
        .eq('id', purchaseId);
      
      if (error) throw error;
      
      // Update the local state
      setPurchases(prevPurchases => 
        prevPurchases.map(purchase => {
          if (purchase.id === purchaseId) {
            return {
              ...purchase,
              status,
              receivedDate: status === 'delivered' ? new Date().toISOString() : purchase.receivedDate
            };
          }
          return purchase;
        })
      );
      
      toast.success(`Purchase order marked as ${status}`);
      return true;
    } catch (error) {
      console.error("Error updating purchase status:", error);
      toast.error("Failed to update purchase status");
      return false;
    }
  }, []);

  return {
    purchases,
    totalPurchases,
    loading,
    error,
    page,
    setPage: (newPage: number) => {
      if (newPage > 0) setLoading(true);
      setPage(newPage);
    },
    fetchPurchases,
    addPurchase,
    updatePurchase,
    deletePurchase,
    updatePurchaseStatus
  };
}
