
import React, { useState } from "react";
import { format } from "date-fns";
import { Order } from "@/types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleOrderRowProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

export const CollapsibleOrderRow: React.FC<CollapsibleOrderRowProps> = ({ 
  order, 
  onViewDetails 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <div className="border rounded-md overflow-hidden animate-fade-in">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <div className="flex items-center bg-card hover:bg-secondary/50 transition-colors duration-200 p-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 mr-2">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          
          <div className="grid grid-cols-6 flex-1 text-sm">
            <div className="font-medium">{order.orderNumber}</div>
            <div>{order.customer.name}</div>
            <div>{formatDate(order.createdAt)}</div>
            <div>${order.grandTotal.toFixed(2)}</div>
            <div>{order.items.length} items</div>
            <div className="flex justify-between items-center">
              <OrderStatusBadge status={order.status} />
              <Button 
                variant="ghost" 
                size="sm"
                className="ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(order);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <CollapsibleContent className="bg-muted/30 p-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Order Details</h4>
              <div className="space-y-1 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Date:</div>
                  <div>{formatDate(order.createdAt)}</div>
                  
                  <div className="text-muted-foreground">Payment Method:</div>
                  <div>{order.paymentMethod}</div>
                  
                  <div className="text-muted-foreground">Status:</div>
                  <div><OrderStatusBadge status={order.status} /></div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Shipping Address</h4>
              <div className="space-y-1 text-sm">
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && (
                  <p>{order.shippingAddress.line2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Items</h4>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-2">{item.product.name}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-2">${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/50">
                  <tr className="border-t">
                    <td colSpan={3} className="px-4 py-2 text-right font-medium">Subtotal:</td>
                    <td className="px-4 py-2">${order.total.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right font-medium">Tax:</td>
                    <td className="px-4 py-2">${order.tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right font-medium">Shipping:</td>
                    <td className="px-4 py-2">${order.shipping.toFixed(2)}</td>
                  </tr>
                  {order.discount && (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right font-medium">Discount:</td>
                      <td className="px-4 py-2">-${order.discount.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right font-medium">Grand Total:</td>
                    <td className="px-4 py-2 font-medium">${order.grandTotal.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={() => onViewDetails(order)}>
              <Eye className="h-4 w-4 mr-2" />
              View Full Details
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
