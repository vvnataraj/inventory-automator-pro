
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Purchase, PurchaseStatus } from "@/types/purchase";

// Utility function to map database purchase to Purchase type
const mapDbPurchaseToPurchase = (dbPurchase: any): Purchase => ({
  id: dbPurchase.id,
  poNumber: dbPurchase.poNumber || dbPurchase.ponumber,
  supplier: dbPurchase.supplier,
  orderDate: dbPurchase.orderDate || dbPurchase.orderdate,
  expectedDeliveryDate: dbPurchase.expectedDeliveryDate || dbPurchase.expecteddeliverydate,
  receivedDate: dbPurchase.receivedDate || dbPurchase.receiveddate,
  status: dbPurchase.status as PurchaseStatus,
  totalCost: dbPurchase.totalCost || dbPurchase.totalcost,
  items: dbPurchase.items || [],
  // Remove the createdAt and updatedAt properties as they aren't in the Purchase type
});

// Utility function to map Purchase type to database structure
const mapPurchaseToDbFormat = (purchase: Purchase) => {
  return {
    id: purchase.id,
    ponumber: purchase.poNumber,
    supplier: purchase.supplier,
    orderdate: purchase.orderDate,
    expecteddeliverydate: purchase.expectedDeliveryDate,
    receiveddate: purchase.receivedDate || null,
    status: purchase.status,
    totalcost: purchase.totalCost,
    notes: purchase.notes || null
  };
};

export function usePurchasesWithDB(
  initialPage: number = 1,
  pageSize: number = 10,
  searchQuery: string = "",
  statusFilter?: PurchaseStatus
) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    setPage(initialPage); // Reset page when initialPage changes
  }, [initialPage]);

  useEffect(() => {
    const fetchPurchases = async () => {
      setIsLoading(true);
      try {
        // Attempt to fetch from Supabase
        const { data, error, count } = await supabase
          .from('purchases')
          .select('*, items:purchase_items(*)', { count: 'exact' })
          .like('ponumber', `%${searchQuery}%`)
          .order('created_at', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);

        if (error) {
          console.error('Error fetching purchases from database:', error);
          // Fall back to local data if database fetch fails
          return;
        }

        // Map the data to our Purchase type
        const mappedPurchases = data.map(item => mapDbPurchaseToPurchase(item));
        setPurchases(mappedPurchases);
        setTotalPurchases(count || 0);

        console.log('Successfully fetched purchases from database');
      } catch (error) {
        console.error('Failed to fetch purchases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, [page, pageSize, searchQuery, statusFilter]);

  const addPurchase = async (newPurchase: Purchase) => {
    setIsLoading(true);
    try {
      // Convert the Purchase object to database format
      const dbPurchase = mapPurchaseToDbFormat(newPurchase);
      
      const { data, error } = await supabase
        .from('purchases')
        .insert([dbPurchase])
        .select();

      if (error) {
        console.error('Error adding purchase to database:', error);
        return;
      }

      setPurchases(prev => [...prev, mapDbPurchaseToPurchase(data[0])]);
      setTotalPurchases(prev => prev + 1);

      console.log('Successfully added purchase to database');
    } catch (error) {
      console.error('Failed to add purchase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePurchase = async (updatedPurchase: Purchase) => {
    setIsLoading(true);
    try {
      // Convert the Purchase object to database format
      const dbPurchase = mapPurchaseToDbFormat(updatedPurchase);
      
      const { data, error } = await supabase
        .from('purchases')
        .update(dbPurchase)
        .eq('id', updatedPurchase.id)
        .select();

      if (error) {
        console.error('Error updating purchase in database:', error);
        return;
      }

      setPurchases(prev =>
        prev.map(purchase =>
          purchase.id === updatedPurchase.id ? mapDbPurchaseToPurchase(data[0]) : purchase
        )
      );

      console.log('Successfully updated purchase in database');
    } catch (error) {
      console.error('Failed to update purchase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePurchase = async (purchaseId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', purchaseId);

      if (error) {
        console.error('Error deleting purchase from database:', error);
        return;
      }

      setPurchases(prev => prev.filter(purchase => purchase.id !== purchaseId));
      setTotalPurchases(prev => prev - 1);

      console.log('Successfully deleted purchase from database');
    } catch (error) {
      console.error('Failed to delete purchase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePurchaseStatus = async (purchaseId: string, newStatus: PurchaseStatus) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('purchases')
        .update({ status: newStatus })
        .eq('id', purchaseId)
        .select();

      if (error) {
        console.error('Error updating purchase status in database:', error);
        return;
      }

      setPurchases(prev =>
        prev.map(purchase =>
          purchase.id === purchaseId ? mapDbPurchaseToPurchase(data[0]) : purchase
        )
      );

      console.log('Successfully updated purchase status in database');
    } catch (error) {
      console.error('Failed to update purchase status:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add a refresh function that will force a read from the database
  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Attempt to fetch from Supabase
      const { data, error, count } = await supabase
        .from('purchases')
        .select('*, items:purchase_items(*)', { count: 'exact' })
        .like('ponumber', `%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      if (error) {
        console.error('Error fetching purchases from database:', error);
        // Fall back to local data if database fetch fails
        return;
      }
      
      // Map the data to our Purchase type
      const mappedPurchases = data.map(item => mapDbPurchaseToPurchase(item));
      setPurchases(mappedPurchases);
      setTotalPurchases(count || 0);
      
      console.log('Successfully refreshed purchases from database');
    } catch (error) {
      console.error('Failed to refresh purchases:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, setIsLoading, setPurchases, setTotalPurchases, searchQuery]);

  return {
    purchases,
    totalPurchases,
    isLoading,
    page,
    setPage,
    pageSize,
    addPurchase,
    updatePurchase,
    deletePurchase,
    updatePurchaseStatus,
    refresh  // Export the refresh function
  };
}
