
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ActivityLog {
  id: string;
  user_id?: string;
  username?: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export function useLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  const queryClient = useQueryClient();

  // Function to fetch logs from Supabase
  const fetchLogs = useCallback(
    async ({ queryKey }: { queryKey: (string | number)[] }) => {
      try {
        // Get the page from the query key (queryKey[1])
        const currentPage = queryKey[1] as number;
        
        // Create the base query
        let query = supabase
          .from("activity_logs")
          .select("*", { count: "exact" });

        // Add search filter if provided
        if (searchQuery) {
          query = query
            .or(`action.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%,target_type.ilike.%${searchQuery}%`);
        }

        // Add pagination
        const from = (currentPage - 1) * pageSize;
        const to = from + pageSize - 1;

        // Execute query with pagination and ordering
        const { data, error, count } = await query
          .order("created_at", { ascending: false })
          .range(from, to);

        if (error) {
          throw error;
        }

        // Update total count
        if (count !== null) {
          setTotalLogs(count);
        }

        return data as ActivityLog[];
      } catch (error) {
        console.error("Error fetching logs:", error);
        toast.error("Failed to fetch logs");
        return [];
      }
    },
    [searchQuery, pageSize]
  );

  // Use React Query to fetch logs
  const {
    data: logs = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["logs", page, pageSize, searchQuery],
    queryFn: fetchLogs,
  });

  // Delete log mutation
  const deleteLogMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("activity_logs").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success("Log entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
    onError: (error) => {
      console.error("Error deleting log:", error);
      toast.error("Failed to delete log entry");
    },
  });

  return {
    logs,
    isLoading,
    isError,
    totalLogs,
    page,
    pageSize,
    searchQuery,
    setSearchQuery,
    setPage,
    setPageSize,
    refetch,
    deleteLog: deleteLogMutation.mutate,
  };
}
