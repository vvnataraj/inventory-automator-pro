
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Order, OrderStatus, OrderDB, OrderItemDB, CustomerDB } from "@/types/order";
import { InventoryItem } from "@/types/inventory";

export const useOrdersWithDB = (page = 1, pageSize = 10, searchQuery = "", statusFilter?: OrderStatus) => {
  const [currentPage, setCurrentPage] = useState(page);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // Fetch orders from the database
  const fetchOrders = async (): Promise<Order[]> => {
    // First, fetch the orders
    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('createdat', { ascending: false });

    // Apply search filter if provided
    if (searchQuery) {
      query = query.or(`ordernumber.ilike.%${searchQuery}%,customerid.ilike.%${searchQuery}%`);
    }

    // Apply status filter if provided
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    // Apply pagination
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    query = query.range(from, to);

    const { data: ordersData, error } = await query;

    if (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }

    if (!ordersData || ordersData.length === 0) {
      return [];
    }

    // Get all customer IDs from orders
    const customerIds = [...new Set(ordersData.map(order => order.customerid))];

    // Fetch customer data for these orders
    const { data: customersData, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .in('id', customerIds);

    if (customersError) {
      console.error("Error fetching customers:", customersError);
      throw customersError;
    }

    // Create a map of customer IDs to customer data for easy lookup
    const customerMap: {[key: string]: CustomerDB} = {};
    customersData?.forEach(customer => {
      customerMap[customer.id] = customer;
    });

    // Transform the database orders to the application order format
    const orders: Order[] = ordersData.map((order: OrderDB) => {
      const customer = customerMap[order.customerid];
      
      return {
        id: order.id,
        orderNumber: order.ordernumber,
        customer: {
          id: customer?.id || order.customerid,
          name: customer?.name || "Unknown Customer",
          email: customer?.email || "unknown@example.com",
          phone: customer?.phone || undefined,
        },
        items: order.items?.map((item: OrderItemDB) => ({
          id: item.id,
          product: {
            id: item.productid,
            name: item.productname,
            sku: item.productsku,
            cost: item.productcost,
            imageUrl: item.productimageurl || undefined,
          },
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        })) || [],
        status: order.status as OrderStatus,
        total: order.total,
        tax: order.tax,
        shipping: order.shipping,
        discount: order.discount || undefined,
        grandTotal: order.grandtotal,
        paymentMethod: order.paymentmethod,
        shippingAddress: {
          line1: order.shippingaddressline1,
          line2: order.shippingaddressline2 || undefined,
          city: order.shippingaddresscity,
          state: order.shippingaddressstate,
          postalCode: order.shippingaddresspostalcode,
          country: order.shippingaddresscountry,
        },
        notes: order.notes || undefined,
        createdAt: order.createdat,
        updatedAt: order.updatedat,
        shippedAt: order.shippedat || undefined,
        deliveredAt: order.deliveredat || undefined,
      };
    });

    return orders;
  };

  // Count total orders
  const fetchTotalOrders = async (): Promise<number> => {
    let query = supabase
      .from('orders')
      .select('id', { count: 'exact' });

    // Apply search filter if provided
    if (searchQuery) {
      query = query.or(`ordernumber.ilike.%${searchQuery}%,customerid.ilike.%${searchQuery}%`);
    }

    // Apply status filter if provided
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { count, error } = await query;

    if (error) {
      console.error("Error counting orders:", error);
      throw error;
    }

    return count || 0;
  };

  // Add a new order
  const addOrder = async (newOrder: Omit<Order, "id">): Promise<Order> => {
    const orderId = uuidv4();
    
    // First, check if the customer exists
    const { data: existingCustomer, error: customerCheckError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', newOrder.customer.email)
      .maybeSingle();

    if (customerCheckError) {
      console.error("Error checking customer:", customerCheckError);
      throw customerCheckError;
    }

    // Generate a customer ID or use existing
    let customerId = existingCustomer?.id;
    
    // If customer doesn't exist, create a new one
    if (!customerId) {
      customerId = uuidv4();
      
      const { error: customerInsertError } = await supabase
        .from('customers')
        .insert({
          id: customerId,
          name: newOrder.customer.name,
          email: newOrder.customer.email,
          phone: newOrder.customer.phone
        });

      if (customerInsertError) {
        console.error("Error creating customer:", customerInsertError);
        throw customerInsertError;
      }
    }

    // Create order
    const { error: orderInsertError } = await supabase
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
        createdat: newOrder.createdAt || new Date().toISOString(),
        updatedat: newOrder.updatedAt || new Date().toISOString(),
        shippedat: newOrder.shippedAt,
        deliveredat: newOrder.deliveredAt
      });

    if (orderInsertError) {
      console.error("Error creating order:", orderInsertError);
      throw orderInsertError;
    }

    // Create order items
    const orderItems = newOrder.items.map(item => ({
      orderid: orderId,
      productid: item.product.id || "",
      productname: item.product.name || "",
      productsku: item.product.sku || "",
      productcost: item.product.cost || 0,
      productimageurl: item.product.imageUrl || null,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    }));

    const { error: itemsInsertError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsInsertError) {
      console.error("Error creating order items:", itemsInsertError);
      throw itemsInsertError;
    }

    // Return the created order with ID
    return {
      ...newOrder,
      id: orderId,
      customer: {
        ...newOrder.customer,
        id: customerId
      }
    };
  };

  // Update an existing order
  const updateOrder = async (updatedOrder: Order): Promise<Order> => {
    // Update order
    const { error: orderUpdateError } = await supabase
      .from('orders')
      .update({
        ordernumber: updatedOrder.orderNumber,
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

    if (orderUpdateError) {
      console.error("Error updating order:", orderUpdateError);
      throw orderUpdateError;
    }

    // First, delete existing order items
    const { error: deleteError } = await supabase
      .from('order_items')
      .delete()
      .eq('orderid', updatedOrder.id);

    if (deleteError) {
      console.error("Error deleting order items:", deleteError);
      throw deleteError;
    }

    // Then insert updated items
    const orderItems = updatedOrder.items.map(item => ({
      orderid: updatedOrder.id,
      productid: item.product.id || "",
      productname: item.product.name || "",
      productsku: item.product.sku || "",
      productcost: item.product.cost || 0,
      productimageurl: item.product.imageUrl || null,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    }));

    const { error: itemsInsertError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsInsertError) {
      console.error("Error updating order items:", itemsInsertError);
      throw itemsInsertError;
    }

    return updatedOrder;
  };

  // Delete an order
  const deleteOrder = async (orderId: string): Promise<void> => {
    // First delete order items
    const { error: itemsDeleteError } = await supabase
      .from('order_items')
      .delete()
      .eq('orderid', orderId);

    if (itemsDeleteError) {
      console.error("Error deleting order items:", itemsDeleteError);
      throw itemsDeleteError;
    }

    // Then delete the order
    const { error: orderDeleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (orderDeleteError) {
      console.error("Error deleting order:", orderDeleteError);
      throw orderDeleteError;
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    const updates: any = { 
      status,
      updatedat: new Date().toISOString()
    };

    // Add date for specific statuses
    if (status === 'shipped') {
      updates.shippedat = new Date().toISOString();
    } else if (status === 'delivered') {
      updates.deliveredat = new Date().toISOString();
    }

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    if (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };

  // Query for orders
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders', currentPage, itemsPerPage, searchQuery, statusFilter],
    queryFn: fetchOrders,
  });

  // Query for total orders count
  const { data: totalOrders = 0 } = useQuery({
    queryKey: ['ordersCount', searchQuery, statusFilter],
    queryFn: fetchTotalOrders,
  });

  // Mutation for adding an order
  const queryClient = useQueryClient();
  const { mutateAsync: addOrderMutation } = useMutation({
    mutationFn: addOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['ordersCount'] });
    },
  });

  // Mutation for updating an order
  const { mutateAsync: updateOrderMutation } = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  // Mutation for deleting an order
  const { mutateAsync: deleteOrderMutation } = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['ordersCount'] });
    },
  });

  // Mutation for updating order status
  const { mutateAsync: updateOrderStatusMutation } = useMutation({
    mutationFn: (params: { orderId: string, status: OrderStatus }) => 
      updateOrderStatus(params.orderId, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setItemsPerPage(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return {
    orders,
    totalOrders,
    isLoading,
    error,
    page: currentPage,
    pageSize: itemsPerPage,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    addOrder: addOrderMutation,
    updateOrder: updateOrderMutation,
    deleteOrder: deleteOrderMutation,
    updateOrderStatus: (orderId: string, status: OrderStatus) => 
      updateOrderStatusMutation({ orderId, status }),
  };
};
