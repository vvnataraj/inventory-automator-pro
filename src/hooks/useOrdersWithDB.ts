
import { useState, useEffect, useCallback } from "react";
import { Order, OrderDB, OrderItem, OrderItemDB, OrderStatus } from "@/types/order";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export function useOrdersWithDB(
  page = 1,
  pageSize = 10,
  searchQuery = "",
  statusFilter?: OrderStatus
) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch orders from the database
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `, { count: 'exact' })
        .order('createdat', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (searchQuery) {
        query = query.or(`ordernumber.ilike.%${searchQuery}%`);
      }

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      const { data: ordersData, error: ordersError, count } = await query;
      
      if (ordersError) {
        throw ordersError;
      }
      
      if (!ordersData) {
        setOrders([]);
        setTotalOrders(0);
        return;
      }
      
      // Transform data to match our Order type
      const transformedOrders: Order[] = ordersData.map((orderDB: OrderDB) => {
        // Extract items from the joined data
        const items = Array.isArray(orderDB.items) ? orderDB.items.map((item: OrderItemDB) => ({
          id: item.id,
          product: {
            id: item.productid,
            name: item.productname,
            sku: item.productsku,
            cost: item.productcost,
            image_url: item.productimageurl,
          },
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        })) : [];
        
        return {
          id: orderDB.id,
          orderNumber: orderDB.ordernumber,
          customer: {
            id: orderDB.customerid,
            name: "", // This needs to be fetched separately or included in the join
            email: "",
            phone: ""
          },
          items,
          status: orderDB.status as OrderStatus,
          total: orderDB.total,
          tax: orderDB.tax,
          shipping: orderDB.shipping,
          discount: orderDB.discount || 0,
          grandTotal: orderDB.grandtotal,
          paymentMethod: orderDB.paymentmethod,
          shippingAddress: {
            line1: orderDB.shippingaddressline1,
            line2: orderDB.shippingaddressline2 || undefined,
            city: orderDB.shippingaddresscity,
            state: orderDB.shippingaddressstate,
            postalCode: orderDB.shippingaddresspostalcode,
            country: orderDB.shippingaddresscountry,
          },
          notes: orderDB.notes || '',
          createdAt: orderDB.createdat,
          updatedAt: orderDB.updatedat,
          shippedAt: orderDB.shippedat,
          deliveredAt: orderDB.deliveredat,
        };
      });
      
      // Now we need to get the customer information
      for (const order of transformedOrders) {
        const { data: customerData } = await supabase
          .from('customers')
          .select('*')
          .eq('id', order.customer.id)
          .single();
          
        if (customerData) {
          order.customer.name = customerData.name;
          order.customer.email = customerData.email || '';
          order.customer.phone = customerData.phone || '';
        }
      }
      
      setOrders(transformedOrders);
      setTotalOrders(count || transformedOrders.length);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch orders"));
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Add a new order to the database
  const addOrder = useCallback(async (newOrder: Omit<Order, "id">) => {
    try {
      // First, ensure we have a customer id
      let customerId = newOrder.customer.id;
      
      if (!customerId) {
        // Create a new customer if needed
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: newOrder.customer.name,
            email: newOrder.customer.email,
            phone: newOrder.customer.phone
          })
          .select('id')
          .single();
          
        if (customerError) throw customerError;
        customerId = customerData?.id;
      }
      
      // Generate a new UUID for the order
      const orderId = uuidv4();
      
      // Insert the order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          ordernumber: newOrder.orderNumber,
          customerid: customerId,
          status: newOrder.status,
          total: newOrder.total,
          tax: newOrder.tax,
          shipping: newOrder.shipping,
          discount: newOrder.discount,
          grandtotal: newOrder.grandTotal,
          paymentmethod: newOrder.paymentMethod,
          shippingaddressline1: newOrder.shippingAddress.line1,
          shippingaddressline2: newOrder.shippingAddress.line2,
          shippingaddresscity: newOrder.shippingAddress.city,
          shippingaddressstate: newOrder.shippingAddress.state,
          shippingaddresspostalcode: newOrder.shippingAddress.postalCode,
          shippingaddresscountry: newOrder.shippingAddress.country,
          notes: newOrder.notes,
          createdat: newOrder.createdAt,
          updatedat: newOrder.updatedAt,
          shippedat: newOrder.shippedAt,
          deliveredat: newOrder.deliveredAt
        });
      
      if (orderError) throw orderError;
      
      // Insert all the order items
      if (newOrder.items && newOrder.items.length > 0) {
        const orderItems = newOrder.items.map(item => ({
          orderid: orderId,
          productid: item.product.id || "",
          productname: item.product.name || "",
          productsku: item.product.sku || "",
          productcost: item.product.cost || 0,
          productimageurl: item.product.image_url || "",
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
      return { success: true, id: orderId };
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error("Failed to create order");
      return { success: false, id: null };
    }
  }, [fetchOrders]);

  // Update an existing order
  const updateOrder = useCallback(async (updatedOrder: Order) => {
    try {
      // Update the order
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          ordernumber: updatedOrder.orderNumber,
          customerid: updatedOrder.customer.id,
          status: updatedOrder.status,
          total: updatedOrder.total,
          tax: updatedOrder.tax,
          shipping: updatedOrder.shipping,
          discount: updatedOrder.discount,
          grandtotal: updatedOrder.grandTotal,
          paymentmethod: updatedOrder.paymentMethod,
          shippingaddressline1: updatedOrder.shippingAddress.line1,
          shippingaddressline2: updatedOrder.shippingAddress.line2,
          shippingaddresscity: updatedOrder.shippingAddress.city,
          shippingaddressstate: updatedOrder.shippingAddress.state,
          shippingaddresspostalcode: updatedOrder.shippingAddress.postalCode,
          shippingaddresscountry: updatedOrder.shippingAddress.country,
          notes: updatedOrder.notes,
          updatedat: new Date().toISOString(),
          shippedat: updatedOrder.shippedAt,
          deliveredat: updatedOrder.deliveredAt
        })
        .eq('id', updatedOrder.id);
      
      if (orderError) throw orderError;
      
      // Delete existing order items and insert updated ones
      const { error: deleteItemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('orderid', updatedOrder.id);
      
      if (deleteItemsError) throw deleteItemsError;
      
      // Insert updated items
      if (updatedOrder.items && updatedOrder.items.length > 0) {
        const orderItems = updatedOrder.items.map(item => ({
          orderid: updatedOrder.id,
          productid: item.product.id || "",
          productname: item.product.name || "",
          productsku: item.product.sku || "",
          productcost: item.product.cost || 0,
          productimageurl: item.product.image_url || "",
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

  // Update the status of an order
  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    try {
      const updateData: Partial<OrderDB> = { status };
      
      // Add timestamp for shipment or delivery
      if (status === 'shipped') {
        updateData.shippedat = new Date().toISOString();
      } else if (status === 'delivered') {
        updateData.deliveredat = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update the local state
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.id === orderId) {
            return {
              ...order,
              status,
              shippedAt: status === 'shipped' ? new Date().toISOString() : order.shippedAt,
              deliveredAt: status === 'delivered' ? new Date().toISOString() : order.deliveredAt
            };
          }
          return order;
        })
      );
      
      toast.success(`Order marked as ${status}`);
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
      return false;
    }
  }, []);

  return {
    orders,
    totalOrders,
    isLoading,
    error,
    page,
    setPage: (newPage: number) => {
      if (newPage > 0) setIsLoading(true);
      setPage(newPage);
    },
    pageSize,
    setPageSize: (newPageSize: number) => {
      setIsLoading(true);
      setPageSize(newPageSize);
    },
    fetchOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus
  };
}
