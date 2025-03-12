
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown, LayoutIcon, Rows, GripHorizontal, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortField = "orderNumber" | "customerName" | "createdAt" | "total" | "status";
type SortDirection = "asc" | "desc";

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [badgeDisplayMode, setBadgeDisplayMode] = useState<"inline" | "stacked">("inline");
  const [viewMode, setViewMode] = useState<"card" | "table" | "collapsible">("card");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);
  
  const { orders, totalOrders, isLoading, page, setPage, pageSize, setPageSize } = useOrders(
    currentPage, 
    12, 
    searchQuery,
    statusFilter
  );
  
  const handleViewDetails = (order: Order) => {
    console.log("Viewing details for order:", order);
  };

  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  const toggleBadgeDisplayMode = () => {
    setBadgeDisplayMode(prev => prev === "inline" ? "stacked" : "inline");
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Order
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {viewMode === "card" ? (
                  <GripHorizontal className="h-4 w-4" />
                ) : viewMode === "table" ? (
                  <Rows className="h-4 w-4" />
                ) : (
                  <Rows className="h-4 w-4" />
                )}
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Layout</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setViewMode("card")}>
                <GripHorizontal className="h-4 w-4 mr-2" />
                Card View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("table")}>
                <Rows className="h-4 w-4 mr-2" />
                Table View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("collapsible")}>
                <LayoutIcon className="h-4 w-4 mr-2" />
                Collapsible View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {viewMode === "card" && (
            <Button variant="outline" className="gap-2" onClick={toggleBadgeDisplayMode}>
              <LayoutIcon className="h-4 w-4" />
              {badgeDisplayMode === "inline" ? "Stacked" : "Inline"} Display
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleSort('orderNumber')}>
                Order Number
                {sortField === 'orderNumber' && (
                  sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('customerName')}>
                Customer Name
                {sortField === 'customerName' && (
                  sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('createdAt')}>
                Date
                {sortField === 'createdAt' && (
                  sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('total')}>
                Total
                {sortField === 'total' && (
                  sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('status')}>
                Status
                {sortField === 'status' && (
                  sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSortDirection('asc')}>
                Ascending
                {sortDirection === 'asc' && <ChevronUp className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortDirection('desc')}>
                Descending
                {sortDirection === 'desc' && <ChevronDown className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{(currentPage - 1) * 12 + 1}</span> to{" "}
              <span className="font-medium">{Math.min(currentPage * 12, totalOrders)}</span> of{" "}
              <span className="font-medium">{totalOrders}</span> orders
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
    </MainLayout>
  );
}
