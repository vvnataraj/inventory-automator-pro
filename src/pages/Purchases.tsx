
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus } from "lucide-react";
import { usePurchases } from "@/hooks/usePurchases";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default function Purchases() {
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    purchases, 
    totalPurchases, 
    currentPage, 
    setCurrentPage, 
    isLoading 
  } = usePurchases(1, searchQuery);
  
  const itemsPerPage = 20;
  const totalPages = Math.ceil(totalPurchases / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "ordered":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">Purchase Orders</h1>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Purchase Order
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search purchase orders..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {purchases.map((purchase) => (
                  <Card key={purchase.id} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{purchase.poNumber}</h3>
                          <p className="text-sm text-muted-foreground">{purchase.supplier}</p>
                        </div>
                        <Badge className={getStatusColor(purchase.status)}>
                          {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 flex-grow">
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Order Date</p>
                            <p className="font-medium">
                              {new Date(purchase.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Expected Delivery</p>
                            <p className="font-medium">
                              {new Date(purchase.expectedDeliveryDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">Items</p>
                          <p className="font-medium">{purchase.items.length} items</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">Total Cost</p>
                          <p className="font-semibold">${purchase.totalCost.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalPurchases)}</span> of{" "}
                  <span className="font-medium">{totalPurchases}</span> items
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
