
import { useState, useEffect, useCallback } from "react";
import { Order, OrderItem, OrderStatus } from "@/types/order";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export function useOrdersWithDB() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch orders from the database
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      
      // This fetch will now work correctly with our new tables
      const { data: ordersData, error: ordersError, count } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          items:order_items(*)
        `)
        .order('createdAt', { ascending: false });
      
      if (ordersError) {
        throw ordersError;
      }
      
      if (!ordersData) {
        return;
      }
      
      // Transform data to match our Order type
      const transformedOrders: Order[] = ordersData.map(order => {
        // Extract customer from the joined data
        const customer = order.customer ? {
          id: order.customer.id,
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone
        } : null;
        
        // Extract items from the joined data
        const items = Array.isArray(order.items) ? order.items.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.productName,
          sku: item.productSku,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
          imageUrl: item.productImageUrl
        })) : [];
        
        return {
          id: order.id,
          orderNumber: order.orderNumber,
          customer,
          status: order.status as OrderStatus,
          total: order.total,
          tax: order.tax,
          shipping: order.shipping,
          discount: order.discount || 0,
          grandTotal: order.grandTotal,
          paymentMethod: order.paymentMethod,
          shippingAddress: {
            line1: order.shippingAddressLine1,
            line2: order.shippingAddressLine2 || '',
            city: order.shippingAddressCity,
            state: order.shippingAddressState,
            postalCode: order.shippingAddressPostalCode,
            country: order.shippingAddressCountry
          },
          notes: order.notes || '',
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          shippedAt: order.shippedAt,
          deliveredAt: order.deliveredAt,
          items
        };
      });
      
      setOrders(transformedOrders);
      setTotalOrders(count || transformedOrders.length);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch orders"));
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Add a new order to the database
  const addOrder = useCallback(async (newOrder: Omit<Order, "id">) => {
    try {
      // First, make sure the customer exists
      let customerId = newOrder.customer?.id;
      
      if (!customerId && newOrder.customer) {
        // Create a new customer record if one doesn't exist
        const customerUuid = uuidv4();
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            id: customerUuid,
            name: newOrder.customer.name,
            email: newOrder.customer.email,
            phone: newOrder.customer.phone
          });
        
        if (customerError) throw customerError;
        customerId = customerUuid;
      }
      
      // Generate a new UUID for the order
      const orderId = uuidv4();
      
      // Insert the order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          orderNumber: newOrder.orderNumber,
          customerId,
          status: newOrder.status,
          total: newOrder.total,
          tax: newOrder.tax,
          shipping: newOrder.shipping,
          discount: newOrder.discount,
          grandTotal: newOrder.grandTotal,
          paymentMethod: newOrder.paymentMethod,
          shippingAddressLine1: newOrder.shippingAddress.line1,
          shippingAddressLine2: newOrder.shippingAddress.line2,
          shippingAddressCity: newOrder.shippingAddress.city,
          shippingAddressState: newOrder.shippingAddress.state,
          shippingAddressPostalCode: newOrder.shippingAddress.postalCode,
          shippingAddressCountry: newOrder.shippingAddress.country,
          notes: newOrder.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          shippedAt: newOrder.shippedAt,
          deliveredAt: newOrder.deliveredAt
        });
      
      if (orderError) throw orderError;
      
      // Insert all the order items
      if (newOrder.items && newOrder.items.length > 0) {
        const orderItems = newOrder.items.map(item => ({
          orderId,
          productId: item.productId,
          productName: item.name,
          productSku: item.sku,
          productCost: item.price, // Assuming cost is the same as price for simplicity
          productImageUrl: item.imageUrl || '',
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }));
        
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (itemsError) throw itemsError;
      }
      
      // Refresh orders after adding
      await fetchOrders();
      toast.success('Order created successfully');
      return true;
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error("Failed to create order");
      return false;
    }
  }, [fetchOrders]);

  // Update an existing order
  const updateOrder = useCallback(async (updatedOrder: Order) => {
    try {
      // Update the customer if needed
      if (updatedOrder.customer) {
        const { error: customerError } = await supabase
          .from('customers')
          .update({
            name: updatedOrder.customer.name,
            email: updatedOrder.customer.email,
            phone: updatedOrder.customer.phone,
            updated_at: new Date().toISOString()
          })
          .eq('id', updatedOrder.customer.id);
        
        if (customerError) throw customerError;
      }
      
      // Update the order
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          orderNumber: updatedOrder.orderNumber,
          status: updatedOrder.status,
          total: updatedOrder.total,
          tax: updatedOrder.tax,
          shipping: updatedOrder.shipping,
          discount: updatedOrder.discount,
          grandTotal: updatedOrder.grandTotal,
          paymentMethod: updatedOrder.paymentMethod,
          shippingAddressLine1: updatedOrder.shippingAddress.line1,
          shippingAddressLine2: updatedOrder.shippingAddress.line2,
          shippingAddressCity: updatedOrder.shippingAddress.city,
          shippingAddressState: updatedOrder.shippingAddress.state,
          shippingAddressPostalCode: updatedOrder.shippingAddress.postalCode,
          shippingAddressCountry: updatedOrder.shippingAddress.country,
          notes: updatedOrder.notes,
          updatedAt: new Date().toISOString(),
          shippedAt: updatedOrder.shippedAt,
          deliveredAt: updatedOrder.deliveredAt
        })
        .eq('id', updatedOrder.id);
      
      if (orderError) throw orderError;
      
      // Delete existing order items and insert updated ones
      const { error: deleteItemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('orderId', updatedOrder.id);
      
      if (deleteItemsError) throw deleteItemsError;
      
      // Insert updated items
      if (updatedOrder.items && updatedOrder.items.length > 0) {
        const orderItems = updatedOrder.items.map(item => ({
          orderId: updatedOrder.id,
          productId: item.productId,
          productName: item.name,
          productSku: item.sku,
          productCost: item.price,
          productImageUrl: item.imageUrl || '',
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }));
        
        const { error: insertItemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (insertItemsError) throw insertItemsError;
      }
      
      // Refresh orders after updating
      await fetchOrders();
      toast.success('Order updated successfully');
      return true;
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
      return false;
    }
  }, [fetchOrders]);

  // Delete an order from the database
  const deleteOrder = useCallback(async (orderId: string) => {
    try {
      // Supabase will automatically delete the order_items due to ON DELETE CASCADE
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update the local state
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      setTotalOrders(prev => prev - 1);
      
      toast.success('Order deleted successfully');
      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
      return false;
    }
  }, []);

  return {
    orders,
    totalOrders,
    loading,
    error,
    fetchOrders,
    addOrder,
    updateOrder,
    deleteOrder
  };
}
