
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { generateOrders } from './orderData';
import { CustomerDB, OrderDB } from '@/types/order';

/**
 * Script to migrate the mock orders data to the Supabase database
 */
export const migrateOrdersData = async () => {
  console.log("Starting orders data migration...");
  const mockOrders = generateOrders();
  
  // Track customers we've already inserted to avoid duplicates
  const processedCustomers = new Map<string, string>();
  
  for (const order of mockOrders) {
    try {
      // Check if customer already exists in our processing map
      let customerId = processedCustomers.get(order.customer.email);
      
      // If not in our map, check the database
      if (!customerId) {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('email', order.customer.email)
          .maybeSingle();
        
        if (existingCustomer) {
          customerId = existingCustomer.id;
          processedCustomers.set(order.customer.email, customerId);
        }
      }
      
      // If customer doesn't exist, create a new one
      if (!customerId) {
        customerId = uuidv4();
        
        const newCustomer: CustomerDB = {
          id: customerId,
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error: customerError } = await supabase
          .from('customers')
          .insert(newCustomer);
        
        if (customerError) {
          console.error("Error creating customer:", customerError);
          continue;
        }
        
        processedCustomers.set(order.customer.email, customerId);
      }
      
      // Create the order
      const orderId = order.id;
      
      const newOrder: Omit<OrderDB, 'items' | 'created_at'> = {
        id: orderId,
        ordernumber: order.orderNumber,
        customerid: customerId,
        status: order.status,
        total: order.total,
        tax: order.tax,
        shipping: order.shipping,
        discount: order.discount || null,
        grandtotal: order.grandTotal,
        paymentmethod: order.paymentMethod,
        shippingaddressline1: order.shippingAddress.line1,
        shippingaddressline2: order.shippingAddress.line2 || null,
        shippingaddresscity: order.shippingAddress.city,
        shippingaddressstate: order.shippingAddress.state,
        shippingaddresspostalcode: order.shippingAddress.postalCode,
        shippingaddresscountry: order.shippingAddress.country,
        notes: order.notes || null,
        createdat: order.createdAt,
        updatedat: order.updatedAt,
        shippedat: order.shippedAt || null,
        deliveredat: order.deliveredAt || null
      };
      
      // Check if order already exists
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('ordernumber', order.orderNumber)
        .maybeSingle();
      
      if (existingOrder) {
        console.log(`Order ${order.orderNumber} already exists, skipping`);
        continue;
      }
      
      const { error: orderError } = await supabase
        .from('orders')
        .insert(newOrder);
      
      if (orderError) {
        console.error("Error creating order:", orderError);
        continue;
      }
      
      // Create order items
      for (const item of order.items) {
        const newOrderItem = {
          orderid: orderId,
          productid: item.product.id || '',
          productname: item.product.name || '',
          productsku: item.product.sku || '',
          productcost: item.product.cost || 0,
          productimageurl: item.product.imageUrl || null,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        };
        
        const { error: itemError } = await supabase
          .from('order_items')
          .insert(newOrderItem);
        
        if (itemError) {
          console.error("Error creating order item:", itemError);
        }
      }
      
      console.log(`Successfully imported order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error processing order:", error);
    }
  }
  
  console.log("Orders data migration complete!");
};

// Expose a function that can be called from the browser console
(window as any).migrateOrdersData = migrateOrdersData;
