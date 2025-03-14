
import { Badge } from "@/components/ui/badge";
import { PurchaseStatus } from "@/types/purchase";

interface PurchaseStatusBadgeProps {
  status: PurchaseStatus;
}

export function PurchaseStatusBadge({ status }: PurchaseStatusBadgeProps) {
  const getStatusConfig = (status: PurchaseStatus) => {
    switch (status) {
      case "pending":
        return { className: "bg-orange-100 text-orange-800 hover:bg-orange-200", label: "Pending" };
      case "ordered":
        return { className: "bg-blue-100 text-blue-800 hover:bg-blue-200", label: "Ordered" };
      case "shipped":
        return { className: "bg-purple-100 text-purple-800 hover:bg-purple-200", label: "Shipped" };
      case "delivered":
        return { className: "bg-green-100 text-green-800 hover:bg-green-200", label: "Delivered" };
      case "cancelled":
        return { className: "bg-red-100 text-red-800 hover:bg-red-200", label: "Cancelled" };
      default:
        // Since we've handled all cases in the PurchaseStatus type,
        // this default case should never execute, but TypeScript needs it
        const unknownStatus = status as string;
        return { 
          className: "bg-gray-100 text-gray-800", 
          label: unknownStatus ? unknownStatus.charAt(0).toUpperCase() + unknownStatus.slice(1) : 'Unknown'
        };
    }
  };

  const { className, label } = getStatusConfig(status);

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}
