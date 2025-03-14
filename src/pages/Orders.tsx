
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronUp, ChevronDown } from "lucide-react";
import { useOrdersWithDB } from "@/hooks/useOrdersWithDB"; // Updated import
import { OrderCard } from "@/components/orders/OrderCard";
import { MainLayout } from "@/components/layout/MainLayout";
import { Order, OrderStatus } from "@/types/order";
import { CollapsibleOrderRow } from "@/components/orders/CollapsibleOrderRow";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { ListControls, ViewMode } from "@/components/common/ListControls";
import { OrderDetailsDialog } from "@/components/orders/OrderDetailsDialog";
import { useUserRoles } from "@/hooks/useUserRoles";
import { InventoryPagination } from "@/components/inventory/InventoryPagination"; // Added for better pagination

type SortField = "orderNumber" | "customerName" | "createdAt" | "total" | "status";
type SortDirection = "asc" | "desc";

export default function Orders() {
  const { isManager } = useUserRoles();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [badgeDisplayMode, setBadgeDisplayMode] = useState<"inline" | "stacked">("inline");
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  
  // Updated to use the database hook
  const { orders, totalOrders, isLoading, page, setPage, pageSize, setPageSize } = useOrdersWithDB(
    1, 
    12, 
    searchQuery,
    statusFilter
  );
  
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleCloseOrderDetails = () => {
    setIsOrderDetailsOpen(false);
  };

  const totalPages = Math.ceil(totalOrders / pageSize);

  const toggleBadgeDisplayMode = () => {
    setBadgeDisplayMode(prev => prev === "inline" ? "stacked" : "inline");
  };

  const handleSort = (field: string) => {
    const orderField = field as SortField;
    if (orderField === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(orderField);
      setSortDirection('asc');
    }
  };

  const sortOptions = [
    { field: 'orderNumber', label: 'Order Number' },
    { field: 'customerName', label: 'Customer Name' },
    { field: 'createdAt', label: 'Date' },
    { field: 'total', label: 'Total' },
    { field: 'status', label: 'Status' },
  ];

  const getSortedOrders = () => {
    return [...orders].sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (sortField) {
        case "orderNumber":
          valueA = a.orderNumber;
          valueB = b.orderNumber;
          break;
        case "customerName":
          valueA = a.customer.name;
          valueB = b.customer.name;
          break;
        case "createdAt":
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        case "total":
          valueA = a.grandTotal;
          valueB = b.grandTotal;
          break;
        case "status":
          valueA = a.status;
          valueB = b.status;
          break;
        default:
          valueA = a.createdAt;
          valueB = b.createdAt;
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const SortHeader = ({ field, label }: { field: SortField, label: string }) => (
    <th 
      className="py-3 px-4 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </th>
  );

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
        <div className="flex gap-2">
          {isManager() && (
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Order
            </Button>
          )}
          {viewMode === "card" && (
            <Button variant="outline" className="gap-2" onClick={toggleBadgeDisplayMode}>
              {badgeDisplayMode === "inline" ? "Stacked" : "Inline"} Display
            </Button>
          )}
        </div>
      </div>

      <ListControls 
        searchPlaceholder="Search orders..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode as ViewMode}
        onViewModeChange={setViewMode}
        availableViewModes={["card", "table", "collapsible"]}
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
          {viewMode === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
              {getSortedOrders().map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  badgeDisplayMode={badgeDisplayMode}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {viewMode === "collapsible" && (
            <div className="flex flex-col gap-2 mb-4">
              {getSortedOrders().map((order) => (
                <CollapsibleOrderRow 
                  key={order.id} 
                  order={order}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {viewMode === "table" && (
            <div className="rounded-md border bg-card">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortHeader field="orderNumber" label="Order #" />
                      <SortHeader field="customerName" label="Customer" />
                      <SortHeader field="createdAt" label="Date" />
                      <TableHead>Items</TableHead>
                      <SortHeader field="total" label="Total" />
                      <SortHeader field="status" label="Status" />
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSortedOrders().map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell>${order.grandTotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <OrderStatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(order)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <InventoryPagination
            currentPage={page}
            itemsPerPage={pageSize}
            totalItems={totalOrders}
            onPageChange={setPage}
          />
        </>
      )}

      <OrderDetailsDialog 
        order={selectedOrder} 
        isOpen={isOrderDetailsOpen} 
        onClose={handleCloseOrderDetails} 
      />
    </MainLayout>
  );
}
