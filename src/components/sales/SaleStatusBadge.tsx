
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
        return { label: "Completed", variant: "success" as const };
      case "pending":
        return { label: "Pending", variant: "warning" as const };
      case "cancelled":
        return { label: "Cancelled", variant: "destructive" as const };
      case "refunded":
        return { label: "Refunded", variant: "outline" as const };
      default:
        return { label: status, variant: "default" as const };
    }
  };

  const { label, variant } = getStatusConfig(status);

  // Map our custom variants to the allowed Badge variants
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
  let className = "";
  
  if (variant === "success") {
    badgeVariant = "default";
    className = "bg-green-500 hover:bg-green-600";
  } else if (variant === "warning") {
    badgeVariant = "secondary";
    className = "bg-yellow-500 hover:bg-yellow-600 text-primary-foreground";
  } else {
    badgeVariant = variant; // For "destructive" and "outline" which are valid Badge variants
  }

  return (
    <Badge
      variant={badgeVariant}
      className={className}
    >
      {label}
    </Badge>
  );
};
