
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Edit, 
  Trash2, 
  Check, 
  X,
  ShoppingCart,
  Truck 
} from "lucide-react";
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
import { usePurchases } from "@/hooks/usePurchases";
import { MainLayout } from "@/components/layout/MainLayout";
import { PurchaseStatusBadge } from "@/components/purchases/PurchaseStatusBadge";
import { AddPurchaseModal } from "@/components/purchases/AddPurchaseModal";
import { EditPurchaseModal } from "@/components/purchases/EditPurchaseModal";
import { Purchase, PurchaseStatus } from "@/types/purchase";

export default function Purchases() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { 
    purchases, 
    totalPurchases, 
    isLoading,
    addPurchase,
    updatePurchase,
    deletePurchase,
    updatePurchaseStatus
  } = usePurchases(currentPage, searchQuery);
  
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);
  
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalPurchases / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleEdit = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setIsEditModalOpen(true);
  };

  const handleDelete = (purchaseId: string) => {
    setPurchaseToDelete(purchaseId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (purchaseToDelete) {
      deletePurchase(purchaseToDelete);
      setPurchaseToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const handleStatusChange = (purchaseId: string, status: PurchaseStatus) => {
    updatePurchaseStatus(purchaseId, status);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Purchases</h1>
        <AddPurchaseModal onPurchaseAdded={addPurchase} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search purchases..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {purchases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchases.map((purchase) => (
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
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(purchase.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          {purchase.status !== "pending" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(purchase.id, "pending")}>
                              Mark as Pending
                            </DropdownMenuItem>
                          )}
                          {purchase.status !== "ordered" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(purchase.id, "ordered")}>
                              Mark as Ordered
                            </DropdownMenuItem>
                          )}
                          {purchase.status !== "shipped" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(purchase.id, "shipped")}>
                              Mark as Shipped
                            </DropdownMenuItem>
                          )}
                          {purchase.status !== "delivered" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(purchase.id, "delivered")}>
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Delivered
                            </DropdownMenuItem>
                          )}
                          {purchase.status !== "cancelled" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(purchase.id, "cancelled")}>
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
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalPurchases)}</span> of{" "}
                <span className="font-medium">{totalPurchases}</span> purchases
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
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
    </MainLayout>
  );
}
