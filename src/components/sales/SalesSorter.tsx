
import { Sale, SaleStatus } from "@/types/sale";

export type SortField = "saleNumber" | "customerName" | "date" | "total" | "status";
export type SortDirection = "asc" | "desc";

export const getSortedSales = (
  sales: Sale[], 
  sortField: SortField, 
  sortDirection: SortDirection
): Sale[] => {
  return [...sales].sort((a, b) => {
    let valueA: any;
    let valueB: any;

    switch (sortField) {
      case "saleNumber":
        valueA = a.saleNumber;
        valueB = b.saleNumber;
        break;
      case "customerName":
        valueA = a.customerName;
        valueB = b.customerName;
        break;
      case "date":
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
        break;
      case "total":
        valueA = a.total;
        valueB = b.total;
        break;
      case "status":
        valueA = a.status;
        valueB = b.status;
        break;
      default:
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
    }

    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
};

export const getSortOptions = () => [
  { field: 'saleNumber', label: 'Sale Number' },
  { field: 'customerName', label: 'Customer Name' },
  { field: 'date', label: 'Date' },
  { field: 'total', label: 'Total' },
  { field: 'status', label: 'Status' },
];
