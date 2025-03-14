
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Purchase, PurchaseStatus, PurchaseDB, PurchaseItemDB } from "@/types/purchase";

export const usePurchasesWithDB = (page = 1, pageSize = 12, searchQuery = "", statusFilter?: PurchaseStatus) => {
  const [currentPage, setCurrentPage] = useState(page);

  // Fetch purchases from the database
  const fetchPurchases = async (): Promise<Purchase[]> => {
    let query = supabase
      .from('purchases')
      .select(`
        *,
        items:purchase_items(*)
      `)
      .order('orderdate', { ascending: false });

    // Apply search filter if provided
    if (searchQuery) {
      query = query.or(`ponumber.ilike.%${searchQuery}%,supplier.ilike.%${searchQuery}%`);
    }

    // Apply status filter if provided
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    // Apply pagination
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: purchasesData, error } = await query;

    if (error) {
      console.error("Error fetching purchases:", error);
      throw error;
    }

    if (!purchasesData || purchasesData.length === 0) {
      return [];
    }

    // Transform the database purchases to the application purchase format
    const purchases: Purchase[] = purchasesData.map((purchase: PurchaseDB) => {
      return {
        id: purchase.id,
        poNumber: purchase.ponumber,
        supplier: purchase.supplier,
        items: purchase.items?.map((item: PurchaseItemDB) => ({
          itemId: item.itemid,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          unitCost: item.unitcost,
          totalCost: item.totalcost,
        })) || [],
        status: purchase.status as PurchaseStatus,
        totalCost: purchase.totalcost,
        orderDate: purchase.orderdate,
        expectedDeliveryDate: purchase.expecteddeliverydate,
        receivedDate: purchase.receiveddate || undefined,
        notes: purchase.notes || undefined,
      };
    });

    return purchases;
  };

  // Count total purchases
  const fetchTotalPurchases = async (): Promise<number> => {
    let query = supabase
      .from('purchases')
      .select('id', { count: 'exact' });

    // Apply search filter if provided
    if (searchQuery) {
      query = query.or(`ponumber.ilike.%${searchQuery}%,supplier.ilike.%${searchQuery}%`);
    }

    // Apply status filter if provided
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { count, error } = await query;

    if (error) {
      console.error("Error counting purchases:", error);
      throw error;
    }

    return count || 0;
  };

  // Add a new purchase
  const addPurchase = async (newPurchase: Omit<Purchase, "id">): Promise<Purchase> => {
    const purchaseId = uuidv4();
    
    // Create purchase
    const { error: purchaseInsertError } = await supabase
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

    if (purchaseInsertError) {
      console.error("Error creating purchase:", purchaseInsertError);
      throw purchaseInsertError;
    }

    // Create purchase items
    const purchaseItems = newPurchase.items.map(item => ({
      purchaseid: purchaseId,
      itemid: item.itemId,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      unitcost: item.unitCost,
      totalcost: item.totalCost
    }));

    const { error: itemsInsertError } = await supabase
      .from('purchase_items')
      .insert(purchaseItems);

    if (itemsInsertError) {
      console.error("Error creating purchase items:", itemsInsertError);
      throw itemsInsertError;
    }

    // Return the created purchase with ID
    return {
      ...newPurchase,
      id: purchaseId
    };
  };

  // Update an existing purchase
  const updatePurchase = async (updatedPurchase: Purchase): Promise<Purchase> => {
    // Update purchase
    const { error: purchaseUpdateError } = await supabase
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

    if (purchaseUpdateError) {
      console.error("Error updating purchase:", purchaseUpdateError);
      throw purchaseUpdateError;
    }

    // First, delete existing purchase items
    const { error: deleteError } = await supabase
      .from('purchase_items')
      .delete()
      .eq('purchaseid', updatedPurchase.id);

    if (deleteError) {
      console.error("Error deleting purchase items:", deleteError);
      throw deleteError;
    }

    // Then insert updated items
    const purchaseItems = updatedPurchase.items.map(item => ({
      purchaseid: updatedPurchase.id,
      itemid: item.itemId,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      unitcost: item.unitCost,
      totalcost: item.totalCost
    }));

    const { error: itemsInsertError } = await supabase
      .from('purchase_items')
      .insert(purchaseItems);

    if (itemsInsertError) {
      console.error("Error updating purchase items:", itemsInsertError);
      throw itemsInsertError;
    }

    return updatedPurchase;
  };

  // Delete a purchase
  const deletePurchase = async (purchaseId: string): Promise<void> => {
    // First delete purchase items
    const { error: itemsDeleteError } = await supabase
      .from('purchase_items')
      .delete()
      .eq('purchaseid', purchaseId);

    if (itemsDeleteError) {
      console.error("Error deleting purchase items:", itemsDeleteError);
      throw itemsDeleteError;
    }

    // Then delete the purchase
    const { error: purchaseDeleteError } = await supabase
      .from('purchases')
      .delete()
      .eq('id', purchaseId);

    if (purchaseDeleteError) {
      console.error("Error deleting purchase:", purchaseDeleteError);
      throw purchaseDeleteError;
    }
  };

  // Update purchase status
  const updatePurchaseStatus = async (purchaseId: string, status: PurchaseStatus): Promise<void> => {
    const updates: any = { status };

    // Add date for specific statuses
    if (status === 'delivered') {
      updates.receiveddate = new Date().toISOString();
    }

    const { error } = await supabase
      .from('purchases')
      .update(updates)
      .eq('id', purchaseId);

    if (error) {
      console.error("Error updating purchase status:", error);
      throw error;
    }
  };

  // Query for purchases
  const { data: purchases = [], isLoading, error } = useQuery({
    queryKey: ['purchases', currentPage, pageSize, searchQuery, statusFilter],
    queryFn: fetchPurchases,
  });

  // Query for total purchases count
  const { data: totalPurchases = 0 } = useQuery({
    queryKey: ['purchasesCount', searchQuery, statusFilter],
    queryFn: fetchTotalPurchases,
  });

  // Mutations
  const queryClient = useQueryClient();
  
  const { mutateAsync: addPurchaseMutation } = useMutation({
    mutationFn: addPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchasesCount'] });
    },
  });

  const { mutateAsync: updatePurchaseMutation } = useMutation({
    mutationFn: updatePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  const { mutateAsync: deletePurchaseMutation } = useMutation({
    mutationFn: deletePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchasesCount'] });
    },
  });

  const { mutateAsync: updatePurchaseStatusMutation } = useMutation({
    mutationFn: (params: { purchaseId: string, status: PurchaseStatus }) => 
      updatePurchaseStatus(params.purchaseId, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  return {
    purchases,
    totalPurchases,
    isLoading,
    error,
    page: currentPage,
    setPage,
    pageSize,
    setPageSize: (newPageSize: number) => {
      // Reset to page 1 when changing page size
      setCurrentPage(1);
    },
    addPurchase: addPurchaseMutation,
    updatePurchase: updatePurchaseMutation,
    deletePurchase: deletePurchaseMutation,
    updatePurchaseStatus: (purchaseId: string, status: PurchaseStatus) => 
      updatePurchaseStatusMutation({ purchaseId, status }),
  };
};
