
import React from "react";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/order";

const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "outline" },
  processing: { label: "Processing", variant: "secondary" },
  shipped: { label: "Shipped", variant: "default" },
  delivered: { label: "Delivered", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  returned: { label: "Returned", variant: "destructive" },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className={status === "shipped" ? "bg-blue-500 hover:bg-blue-600" : ""}>
      {config.label}
    </Badge>
  );
};
