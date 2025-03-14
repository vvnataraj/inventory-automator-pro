
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { LogsHeader } from "@/components/logs/LogsHeader";
import { LogsTable } from "@/components/logs/LogsTable";
import { useLogs } from "@/hooks/useLogs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRoles } from "@/hooks/useUserRoles";
import { toast } from "sonner";
import { SimplePagination } from "@/components/common/SimplePagination";

export default function Logs() {
  const { user } = useAuth();
  const { isManager } = useUserRoles();
  
  const {
    logs,
    isLoading,
    isError,
    totalLogs,
    page,
    pageSize,
    searchQuery,
    sortField,
    sortDirection,
    handleSort,
    setSearchQuery,
    setPage,
    refetch,
    deleteLog,
  } = useLogs();
  
  const totalPages = Math.ceil(totalLogs / pageSize);
  
  // If not authenticated or not a manager, show access denied
  if (!user || !isManager()) {
    return (
      <MainLayout>
        <div className="container py-10">
          <h1 className="text-2xl font-bold mb-4">Activity Logs</h1>
          <div className="bg-destructive/10 p-4 rounded-md">
            <p className="text-destructive">Access denied. You must be a manager to view this page.</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (isError) {
    toast.error("Failed to load logs. Please try again later.");
  }
  
  return (
    <MainLayout>
      <div className="container py-10">
        <LogsHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          refreshLogs={() => refetch()}
        />
        
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <LogsTable
            logs={logs}
            isLoading={isLoading}
            deleteLog={deleteLog}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          
          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {logs.length} of {totalLogs} logs
              </div>
              <SimplePagination 
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
