
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inventoryItems } from "@/data/inventoryData";
import { Gem } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TopProfitableItems = () => {
  const navigate = useNavigate();
  
  // Calculate profit for each item (RRP - Cost) * Stock
  const profitableItems = React.useMemo(() => {
    return inventoryItems
      .filter(item => item.rrp && item.cost && item.stock > 0) // Ensure we have necessary data
      .map(item => {
        const profit = (item.rrp - item.cost) * item.stock;
        return {
          id: item.id,
          name: item.name,
          sku: item.sku,
          profitPerUnit: item.rrp - item.cost,
          stock: item.stock,
          totalProfit: profit,
          category: item.category
        };
      })
      .sort((a, b) => b.totalProfit - a.totalProfit) // Sort by total profit descending
      .slice(0, 10); // Get top 10
  }, []);

  const handleItemClick = (sku: string) => {
    // Create a URLSearchParams object to build the query string properly
    const params = new URLSearchParams();
    
    // Only add the search parameter
    if (sku) params.append("search", sku);
    
    console.log(`Navigating to inventory with params: search=${sku}`);
    navigate(`/inventory?${params.toString()}`);
  };

  return (
    <Card className="col-span-7">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-medium">
          Top 10 Most Profitable Items
        </CardTitle>
        <Gem className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {profitableItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium py-2 px-1">Name</th>
                    <th className="text-left font-medium py-2 px-1">SKU</th>
                    <th className="text-right font-medium py-2 px-1">Profit/Unit</th>
                    <th className="text-right font-medium py-2 px-1">Stock</th>
                    <th className="text-right font-medium py-2 px-1">Total Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {profitableItems.map((item) => (
                    <tr 
                      key={item.id} 
                      className="border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleItemClick(item.sku)}
                    >
                      <td className="py-2 px-1">{item.name}</td>
                      <td className="py-2 px-1 text-muted-foreground">{item.sku}</td>
                      <td className="py-2 px-1 text-right">${item.profitPerUnit.toFixed(2)}</td>
                      <td className="py-2 px-1 text-right">{item.stock}</td>
                      <td className="py-2 px-1 text-right font-medium">
                        ${item.totalProfit.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No profit data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
