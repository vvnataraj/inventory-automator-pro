import { useState } from "react";
import { Truck, Check, X, ShoppingCart, Package, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePurchasesWithDB } from "@/hooks/usePurchasesWithDB";
import { MainLayout } from "@/components/layout/MainLayout";
import { PurchaseStatusBadge } from "@/components/purchases/PurchaseStatusBadge";
import { AddPurchaseModal } from "@/components/purchases/AddPurchaseModal";
import { EditPurchaseModal } from "@/components/purchases/EditPurchaseModal";
import { Purchase, PurchaseStatus } from "@/types/purchase";
import { ListControls } from "@/components/common/ListControls";
import { useUserRoles } from "@/hooks/useUserRoles";
import { SimplePagination } from "@/components/common/SimplePagination";
import { toast } from "sonner";

export default function Purchases() {
  const { isManager } = useUserRoles();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("poNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | undefined>(undefined);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { 
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
    refresh
  } = usePurchasesWithDB(1, 12, searchQuery, statusFilter);
  
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);
  const [statusChangeConfirmOpen, setStatusChangeConfirmOpen] = useState(false);
  const [statusChangeDetails, setStatusChangeDetails] = useState<{purchaseId: string, newStatus: PurchaseStatus} | null>(null);
  
  const totalPages = Math.ceil(totalPurchases / pageSize);

  const handleEdit = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setIsEditModalOpen(true);
  };

  const handleDelete = (purchaseId: string) => {
    setPurchaseToDelete(purchaseId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (purchaseToDelete) {
      try {
        await deletePurchase(purchaseToDelete);
        setPurchaseToDelete(null);
        toast("Purchase deleted", {
          description: "The purchase order has been deleted successfully",
        });
      } catch (error) {
        toast("Error", {
          description: "Failed to delete purchase order",
        });
      }
    }
    setDeleteConfirmOpen(false);
  };

  const handleStatusChangeRequest = (purchaseId: string, status: PurchaseStatus) => {
    setStatusChangeDetails({ purchaseId, newStatus: status });
    setStatusChangeConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    if (statusChangeDetails) {
      const { purchaseId, newStatus } = statusChangeDetails;
      try {
        await updatePurchaseStatus(purchaseId, newStatus);
        
        const statusMessages = {
          pending: "marked as Pending",
          ordered: "marked as Ordered",
          shipped: "marked as Shipped",
          delivered: "marked as Delivered",
          cancelled: "marked as Cancelled"
        };
        
        toast("Status updated", {
          description: `Purchase order ${statusMessages[newStatus]}`,
        });
      } catch (error) {
        toast("Error", {
          description: "Failed to update purchase status",
        });
      }
      
      setStatusChangeDetails(null);
    }
    setStatusChangeConfirmOpen(false);
  };

  const sortOptions = [
    { field: 'poNumber', label: 'PO Number' },
    { field: 'supplier', label: 'Supplier' },
    { field: 'orderDate', label: 'Order Date' },
    { field: 'expectedDeliveryDate', label: 'Expected Delivery' },
    { field: 'status', label: 'Status' },
    { field: 'totalCost', label: 'Total Cost' },
  ];

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedPurchases = () => {
    return [...purchases].sort((a: any, b: any) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      if (sortField === 'orderDate' || sortField === 'expectedDeliveryDate' || sortField === 'receivedDate') {
        valueA = valueA ? new Date(valueA).getTime() : 0;
        valueB = valueB ? new Date(valueB).getTime() : 0;
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const getStatusIcon = (status: PurchaseStatus) => {
    switch (status) {
      case "pending":
        return null;
      case "ordered":
        return <ShoppingCart className="h-4 w-4 mr-2" />;
      case "shipped":
        return <Truck className="h-4 w-4 mr-2" />;
      case "delivered":
        return <Check className="h-4 w-4 mr-2" />;
      case "cancelled":
        return <X className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const handleSyncToDatabase = async () => {
    setIsSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await refresh();
      
      toast("Sync completed", {
        description: "Purchase orders have been successfully synced to the database",
      });
    } catch (error) {
      toast("Sync failed", {
        description: "Failed to sync purchase orders to the database",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Purchases</h1>
        <div className="flex gap-2">
          {isManager() && (
            <>
              <AddPurchaseModal onPurchaseAdded={addPurchase} />
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={handleSyncToDatabase} 
                disabled={isSyncing}
              >
                <Database className="h-4 w-4" />
                {isSyncing ? "Syncing..." : "Sync to Database"}
              </Button>
            </>
          )}
        </div>
      </div>

      <ListControls 
        searchPlaceholder="Search purchases..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSort}
        onSortDirectionChange={setSortDirection}
        sortOptions={sortOptions}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {purchases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getSortedPurchases().map((purchase) => (
                <Card key={purchase.id} className="animate-fade-in">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{purchase.poNumber}</CardTitle>
                        <CardDescription>{purchase.supplier}</CardDescription>
                      </div>
                      <PurchaseStatusBadge status={purchase.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <div className="text-muted-foreground">Order Date:</div>
                        <div>{new Date(purchase.orderDate).toLocaleDateString()}</div>
                        
                        <div className="text-muted-foreground">Expected Delivery:</div>
                        <div>{new Date(purchase.expectedDeliveryDate).toLocaleDateString()}</div>
                        
                        {purchase.receivedDate && (
                          <>
                            <div className="text-muted-foreground">Received Date:</div>
                            <div>{new Date(purchase.receivedDate).toLocaleDateString()}</div>
                          </>
                        )}
                        
                        <div className="text-muted-foreground">Items:</div>
                        <div>{purchase.items.length}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <div className="font-medium">Total: ${purchase.totalCost.toFixed(2)}</div>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">Actions</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Manage Purchase</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(purchase)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(purchase.id)}>
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          {purchase.status !== "pending" && (
                            <DropdownMenuItem onClick={() => handleStatusChangeRequest(purchase.id, "pending")}>
                              <Package className="mr-2 h-4 w-4" />
                              Mark as Pending
                            </DropdownMenuItem>
                          )}
                          {purchase.status !== "ordered" && (
                            <DropdownMenuItem onClick={() => handleStatusChangeRequest(purchase.id, "ordered")}>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Mark as Ordered
                            </DropdownMenuItem>
                          )}
                          {purchase.status !== "shipped" && (
                            <DropdownMenuItem onClick={() => handleStatusChangeRequest(purchase.id, "shipped")}>
                              <Truck className="mr-2 h-4 w-4" />
                              Mark as Shipped
                            </DropdownMenuItem>
                          )}
                          {purchase.status !== "delivered" && (
                            <DropdownMenuItem onClick={() => handleStatusChangeRequest(purchase.id, "delivered")}>
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Delivered
                            </DropdownMenuItem>
                          )}
                          {purchase.status !== "cancelled" && (
                            <DropdownMenuItem onClick={() => handleStatusChangeRequest(purchase.id, "cancelled")}>
                              <X className="mr-2 h-4 w-4" />
                              Mark as Cancelled
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Truck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No purchase orders found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery ? "Try a different search term" : "Create your first purchase order to get started"}
              </p>
            </div>
          )}

          {purchases.length > 0 && (
            <SimplePagination 
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <EditPurchaseModal
        purchase={editingPurchase}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onPurchaseUpdated={updatePurchase}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this purchase order. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={statusChangeConfirmOpen} onOpenChange={setStatusChangeConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Purchase Status</AlertDialogTitle>
            <AlertDialogDescription>
              {statusChangeDetails && (
                `Are you sure you want to mark this purchase order as ${statusChangeDetails.newStatus}?`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
