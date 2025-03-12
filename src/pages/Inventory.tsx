import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown, GridIcon, TableIcon, ChevronUp, ChevronDown, ArrowUpAZ, ArrowDownAz, ArrowUp10, ArrowDown10 } from "lucide-react";
import { useInventoryItems } from "@/hooks/useInventoryItems";
import { InventoryItemCard } from "@/components/inventory/InventoryItemCard";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";
import { EditInventoryItem } from "@/components/inventory/EditInventoryItem";
import { TransferInventoryItem } from "@/components/inventory/TransferInventoryItem";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  const { items, isLoading, totalItems, updateItem } = useInventoryItems(
    currentPage, 
    searchQuery,
    sortField,
    sortDirection
  );
  
  const { toast } = useToast();
  
  const itemsPerPage = 20;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    
    if (field === 'name' || field === 'category' || field === 'sku' || field === 'location') {
      return sortDirection === 'asc' ? <ArrowUpAZ className="h-4 w-4 ml-1" /> : <ArrowDownAz className="h-4 w-4 ml-1" />;
    } else {
      return sortDirection === 'asc' ? <ArrowUp10 className="h-4 w-4 ml-1" /> : <ArrowDown10 className="h-4 w-4 ml-1" />;
    }
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

  const handleSaveItem = (updatedItem: InventoryItem) => {
    updateItem(updatedItem);
    toast({
      title: "Item updated",
      description: `Successfully updated ${updatedItem.name}`,
    });
  };

  const handleTransferItem = (item: InventoryItem, quantity: number, newLocation: string) => {
    const sourceItem = { ...item, stock: item.stock - quantity };
    
    const existingDestItem = items.find(i => 
      i.sku === item.sku && i.location === newLocation
    );
    
    if (existingDestItem) {
      const destinationItem = { 
        ...existingDestItem, 
        stock: existingDestItem.stock + quantity 
      };
      updateItem(destinationItem);
    }
    
    updateItem(sourceItem);
    
    toast({
      title: "Inventory transferred",
      description: `Successfully transferred ${quantity} units of ${item.name} to ${newLocation}`,
    });
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Inventory</h1>
        <Button>Add New Item</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-muted" : ""}
          >
            <GridIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setViewMode("table")}
            className={viewMode === "table" ? "bg-muted" : ""}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort {getSortIcon(sortField)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleSort('name')}>
                Name {getSortIcon('name')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('sku')}>
                SKU {getSortIcon('sku')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('category')}>
                Category {getSortIcon('category')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('cost')}>
                Cost {getSortIcon('cost')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('rrp')}>
                RRP {getSortIcon('rrp')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('stock')}>
                Stock {getSortIcon('stock')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('location')}>
                Location {getSortIcon('location')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSortDirection('asc')}>
                Ascending {sortDirection === 'asc' && <ArrowUpAZ className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortDirection('desc')}>
                Descending {sortDirection === 'desc' && <ArrowDownAz className="h-4 w-4 ml-auto" />}
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
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {items.map((item) => (
                <InventoryItemCard 
                  key={item.id} 
                  item={item} 
                  onSave={handleSaveItem}
                  onTransfer={handleTransferItem}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-md border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <SortHeader field="sku" label="SKU" />
                      <SortHeader field="name" label="Name" />
                      <SortHeader field="category" label="Category" />
                      <SortHeader field="cost" label="Cost" />
                      <SortHeader field="rrp" label="RRP" />
                      <SortHeader field="stock" label="Stock" />
                      <SortHeader field="location" label="Location" />
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{item.sku}</td>
                        <td className="py-3 px-4 font-medium break-words max-w-[200px]">{item.name}</td>
                        <td className="py-3 px-4">{item.category}</td>
                        <td className="py-3 px-4">${item.cost.toFixed(2)}</td>
                        <td className="py-3 px-4">${item.rrp ? item.rrp.toFixed(2) : "-"}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.stock <= item.lowStockThreshold
                              ? "bg-red-100 text-red-800"
                              : item.stock <= item.lowStockThreshold * 2
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                            {item.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4">{item.location}</td>
                        <td className="py-3 px-4">
                          <div className="flex">
                            <EditInventoryItem item={item} onSave={handleSaveItem} />
                            <TransferInventoryItem item={item} onTransfer={handleTransferItem} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
              <span className="font-medium">{totalItems}</span> items
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
