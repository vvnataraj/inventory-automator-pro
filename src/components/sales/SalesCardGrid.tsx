
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types/sale";

interface SalesCardGridProps {
  sales: Sale[];
}

export const SalesCardGrid: React.FC<SalesCardGridProps> = ({ sales }) => {
  if (sales.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">No sales found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sales.map((sale) => (
        <Card key={sale.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold">{sale.saleNumber}</h3>
                <p className="text-sm text-muted-foreground">{sale.customerName}</p>
              </div>
              <div className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                {sale.status}
              </div>
            </div>
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span>{new Date(sale.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items:</span>
                <span>{sale.items.length}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Total:</span>
                <span>${sale.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm">View</Button>
              <Button variant="outline" size="sm">Invoice</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
