
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, FileText, Box, ShoppingCart, BarChart3, CircleDollarSign, Truck, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Documentation() {
  const openEmailSupport = () => {
    window.location.href = "mailto:support@stocktopus.com";
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Documentation</h1>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="getting-started">
            <TabsList className="mb-4">
              <TabsTrigger value="getting-started" className="flex items-center gap-1">
                <Book className="h-4 w-4" />
                Getting Started
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-1">
                <Box className="h-4 w-4" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="sales" className="flex items-center gap-1">
                <CircleDollarSign className="h-4 w-4" />
                Sales
              </TabsTrigger>
              <TabsTrigger value="purchases" className="flex items-center gap-1">
                <Truck className="h-4 w-4" />
                Purchases
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="getting-started" className="space-y-4">
              <h2 className="text-2xl font-bold">Getting Started Guide</h2>
              <p>Welcome to our inventory management system. This guide will help you get familiar with the basic features and functionality.</p>
              
              <h3 className="text-xl font-semibold mt-4">System Requirements</h3>
              <p>Our system works best with the latest versions of Chrome, Firefox, Safari, or Edge browsers. Make sure your browser is up to date for the best experience.</p>
              
              <h3 className="text-xl font-semibold mt-4">First Steps</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Log in with your credentials</li>
                <li>Update your profile information</li>
                <li>Explore the dashboard to get familiar with key metrics</li>
                <li>Check your inventory items and verify stock levels</li>
              </ol>
              
              <h3 className="text-xl font-semibold mt-4">Navigation</h3>
              <p>The main navigation menu on the left side of the screen provides access to all major sections of the application:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Dashboard</strong> - Overview of key metrics and alerts</li>
                <li><strong>Inventory</strong> - Manage all your inventory items</li>
                <li><strong>Orders</strong> - Track and manage customer orders</li>
                <li><strong>Purchases</strong> - Handle supplier purchase orders</li>
                <li><strong>Sales</strong> - Record and analyze sales transactions</li>
                <li><strong>Analytics</strong> - View detailed reports and insights</li>
              </ul>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mt-6 border border-blue-100 dark:border-blue-800">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Need additional help?
                </h4>
                <p className="mt-2 text-blue-600 dark:text-blue-300">
                  If you need further assistance, our support team is ready to help you.
                </p>
                <div className="flex gap-3 mt-3">
                  <Button asChild>
                    <Link to="/support">Contact Support</Link>
                  </Button>
                  <Button variant="outline" onClick={openEmailSupport}>
                    Email Support
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-4">
              <h2 className="text-2xl font-bold">Inventory Management</h2>
              <p>Learn how to efficiently manage your inventory, add new items, update stock levels, and transfer items between locations.</p>
              
              <h3 className="text-xl font-semibold mt-4">Adding New Items</h3>
              <p>To add a new inventory item, navigate to the Inventory page and click the "Add Item" button. Fill out the required information and save the item.</p>
              
              <h3 className="text-xl font-semibold mt-4">Stock Adjustments</h3>
              <p>You can adjust stock levels by editing an item and updating the quantity field. All changes are logged automatically for audit purposes.</p>

              <h3 className="text-xl font-semibold mt-4">Item Categories</h3>
              <p>Items are organized by categories to help you quickly find what you need. Use the category filter in the inventory view to narrow down your search.</p>
              
              <h3 className="text-xl font-semibold mt-4">Managing Locations</h3>
              <p>You can track inventory across multiple locations. Use the Transfer feature to move items between locations while maintaining accurate stock counts.</p>
              
              <h3 className="text-xl font-semibold mt-4">Low Stock Alerts</h3>
              <p>The system automatically identifies items with stock levels below their reorder point. Check the Dashboard for a quick overview of items that need reordering.</p>
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-4">
              <h2 className="text-2xl font-bold">Order Processing</h2>
              <p>This section covers creating, managing, and fulfilling customer orders.</p>
              
              <h3 className="text-xl font-semibold mt-4">Creating Orders</h3>
              <p>To create a new order, go to the Orders section and click "New Order." Select the customer, add items from your inventory, and confirm the order.</p>
              
              <h3 className="text-xl font-semibold mt-4">Order Fulfillment</h3>
              <p>When an order is ready to be fulfilled, change its status to "In Progress" and assign it to a team member. Once shipped, update the status to "Shipped" and enter tracking information.</p>
              
              <h3 className="text-xl font-semibold mt-4">Order Statuses</h3>
              <p>Orders can have the following statuses:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>New</strong> - Order has been created but not yet processed</li>
                <li><strong>Processing</strong> - Order is being prepared for shipment</li>
                <li><strong>Shipped</strong> - Order has been shipped to the customer</li>
                <li><strong>Delivered</strong> - Order has been received by the customer</li>
                <li><strong>Cancelled</strong> - Order has been cancelled</li>
              </ul>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <h2 className="text-2xl font-bold">Reporting Features</h2>
              <p>Generate and analyze reports to gain insights into your business performance.</p>
              
              <h3 className="text-xl font-semibold mt-4">Sales Reports</h3>
              <p>View sales data by date range, product, or customer. Export reports to CSV or PDF formats for further analysis.</p>
              
              <h3 className="text-xl font-semibold mt-4">Inventory Reports</h3>
              <p>Monitor stock levels, identify slow-moving items, and forecast inventory needs based on historical data.</p>
              
              <h3 className="text-xl font-semibold mt-4">Dashboard Analytics</h3>
              <p>The Dashboard provides real-time insights through visualization of key metrics:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Total inventory value and distribution by category</li>
                <li>Low stock alerts for items that need reordering</li>
                <li>Monthly revenue trends and projections</li>
                <li>Top-selling and least profitable items</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-4">Data Export</h3>
              <p>Most reports can be exported to various formats for external use or presentation:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>CSV - For data analysis in spreadsheet software</li>
                <li>PDF - For printing or sharing formal reports</li>
                <li>Print view - For direct printing from the browser</li>
              </ul>
            </TabsContent>
            
            <TabsContent value="sales" className="space-y-4">
              <h2 className="text-2xl font-bold">Sales Management</h2>
              <p>Track and analyze your sales performance, manage transactions, and identify business opportunities.</p>
              
              <h3 className="text-xl font-semibold mt-4">Recording Sales</h3>
              <p>To record a new sale, navigate to the Sales page and click "Create Sale". Select the items sold, enter quantities, and apply any discounts.</p>
              
              <h3 className="text-xl font-semibold mt-4">Sales Analytics</h3>
              <p>The Sales section provides detailed analytics on your sales performance:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Sales trends over time</li>
                <li>Top-selling products</li>
                <li>Revenue by category</li>
                <li>Customer purchasing patterns</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-4">Managing Returns</h3>
              <p>When processing a return, locate the original sale in the system, select the items being returned, and adjust the inventory counts accordingly.</p>
            </TabsContent>
            
            <TabsContent value="purchases" className="space-y-4">
              <h2 className="text-2xl font-bold">Purchase Order Management</h2>
              <p>Create and manage purchase orders for replenishing your inventory from suppliers.</p>
              
              <h3 className="text-xl font-semibold mt-4">Creating Purchase Orders</h3>
              <p>To create a new purchase order, go to the Purchases section and click "Add Purchase". Select the supplier, add the items you wish to order, and specify quantities.</p>
              
              <h3 className="text-xl font-semibold mt-4">Receiving Inventory</h3>
              <p>When inventory arrives from a supplier, locate the corresponding purchase order and mark items as received. The system will automatically update your inventory counts.</p>
              
              <h3 className="text-xl font-semibold mt-4">Purchase Order Status</h3>
              <p>Purchase orders can have the following statuses:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Draft</strong> - PO is being prepared but not yet sent</li>
                <li><strong>Ordered</strong> - PO has been sent to the supplier</li>
                <li><strong>Partially Received</strong> - Some items have arrived</li>
                <li><strong>Received</strong> - All items have been received</li>
                <li><strong>Cancelled</strong> - PO has been cancelled</li>
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
