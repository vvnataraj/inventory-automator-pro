
import { supabase } from "@/integrations/supabase/client";
import { Sale, SaleItem, SaleDB, SaleItemDB, SaleStatus } from "@/types/sale";
import { v4 as uuidv4 } from "uuid";

// Fetch sales from the database
export const fetchSales = async (
  currentPage: number,
  itemsPerPage: number,
  searchQuery: string
): Promise<Sale[]> => {
  let query = supabase
    .from('sales')
    .select(`
      *,
      items:sale_items(*)
    `)
    .order('date', { ascending: false });

  // Apply search filter if provided
  if (searchQuery) {
    query = query.or(`salenumber.ilike.%${searchQuery}%,customername.ilike.%${searchQuery}%`);
  }

  // Apply pagination
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  query = query.range(from, to);

  const { data: salesData, error } = await query;

  if (error) {
    console.error("Error fetching sales:", error);
    throw error;
  }

  if (!salesData || salesData.length === 0) {
    return [];
  }

  // Transform the database sales to the application sale format
  return transformSalesData(salesData);
};

// Count total sales
export const fetchTotalSales = async (searchQuery: string): Promise<number> => {
  let query = supabase
    .from('sales')
    .select('id', { count: 'exact' });

  // Apply search filter if provided
  if (searchQuery) {
    query = query.or(`salenumber.ilike.%${searchQuery}%,customername.ilike.%${searchQuery}%`);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error counting sales:", error);
    throw error;
  }

  return count || 0;
};

// Add a new sale
export const addSale = async (newSale: Omit<Sale, "id">): Promise<Sale> => {
  const saleId = uuidv4();
  
  // Create sale
  const { error: saleInsertError } = await supabase
    .from('sales')
    .insert({
      id: saleId,
      salenumber: newSale.saleNumber,
      customername: newSale.customerName,
      date: newSale.date || new Date().toISOString(),
      total: newSale.total,
      status: newSale.status || "completed",
      paymentmethod: newSale.paymentMethod || "Cash",
      notes: newSale.notes
    });

  if (saleInsertError) {
    console.error("Error creating sale:", saleInsertError);
    throw saleInsertError;
  }

  // Create sale items
  const saleItems = newSale.items.map(item => ({
    saleid: saleId,
    inventoryitemid: item.inventoryItemId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.subtotal
  }));

  const { error: itemsInsertError } = await supabase
    .from('sale_items')
    .insert(saleItems);

  if (itemsInsertError) {
    console.error("Error creating sale items:", itemsInsertError);
    throw itemsInsertError;
  }

  // Return the created sale with ID
  return {
    ...newSale,
    id: saleId
  };
};

// Update an existing sale
export const updateSale = async (updatedSale: Sale): Promise<Sale> => {
  // Update sale
  const { error: saleUpdateError } = await supabase
    .from('sales')
    .update({
      salenumber: updatedSale.saleNumber,
      customername: updatedSale.customerName,
      date: updatedSale.date,
      total: updatedSale.total,
      status: updatedSale.status,
      paymentmethod: updatedSale.paymentMethod,
      notes: updatedSale.notes
    })
    .eq('id', updatedSale.id);

  if (saleUpdateError) {
    console.error("Error updating sale:", saleUpdateError);
    throw saleUpdateError;
  }

  // First, delete existing sale items
  const { error: deleteError } = await supabase
    .from('sale_items')
    .delete()
    .eq('saleid', updatedSale.id);

  if (deleteError) {
    console.error("Error deleting sale items:", deleteError);
    throw deleteError;
  }

  // Then insert updated items
  const saleItems = updatedSale.items.map(item => ({
    saleid: updatedSale.id,
    inventoryitemid: item.inventoryItemId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.subtotal
  }));

  const { error: itemsInsertError } = await supabase
    .from('sale_items')
    .insert(saleItems);

  if (itemsInsertError) {
    console.error("Error updating sale items:", itemsInsertError);
    throw itemsInsertError;
  }

  return updatedSale;
};

// Delete a sale
export const deleteSale = async (saleId: string): Promise<void> => {
  // First delete sale items
  const { error: itemsDeleteError } = await supabase
    .from('sale_items')
    .delete()
    .eq('saleid', saleId);

  if (itemsDeleteError) {
    console.error("Error deleting sale items:", itemsDeleteError);
    throw itemsDeleteError;
  }

  // Then delete the sale
  const { error: saleDeleteError } = await supabase
    .from('sales')
    .delete()
    .eq('id', saleId);

  if (saleDeleteError) {
    console.error("Error deleting sale:", saleDeleteError);
    throw saleDeleteError;
  }
};

// Helper function to transform sales data from DB format to application format
const transformSalesData = (salesData: SaleDB[]): Sale[] => {
  return salesData.map((sale: SaleDB) => {
    return {
      id: sale.id,
      saleNumber: sale.salenumber,
      customerName: sale.customername,
      items: sale.items?.map((item: SaleItemDB) => ({
        inventoryItemId: item.inventoryitemid,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })) || [],
      total: sale.total,
      date: sale.date,
      status: sale.status as SaleStatus,
      paymentMethod: sale.paymentmethod,
      notes: sale.notes || undefined,
    };
  });
};
