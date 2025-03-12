
import React from "react";
import { Badge } from "@/components/ui/badge";
import { SaleStatus } from "@/types/sale";

interface SaleStatusBadgeProps {
  status: SaleStatus;
}

export const SaleStatusBadge: React.FC<SaleStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: SaleStatus) => {
    switch (status) {
      case "completed":
        return { label: "Completed", variant: "success" };
      case "pending":
        return { label: "Pending", variant: "warning" };
      case "cancelled":
        return { label: "Cancelled", variant: "destructive" };
      case "refunded":
        return { label: "Refunded", variant: "outline" };
      default:
        return { label: status, variant: "default" };
    }
  };

  const { label, variant } = getStatusConfig(status);

  return (
    <Badge
      variant={variant === "success" ? "default" : variant === "warning" ? "secondary" : variant}
      className={
        variant === "success" 
          ? "bg-green-500 hover:bg-green-600" 
          : variant === "warning" 
            ? "bg-yellow-500 hover:bg-yellow-600 text-primary-foreground" 
            : ""
      }
    >
      {label}
    </Badge>
  );
};
