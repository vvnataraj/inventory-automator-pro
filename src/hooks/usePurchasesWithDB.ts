
import { useState, useEffect, useCallback } from "react";
import { Purchase, PurchaseItem, PurchaseStatus } from "@/types/purchase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export function usePurchasesWithDB() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch purchases from the database
  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: purchasesData, error: purchasesError, count } = await supabase
        .from('purchases')
        .select(`
          *,
          items:purchase_items(*)
        `)
        .order('orderDate', { ascending: false });
      
      if (purchasesError) {
        throw purchasesError;
      }
      
      if (!purchasesData) {
        return;
      }
      
      // Transform data to match our Purchase type
      const transformedPurchases: Purchase[] = purchasesData.map(purchase => {
        // Extract items from the joined data
        const items = Array.isArray(purchase.items) ? purchase.items.map(item => ({
          id: item.id,
          itemId: item.itemId,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalCost: item.totalCost
        })) : [];
        
        return {
          id: purchase.id,
          poNumber: purchase.poNumber,
          supplier: purchase.supplier,
          items: items,
          status: purchase.status as PurchaseStatus,
          totalCost: purchase.totalCost,
          orderDate: purchase.orderDate,
          expectedDeliveryDate: purchase.expectedDeliveryDate,
          receivedDate: purchase.receivedDate,
          notes: purchase.notes || ''
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
  }, []);

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
          poNumber: newPurchase.poNumber,
          supplier: newPurchase.supplier,
          status: newPurchase.status,
          totalCost: newPurchase.totalCost,
          orderDate: newPurchase.orderDate,
          expectedDeliveryDate: newPurchase.expectedDeliveryDate,
          receivedDate: newPurchase.receivedDate,
          notes: newPurchase.notes
        });
      
      if (purchaseError) throw purchaseError;
      
      // Insert all the purchase items
      if (newPurchase.items && newPurchase.items.length > 0) {
        const purchaseItems = newPurchase.items.map(item => ({
          purchaseId,
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
      
      if (purchaseError) throw purchaseError;
      
      // Delete existing purchase items and insert updated ones
      const { error: deleteItemsError } = await supabase
        .from('purchase_items')
        .delete()
        .eq('purchaseId', updatedPurchase.id);
      
      if (deleteItemsError) throw deleteItemsError;
      
      // Insert updated items
      if (updatedPurchase.items && updatedPurchase.items.length > 0) {
        const purchaseItems = updatedPurchase.items.map(item => ({
          purchaseId: updatedPurchase.id,
          itemId: item.itemId,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalCost: item.totalCost
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

  return {
    purchases,
    totalPurchases,
    loading,
    error,
    fetchPurchases,
    addPurchase,
    updatePurchase,
    deletePurchase
  };
}
