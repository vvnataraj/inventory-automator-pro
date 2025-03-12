
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { useInventoryItems } from "@/hooks/useInventoryItems";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { items, isLoading, totalItems } = useInventoryItems(currentPage, searchQuery);
  
  const itemsPerPage = 20;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
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
              <div className="rounded-md border bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground">SKU</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground">Name</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground">Category</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground">Price</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground">Stock</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{item.sku}</td>
                          <td className="py-3 px-4 font-medium">{item.name}</td>
                          <td className="py-3 px-4">{item.category}</td>
                          <td className="py-3 px-4">${item.price.toFixed(2)}</td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

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
        </main>
      </div>
    </div>
  );
}
