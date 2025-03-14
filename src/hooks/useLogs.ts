
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

export type LogSortField = "created_at" | "action" | "username" | "target_type";
export type SortDirection = "asc" | "desc";

export function useLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  const [sortField, setSortField] = useState<LogSortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const queryClient = useQueryClient();

  // Function to fetch logs from Supabase
  const fetchLogs = useCallback(
    async ({ queryKey }: { queryKey: (string | number)[] }) => {
      try {
        // Get the page from the query key (queryKey[1])
        const currentPage = queryKey[1] as number;
        const currentSortField = queryKey[3] as LogSortField;
        const currentSortDirection = queryKey[4] as SortDirection;
        
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
          .order(currentSortField, { ascending: currentSortDirection === 'asc' })
          .range(from, to);

        if (error) {
          throw error;
        }

        // Update total count
        if (count !== null) {
          setTotalLogs(count);
        }

        // Process logs to ensure we have usernames from emails
        const logs = data as ActivityLog[];
        
        // For any logs with user_id but no username, try to fetch from auth.users
        const logsWithUserIds = logs.filter(log => log.user_id && !log.username);
        
        if (logsWithUserIds.length > 0) {
          // Get unique user IDs
          const userIds = [...new Set(logsWithUserIds.map(log => log.user_id))];
          
          // Fetch user emails for these IDs
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', userIds);
          
          if (!userError && userData) {
            // Create a map of user_id to username
            const userMap = userData.reduce((acc, user) => {
              acc[user.id] = user.username;
              return acc;
            }, {} as Record<string, string>);
            
            // Update logs with usernames
            logs.forEach(log => {
              if (log.user_id && !log.username && userMap[log.user_id]) {
                log.username = userMap[log.user_id];
              }
            });
          }
        }

        return logs;
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
    queryKey: ["logs", page, pageSize, sortField, sortDirection, searchQuery],
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

  // Function to handle sorting
  const handleSort = (field: LogSortField) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending for dates, ascending for text
      setSortField(field);
      setSortDirection(field === 'created_at' ? 'desc' : 'asc');
    }
  };

  return {
    logs,
    isLoading,
    isError,
    totalLogs,
    page,
    pageSize,
    searchQuery,
    sortField,
    sortDirection,
    setSearchQuery,
    setPage,
    setPageSize,
    handleSort,
    refetch,
    deleteLog: deleteLogMutation.mutate,
  };
}
