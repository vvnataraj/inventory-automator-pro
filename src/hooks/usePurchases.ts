
import { useState, useCallback } from "react";
import { getPurchases, purchaseOrders } from "@/data/inventoryData";
import { Purchase, PurchaseStatus } from "@/types/purchase";
import { PurchaseFormData } from "@/components/purchases/AddPurchaseModal";

export function usePurchases(initialPage = 1, initialSearchQuery = "") {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>(purchaseOrders);
  
  // Get paginated purchases based on current page and search query
  const getPaginatedPurchases = useCallback(() => {
    return getPurchases(currentPage, 20, searchQuery);
  }, [currentPage, searchQuery]);
  
  const { items: paginatedPurchases, total: totalPurchases } = getPaginatedPurchases();
  
  const addPurchase = useCallback((purchaseData: PurchaseFormData) => {
    const newPurchase: Purchase = {
      id: `purchase-${Date.now()}`,
      poNumber: purchaseData.poNumber,
      supplier: purchaseData.supplier,
      items: [], // For simplicity, creating without items initially
      status: purchaseData.status,
      totalCost: purchaseData.totalCost,
      orderDate: new Date(purchaseData.orderDate).toISOString(),
      expectedDeliveryDate: new Date(purchaseData.expectedDeliveryDate).toISOString(),
    };
    
    setPurchases(prev => [newPurchase, ...prev]);
    return newPurchase;
  }, []);
  
  const updatePurchase = useCallback((id: string, purchaseData: PurchaseFormData) => {
    setPurchases(prev => 
      prev.map(purchase => 
        purchase.id === id 
          ? { 
              ...purchase, 
              poNumber: purchaseData.poNumber,
              supplier: purchaseData.supplier,
              status: purchaseData.status,
              totalCost: purchaseData.totalCost,
              orderDate: new Date(purchaseData.orderDate).toISOString(),
              expectedDeliveryDate: new Date(purchaseData.expectedDeliveryDate).toISOString(),
            } 
          : purchase
      )
    );
  }, []);
  
  const deletePurchase = useCallback((id: string) => {
    setPurchases(prev => prev.filter(purchase => purchase.id !== id));
  }, []);
  
  // Update status for a purchase
  const updatePurchaseStatus = useCallback((id: string, status: PurchaseStatus) => {
    setPurchases(prev => 
      prev.map(purchase => 
        purchase.id === id 
          ? { ...purchase, status } 
          : purchase
      )
    );
  }, []);
  
  return {
    purchases: paginatedPurchases,
    allPurchases: purchases,
    totalPurchases,
    currentPage,
    searchQuery,
    isLoading,
    setCurrentPage,
    setSearchQuery,
    addPurchase,
    updatePurchase,
    deletePurchase,
    updatePurchaseStatus
  };
}
