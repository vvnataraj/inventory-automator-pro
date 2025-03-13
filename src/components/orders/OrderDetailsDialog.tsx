
import React from "react";
import { Order } from "@/types/order";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { Printer, Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const printInvoice = () => {
    const doc = new jsPDF();
    
    // Add company header
    doc.setFontSize(20);
    doc.text("INVOICE", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.text("Your Company Name", 20, 30);
    doc.text("123 Business Street", 20, 35);
    doc.text("City, State, Zip", 20, 40);
    doc.text("Phone: (123) 456-7890", 20, 45);
    
    // Add invoice info
    doc.setFontSize(12);
    doc.text(`Invoice #: ${order.orderNumber}`, 150, 30, { align: "right" });
    doc.text(`Date: ${formatDate(order.createdAt)}`, 150, 35, { align: "right" });
    doc.text(`Status: ${order.status}`, 150, 40, { align: "right" });
    
    // Add customer info
    doc.setFontSize(12);
    doc.text("Bill To:", 20, 60);
    doc.text(order.customer.name, 20, 65);
    doc.text(order.shippingAddress.line1, 20, 70);
    if (order.shippingAddress.line2) {
      doc.text(order.shippingAddress.line2, 20, 75);
    }
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`, 20, order.shippingAddress.line2 ? 80 : 75);
    doc.text(order.shippingAddress.country, 20, order.shippingAddress.line2 ? 85 : 80);
    
    // Add order items table
    const tableColumn = ["Item", "Quantity", "Price", "Subtotal"];
    const tableRows = order.items.map(item => [
      item.product.name,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${item.subtotal.toFixed(2)}`,
    ]);
    
    const startY = order.shippingAddress.line2 ? 95 : 90;
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: startY,
      theme: 'grid',
    });
    
    // Add totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.text("Subtotal:", 130, finalY);
    doc.text(`$${order.total.toFixed(2)}`, 170, finalY, { align: "right" });
    
    doc.text("Tax:", 130, finalY + 5);
    doc.text(`$${order.tax.toFixed(2)}`, 170, finalY + 5, { align: "right" });
    
    doc.text("Shipping:", 130, finalY + 10);
    doc.text(`$${order.shipping.toFixed(2)}`, 170, finalY + 10, { align: "right" });
    
    if (order.discount) {
      doc.text("Discount:", 130, finalY + 15);
      doc.text(`-$${order.discount.toFixed(2)}`, 170, finalY + 15, { align: "right" });
    }
    
    const grandTotalY = order.discount ? finalY + 20 : finalY + 15;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("Grand Total:", 130, grandTotalY);
    doc.text(`$${order.grandTotal.toFixed(2)}`, 170, grandTotalY, { align: "right" });
    doc.setFont(undefined, 'normal');
    
    // Add footer
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 105, grandTotalY + 20, { align: "center" });
    
    // Save or print the document
    try {
      doc.save(`Invoice-${order.orderNumber}.pdf`);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Order #{order.orderNumber}</span>
            <OrderStatusBadge status={order.status} />
          </DialogTitle>
          <DialogDescription>
            {formatDate(order.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Customer Information</h3>
              <div className="mt-1">
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm">{order.customer.email}</p>
                {order.customer.phone && <p className="text-sm">{order.customer.phone}</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Shipping Address</h3>
              <div className="mt-1 text-sm">
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Payment Details</h3>
              <div className="mt-1 text-sm">
                <p><span className="font-medium">Method:</span> {order.paymentMethod}</p>
                <p><span className="font-medium">Status:</span> {order.status}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Order Summary</h3>
            <div className="rounded-md border bg-muted/30">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">Product</th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">Qty</th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">Price</th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 px-4 text-sm">{item.product.name}</td>
                      <td className="py-2 px-4 text-sm">{item.quantity}</td>
                      <td className="py-2 px-4 text-sm">${item.price.toFixed(2)}</td>
                      <td className="py-2 px-4 text-sm">${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/30">
                  <tr>
                    <td colSpan={3} className="py-2 px-4 text-sm text-right">Subtotal:</td>
                    <td className="py-2 px-4 text-sm">${order.total.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-2 px-4 text-sm text-right">Tax:</td>
                    <td className="py-2 px-4 text-sm">${order.tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-2 px-4 text-sm text-right">Shipping:</td>
                    <td className="py-2 px-4 text-sm">${order.shipping.toFixed(2)}</td>
                  </tr>
                  {order.discount && (
                    <tr>
                      <td colSpan={3} className="py-2 px-4 text-sm text-right">Discount:</td>
                      <td className="py-2 px-4 text-sm">-${order.discount.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="font-medium">
                    <td colSpan={3} className="py-2 px-4 text-sm text-right">Grand Total:</td>
                    <td className="py-2 px-4 text-sm">${order.grandTotal.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
            <p className="text-sm bg-muted/30 p-3 rounded-md">{order.notes}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </DialogClose>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={printInvoice}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={printInvoice}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
