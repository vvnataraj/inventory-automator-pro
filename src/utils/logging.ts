
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LogEntry {
  user_id?: string;
  username?: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Records an activity log entry to the database
 */
export const logActivity = async (entry: LogEntry): Promise<boolean> => {
  try {
    // Get current user information if available
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && !entry.user_id) {
      entry.user_id = user.id;
    }

    // Set user agent
    if (!entry.user_agent && typeof window !== 'undefined') {
      entry.user_agent = window.navigator.userAgent;
    }

    const { error } = await supabase
      .from('activity_logs')
      .insert([entry]);

    if (error) {
      console.error('Error logging activity:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to log activity:', error);
    return false;
  }
};

/**
 * Log inventory-related activities
 */
export const logInventoryActivity = async (
  action: string,
  itemId: string,
  itemName: string,
  details?: Record<string, any>
): Promise<void> => {
  try {
    await logActivity({
      action,
      target_type: 'inventory_item',
      target_id: itemId,
      details: {
        item_name: itemName,
        ...details
      }
    });
  } catch (error) {
    console.error('Failed to log inventory activity:', error);
  }
};

/**
 * Log order-related activities
 */
export const logOrderActivity = async (
  action: string,
  orderId: string,
  orderNumber: string,
  details?: Record<string, any>
): Promise<void> => {
  try {
    await logActivity({
      action,
      target_type: 'order',
      target_id: orderId,
      details: {
        order_number: orderNumber,
        ...details
      }
    });
  } catch (error) {
    console.error('Failed to log order activity:', error);
  }
};

/**
 * Log user authentication activities
 */
export const logAuthActivity = async (
  action: string,
  details?: Record<string, any>
): Promise<void> => {
  try {
    await logActivity({
      action,
      target_type: 'authentication',
      details
    });
  } catch (error) {
    console.error('Failed to log auth activity:', error);
  }
};

/**
 * Logs a system error
 */
export const logError = async (
  errorMessage: string,
  source: string,
  details?: Record<string, any>
): Promise<void> => {
  try {
    await logActivity({
      action: 'system_error',
      target_type: 'system',
      target_id: source,
      details: {
        error_message: errorMessage,
        ...details
      }
    });
  } catch (error) {
    console.error('Failed to log error:', error);
  }
};
