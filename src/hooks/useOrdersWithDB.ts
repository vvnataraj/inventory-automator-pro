
import { useState, useCallback, useEffect } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { supabase } from '@/integrations/supabase/client';
import { generateOrders } from '@/data/orderData';
import { toast } from 'sonner';

export function useOrdersWithDB(
  page: number = 1,
  pageSize: number = 20,
  searchQuery: string = '',
  statusFilter?: OrderStatus
) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      // First try to fetch from Supabase
      let query = supabase
        .from('orders')
        .select('*, items:order_items(*), customer:customers(*)', { count: 'exact' });

      // Apply search filter
      if (searchQuery) {
        query = query.or(`orderNumber.ilike.%${searchQuery}%,customers.name.ilike.%${searchQuery}%,customers.email.ilike.%${searchQuery}%`);
      }

      // Apply status filter
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      // Apply pagination
      const start = (page - 1) * pageSize;
      query = query.range(start, start + pageSize - 1)
        .order('createdAt', { ascending: false });

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        console.error("Error fetching orders from Supabase:", fetchError);
        throw new Error("Failed to fetch from database");
      }

      if (data && data.length > 0) {
        // Transform Supabase data to match our Order type
        const dbOrders: Order[] = data.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customer: {
            id: order.customer.id,
            name: order.customer.name,
            email: order.customer.email,
            phone: order.customer.phone
          },
          items: order.items.map(item => ({
            id: item.id,
            product: {
              id: item.productId,
              name: item.productName,
              sku: item.productSku,
              cost: item.productCost,
              imageUrl: item.productImageUrl
            },
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal
          })),
          status: order.status as OrderStatus,
          total: order.total,
          tax: order.tax,
          shipping: order.shipping,
          discount: order.discount,
          grandTotal: order.grandTotal,
          paymentMethod: order.paymentMethod,
          shippingAddress: {
            line1: order.shippingAddressLine1,
            line2: order.shippingAddressLine2,
            city: order.shippingAddressCity,
            state: order.shippingAddressState,
            postalCode: order.shippingAddressPostalCode,
            country: order.shippingAddressCountry
          },
          notes: order.notes,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          shippedAt: order.shippedAt,
          deliveredAt: order.deliveredAt
        }));

        setOrders(dbOrders);
        setTotalOrders(count || dbOrders.length);
      } else {
        // If no data in Supabase, use local mock data
        console.log("No orders data in database, using local data");
        const { items, total } = generateOrders(page, pageSize, searchQuery, statusFilter);
        setOrders(items);
        setTotalOrders(total);

        // Optionally seed the database with mock data
        // Uncomment this to seed the database
        /*
        await seedOrdersData();
        toast.success("Seeded database with mock orders data");
        */
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch orders"));
      console.error("Failed to fetch orders:", err);
      
      // Fall back to mock data
      const { items, total } = generateOrders(page, pageSize, searchQuery, statusFilter);
      setOrders(items);
      setTotalOrders(total);
      
      toast.error("Failed to fetch orders from database, using local data");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = useCallback(async (newOrder: Order) => {
    try {
      // First, ensure the customer exists
      let customerId = newOrder.customer.id;
      
      if (!customerId.startsWith('cust-')) {
        // Insert or retrieve the customer
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .upsert({
            id: newOrder.customer.id,
            name: newOrder.customer.name,
            email: newOrder.customer.email,
            phone: newOrder.customer.phone
          })
          .select()
          .single();

        if (customerError) {
          throw customerError;
        }
        
        customerId = customerData.id;
      }

      // Insert the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          id: newOrder.id,
          orderNumber: newOrder.orderNumber,
          customerId: customerId,
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
          createdAt: newOrder.createdAt,
          updatedAt: newOrder.updatedAt,
          shippedAt: newOrder.shippedAt,
          deliveredAt: newOrder.deliveredAt
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Insert order items
      const orderItems = newOrder.items.map(item => ({
        orderId: orderData.id,
        productId: item.product.id,
        productName: item.product.name,
        productSku: item.product.sku,
        productCost: item.product.cost,
        productImageUrl: item.product.imageUrl,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // Update local state
      setOrders(prev => [newOrder, ...prev]);
      setTotalOrders(prev => prev + 1);
      
      toast.success(`Order ${newOrder.orderNumber} created successfully`);
      return true;
    } catch (error) {
      console.error("Failed to add order:", error);
      toast.error("Failed to add order to database");
      return false;
    }
  }, []);

  const updateOrder = useCallback(async (updatedOrder: Order) => {
    try {
      // Update the order record
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          orderNumber: updatedOrder.orderNumber,
          customerId: updatedOrder.customer.id,
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

      if (orderError) {
        throw orderError;
      }

      // Update customer information
      const { error: customerError } = await supabase
        .from('customers')
        .update({
          name: updatedOrder.customer.name,
          email: updatedOrder.customer.email,
          phone: updatedOrder.customer.phone
        })
        .eq('id', updatedOrder.customer.id);

      if (customerError) {
        throw customerError;
      }

      // Delete existing order items
      const { error: deleteError } = await supabase
        .from('order_items')
        .delete()
        .eq('orderId', updatedOrder.id);

      if (deleteError) {
        throw deleteError;
      }

      // Insert updated order items
      const orderItems = updatedOrder.items.map(item => ({
        orderId: updatedOrder.id,
        productId: item.product.id,
        productName: item.product.name,
        productSku: item.product.sku,
        productCost: item.product.cost,
        productImageUrl: item.product.imageUrl,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      
      toast.success(`Order ${updatedOrder.orderNumber} updated successfully`);
      return true;
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error("Failed to update order in database");
      return false;
    }
  }, []);

  const deleteOrder = useCallback(async (orderId: string) => {
    try {
      // Delete the order (order items will be deleted via cascade)
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      // Update local state
      setOrders(prev => prev.filter(order => order.id !== orderId));
      setTotalOrders(prev => prev - 1);
      
      toast.success("Order deleted successfully");
      return true;
    } catch (error) {
      console.error("Failed to delete order:", error);
      toast.error("Failed to delete order from database");
      return false;
    }
  }, []);

  // Utility function to seed the database with mock data
  const seedOrdersData = useCallback(async () => {
    try {
      const allOrders = generateOrders();
      
      for (const order of allOrders.slice(0, 20)) { // Only seed 20 orders for performance
        // Ensure customer exists
        const { error: customerError } = await supabase
          .from('customers')
          .upsert({
            id: order.customer.id,
            name: order.customer.name,
            email: order.customer.email,
            phone: order.customer.phone
          });
        
        if (customerError) {
          console.error("Error upserting customer:", customerError);
          continue;
        }
        
        // Insert order
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            id: order.id,
            orderNumber: order.orderNumber,
            customerId: order.customer.id,
            status: order.status,
            total: order.total,
            tax: order.tax,
            shipping: order.shipping,
            discount: order.discount,
            grandTotal: order.grandTotal,
            paymentMethod: order.paymentMethod,
            shippingAddressLine1: order.shippingAddress.line1,
            shippingAddressLine2: order.shippingAddress.line2,
            shippingAddressCity: order.shippingAddress.city,
            shippingAddressState: order.shippingAddress.state,
            shippingAddressPostalCode: order.shippingAddress.postalCode,
            shippingAddressCountry: order.shippingAddress.country,
            notes: order.notes,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            shippedAt: order.shippedAt,
            deliveredAt: order.deliveredAt
          });
        
        if (orderError) {
          console.error("Error inserting order:", orderError);
          continue;
        }
        
        // Insert order items
        const orderItems = order.items.map(item => ({
          orderId: order.id,
          productId: item.product.id,
          productName: item.product.name,
          productSku: item.product.sku,
          productCost: item.product.cost,
          productImageUrl: item.product.imageUrl,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }));
        
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (itemsError) {
          console.error("Error inserting order items:", itemsError);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Failed to seed orders data:", error);
      return false;
    }
  }, []);

  return {
    orders,
    totalOrders,
    isLoading,
    error,
    fetchOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    seedOrdersData
  };
}
