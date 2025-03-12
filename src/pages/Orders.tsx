
import React, { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus } from "@/types/order";
import { Pagination } from "@/components/ui/pagination";
import { 
  Calendar, 
  CreditCard, 
  Download, 
  Filter, 
  Package, 
  Search, 
  Truck, 
  X 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const OrdersPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { 
    orders, 
    totalOrders, 
    isLoading, 
    page, 
    pageSize, 
    searchQuery, 
    statusFilter,
    setPage, 
    setSearchQuery, 
    setStatusFilter 
  } = useOrders(1, 9);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleFilterByStatus = (status: OrderStatus | undefined) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleExportOrder = () => {
    toast({
      title: "Order exported",
      description: "The order details have been exported to CSV.",
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const totalPages = Math.ceil(totalOrders / pageSize);

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage and view all orders ({totalOrders} total)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => setSearchQuery("")}>
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          variant={statusFilter === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterByStatus(undefined)}
        >
          All
        </Button>
        <Button
          variant={statusFilter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterByStatus("pending")}
        >
          <Package className="mr-2 h-4 w-4" />
          Pending
        </Button>
        <Button
          variant={statusFilter === "processing" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterByStatus("processing")}
        >
          <Package className="mr-2 h-4 w-4" />
          Processing
        </Button>
        <Button
          variant={statusFilter === "shipped" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterByStatus("shipped")}
        >
          <Truck className="mr-2 h-4 w-4" />
          Shipped
        </Button>
        <Button
          variant={statusFilter === "delivered" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterByStatus("delivered")}
        >
          <Truck className="mr-2 h-4 w-4" />
          Delivered
        </Button>
        <Button
          variant={statusFilter === "cancelled" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterByStatus("cancelled")}
        >
          <X className="mr-2 h-4 w-4" />
          Cancelled
        </Button>
        <Button
          variant={statusFilter === "returned" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterByStatus("returned")}
        >
          <X className="mr-2 h-4 w-4" />
          Returned
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(9).fill(0).map((_, i) => (
            <Card key={i} className="h-64">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </CardHeader>
              <CardContent className="pb-0">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <div className="h-9 bg-gray-200 rounded animate-pulse w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-12 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No orders found</h3>
          <p className="text-muted-foreground">
            Try changing your search query or removing filters.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onViewDetails={handleViewDetails} 
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && handleCloseDetails()}>
        {selectedOrder && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Order {selectedOrder.orderNumber}</span>
                <OrderStatusBadge status={selectedOrder.status} />
              </DialogTitle>
              <DialogDescription>
                Placed on {formatDate(selectedOrder.createdAt)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Customer</h4>
                  <p className="text-sm">{selectedOrder.customer.name}</p>
                  <p className="text-sm">{selectedOrder.customer.email}</p>
                  {selectedOrder.customer.phone && (
                    <p className="text-sm">{selectedOrder.customer.phone}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Shipping Address</h4>
                  <p className="text-sm">{selectedOrder.shippingAddress.line1}</p>
                  {selectedOrder.shippingAddress.line2 && (
                    <p className="text-sm">{selectedOrder.shippingAddress.line2}</p>
                  )}
                  <p className="text-sm">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p className="text-sm">{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Order Items</h4>
                <div className="border rounded-md">
                  {selectedOrder.items.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-3 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        {item.product.imageUrl ? (
                          <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden">
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name} 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">SKU: {item.product.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{item.quantity} × ${item.price.toFixed(2)}</p>
                        <p className="text-sm font-medium">${item.subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Payment</h4>
                  <div className="flex items-center gap-1 text-sm">
                    <CreditCard className="h-4 w-4" />
                    <span>{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Shipping</h4>
                  <div className="flex items-center gap-1 text-sm">
                    <Truck className="h-4 w-4" />
                    <span>Standard Shipping</span>
                  </div>
                  {selectedOrder.shippedAt && (
                    <p className="text-sm mt-1">Shipped: {formatDate(selectedOrder.shippedAt)}</p>
                  )}
                  {selectedOrder.deliveredAt && (
                    <p className="text-sm">Delivered: {formatDate(selectedOrder.deliveredAt)}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${selectedOrder.shipping.toFixed(2)}</span>
                </div>
                {selectedOrder.discount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium pt-1 border-t">
                  <span>Total</span>
                  <span>${selectedOrder.grandTotal.toFixed(2)}</span>
                </div>
              </div>
              
              {selectedOrder.notes && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Notes</h4>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCloseDetails}>
                  Close
                </Button>
                <Button onClick={handleExportOrder}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default OrdersPage;
