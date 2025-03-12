
import { Badge } from "@/components/ui/badge";
import { PurchaseStatus } from "@/types/purchase";

interface PurchaseStatusBadgeProps {
  status: PurchaseStatus;
}

export function PurchaseStatusBadge({ status }: PurchaseStatusBadgeProps) {
  const getStatusConfig = (status: PurchaseStatus) => {
    switch (status) {
      case "pending":
        return { className: "bg-orange-100 text-orange-800", label: "Pending" };
      case "ordered":
        return { className: "bg-blue-100 text-blue-800", label: "Ordered" };
      case "shipped":
        return { className: "bg-purple-100 text-purple-800", label: "Shipped" };
      case "delivered":
        return { className: "bg-green-100 text-green-800", label: "Delivered" };
      case "cancelled":
        return { className: "bg-red-100 text-red-800", label: "Cancelled" };
      default:
        return { className: "bg-gray-100 text-gray-800", label: status.charAt(0).toUpperCase() + status.slice(1) };
    }
  };

  const { className, label } = getStatusConfig(status);

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}
