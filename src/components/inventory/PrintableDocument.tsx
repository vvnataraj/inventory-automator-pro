
import React from "react";
import { TransferData } from "@/types/inventory";
import { format } from "date-fns";

interface PrintableDocumentProps {
  transferData: TransferData;
}

export const PrintableDocument = React.forwardRef<HTMLDivElement, PrintableDocumentProps>(
  ({ transferData }, ref) => {
    return (
      <div ref={ref} className="my-4 p-4 border border-gray-200 rounded-lg">
        <div className="text-center mb-6">
          {/* App logo and name */}
          <div className="flex justify-center items-center mb-2">
            <img 
              src="/lovable-uploads/f849ba67-c0f4-4e4b-9f84-e91df8d9b64d.png" 
              alt="STOCKtopus Logo" 
              className="h-16 w-16 object-contain mr-2"
              style={{ mixBlendMode: 'multiply' }}
            />
            <span className="font-bold text-3xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              STOCK<span className="text-purple-600">topus</span>
            </span>
          </div>
          <h2 className="text-xl font-bold">PACKING SLIP</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Reference #:</p>
            <p className="font-medium">{transferData.referenceNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date:</p>
            <p className="font-medium">{format(new Date(transferData.date), "MMM dd, yyyy")}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">From Location:</p>
            <p className="font-medium">{transferData.fromLocation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">To Location:</p>
            <p className="font-medium">{transferData.toLocation}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Item Details:</p>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">SKU</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">{transferData.item.sku}</td>
                <td className="border border-gray-300 px-4 py-2">{transferData.item.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {transferData.item.description.substring(0, 30)}
                  {transferData.item.description.length > 30 ? "..." : ""}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">{transferData.quantity}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Prepared By:</p>
            <div className="border-b border-gray-400 h-6 mt-1"></div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Received By:</p>
            <div className="border-b border-gray-400 h-6 mt-1"></div>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500">Date:</p>
          <div className="border-b border-gray-400 h-6 mt-1 w-1/2"></div>
        </div>
      </div>
    );
  }
);

PrintableDocument.displayName = "PrintableDocument";
