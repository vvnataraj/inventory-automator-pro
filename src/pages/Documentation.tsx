
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Documentation() {
  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Documentation</h1>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="getting-started">
            <TabsList className="mb-4">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
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
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-4">
              <h2 className="text-2xl font-bold">Inventory Management</h2>
              <p>Learn how to efficiently manage your inventory, add new items, update stock levels, and transfer items between locations.</p>
              
              <h3 className="text-xl font-semibold mt-4">Adding New Items</h3>
              <p>To add a new inventory item, navigate to the Inventory page and click the "Add Item" button. Fill out the required information and save the item.</p>
              
              <h3 className="text-xl font-semibold mt-4">Stock Adjustments</h3>
              <p>You can adjust stock levels by editing an item and updating the quantity field. All changes are logged automatically for audit purposes.</p>
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-4">
              <h2 className="text-2xl font-bold">Order Processing</h2>
              <p>This section covers creating, managing, and fulfilling customer orders.</p>
              
              <h3 className="text-xl font-semibold mt-4">Creating Orders</h3>
              <p>To create a new order, go to the Orders section and click "New Order." Select the customer, add items from your inventory, and confirm the order.</p>
              
              <h3 className="text-xl font-semibold mt-4">Order Fulfillment</h3>
              <p>When an order is ready to be fulfilled, change its status to "In Progress" and assign it to a team member. Once shipped, update the status to "Shipped" and enter tracking information.</p>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <h2 className="text-2xl font-bold">Reporting Features</h2>
              <p>Generate and analyze reports to gain insights into your business performance.</p>
              
              <h3 className="text-xl font-semibold mt-4">Sales Reports</h3>
              <p>View sales data by date range, product, or customer. Export reports to CSV or PDF formats for further analysis.</p>
              
              <h3 className="text-xl font-semibold mt-4">Inventory Reports</h3>
              <p>Monitor stock levels, identify slow-moving items, and forecast inventory needs based on historical data.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
