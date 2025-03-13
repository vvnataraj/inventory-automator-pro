export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      import_configurations: {
        Row: {
          api_key: string | null
          created_at: string
          data_source_id: string
          file_location: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_auto_sync: boolean | null
          last_used: string
          name: string
          sync_frequency: string | null
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          data_source_id: string
          file_location?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_auto_sync?: boolean | null
          last_used?: string
          name: string
          sync_frequency?: string | null
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          created_at?: string
          data_source_id?: string
          file_location?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_auto_sync?: boolean | null
          last_used?: string
          name?: string
          sync_frequency?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          barcode: string | null
          brand: string | null
          category: string | null
          cost: number | null
          date_added: string | null
          description: string | null
          dimensions: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          last_updated: string | null
          location: string | null
          low_stock_threshold: number | null
          min_stock_count: number | null
          name: string
          price: number | null
          rrp: number | null
          sku: string
          stock: number | null
          subcategory: string | null
          supplier: string | null
          tags: string[] | null
          weight: Json | null
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          category?: string | null
          cost?: number | null
          date_added?: string | null
          description?: string | null
          dimensions?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          last_updated?: string | null
          location?: string | null
          low_stock_threshold?: number | null
          min_stock_count?: number | null
          name: string
          price?: number | null
          rrp?: number | null
          sku: string
          stock?: number | null
          subcategory?: string | null
          supplier?: string | null
          tags?: string[] | null
          weight?: Json | null
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          category?: string | null
          cost?: number | null
          date_added?: string | null
          description?: string | null
          dimensions?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          last_updated?: string | null
          location?: string | null
          low_stock_threshold?: number | null
          min_stock_count?: number | null
          name?: string
          price?: number | null
          rrp?: number | null
          sku?: string
          stock?: number | null
          subcategory?: string | null
          supplier?: string | null
          tags?: string[] | null
          weight?: Json | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          created_at: string
          id: string
          itemcount: number | null
          name: string
          spaceutilization: number | null
          stockvalue: number | null
          totalunits: number | null
          type: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id: string
          itemcount?: number | null
          name: string
          spaceutilization?: number | null
          stockvalue?: number | null
          totalunits?: number | null
          type: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          itemcount?: number | null
          name?: string
          spaceutilization?: number | null
          stockvalue?: number | null
          totalunits?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          orderid: string
          price: number
          productcost: number
          productid: string
          productimageurl: string | null
          productname: string
          productsku: string
          quantity: number
          subtotal: number
        }
        Insert: {
          created_at?: string
          id?: string
          orderid: string
          price: number
          productcost: number
          productid: string
          productimageurl?: string | null
          productname: string
          productsku: string
          quantity: number
          subtotal: number
        }
        Update: {
          created_at?: string
          id?: string
          orderid?: string
          price?: number
          productcost?: number
          productid?: string
          productimageurl?: string | null
          productname?: string
          productsku?: string
          quantity?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_orderid_fkey"
            columns: ["orderid"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          createdat: string
          customerid: string
          deliveredat: string | null
          discount: number | null
          grandtotal: number
          id: string
          notes: string | null
          ordernumber: string
          paymentmethod: string
          shippedat: string | null
          shipping: number
          shippingaddresscity: string
          shippingaddresscountry: string
          shippingaddressline1: string
          shippingaddressline2: string | null
          shippingaddresspostalcode: string
          shippingaddressstate: string
          status: string
          tax: number
          total: number
          updatedat: string
        }
        Insert: {
          created_at?: string
          createdat: string
          customerid: string
          deliveredat?: string | null
          discount?: number | null
          grandtotal: number
          id: string
          notes?: string | null
          ordernumber: string
          paymentmethod: string
          shippedat?: string | null
          shipping: number
          shippingaddresscity: string
          shippingaddresscountry: string
          shippingaddressline1: string
          shippingaddressline2?: string | null
          shippingaddresspostalcode: string
          shippingaddressstate: string
          status: string
          tax: number
          total: number
          updatedat: string
        }
        Update: {
          created_at?: string
          createdat?: string
          customerid?: string
          deliveredat?: string | null
          discount?: number | null
          grandtotal?: number
          id?: string
          notes?: string | null
          ordernumber?: string
          paymentmethod?: string
          shippedat?: string | null
          shipping?: number
          shippingaddresscity?: string
          shippingaddresscountry?: string
          shippingaddressline1?: string
          shippingaddressline2?: string | null
          shippingaddresspostalcode?: string
          shippingaddressstate?: string
          status?: string
          tax?: number
          total?: number
          updatedat?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_entries: {
        Row: {
          created_at: string
          description: string
          id: string
          sender: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          sender: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          sender?: string
          user_id?: string
        }
        Relationships: []
      }
      purchase_items: {
        Row: {
          created_at: string
          id: string
          itemid: string
          name: string
          purchaseid: string
          quantity: number
          sku: string
          totalcost: number
          unitcost: number
        }
        Insert: {
          created_at?: string
          id?: string
          itemid: string
          name: string
          purchaseid: string
          quantity: number
          sku: string
          totalcost: number
          unitcost: number
        }
        Update: {
          created_at?: string
          id?: string
          itemid?: string
          name?: string
          purchaseid?: string
          quantity?: number
          sku?: string
          totalcost?: number
          unitcost?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_purchaseid_fkey"
            columns: ["purchaseid"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          created_at: string
          expecteddeliverydate: string
          id: string
          notes: string | null
          orderdate: string
          ponumber: string
          receiveddate: string | null
          status: string
          supplier: string
          totalcost: number
        }
        Insert: {
          created_at?: string
          expecteddeliverydate: string
          id: string
          notes?: string | null
          orderdate: string
          ponumber: string
          receiveddate?: string | null
          status: string
          supplier: string
          totalcost: number
        }
        Update: {
          created_at?: string
          expecteddeliverydate?: string
          id?: string
          notes?: string | null
          orderdate?: string
          ponumber?: string
          receiveddate?: string | null
          status?: string
          supplier?: string
          totalcost?: number
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          created_at: string
          id: string
          inventoryitemid: string
          name: string
          price: number
          quantity: number
          saleid: string
          subtotal: number
        }
        Insert: {
          created_at?: string
          id?: string
          inventoryitemid: string
          name: string
          price: number
          quantity: number
          saleid: string
          subtotal: number
        }
        Update: {
          created_at?: string
          id?: string
          inventoryitemid?: string
          name?: string
          price?: number
          quantity?: number
          saleid?: string
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_saleid_fkey"
            columns: ["saleid"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          customername: string
          date: string
          id: string
          notes: string | null
          paymentmethod: string
          salenumber: string
          status: string
          total: number
        }
        Insert: {
          created_at?: string
          customername: string
          date: string
          id: string
          notes?: string | null
          paymentmethod: string
          salenumber: string
          status?: string
          total?: number
        }
        Update: {
          created_at?: string
          customername?: string
          date?: string
          id?: string
          notes?: string | null
          paymentmethod?: string
          salenumber?: string
          status?: string
          total?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "manager" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
