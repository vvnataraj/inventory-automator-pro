
import React from "react";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/order";

const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
  pending: { label: "Pending", variant: "outline" },
  processing: { label: "Processing", variant: "secondary" },
  shipped: { label: "Shipped", variant: "default", className: "bg-blue-500 hover:bg-blue-600" },
  delivered: { label: "Delivered", variant: "default", className: "bg-green-500 hover:bg-green-600" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  returned: { label: "Returned", variant: "destructive", className: "bg-amber-500 hover:bg-amber-600" },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config.variant} 
      className={config.className || ""}
    >
      {config.label}
    </Badge>
  );
};
