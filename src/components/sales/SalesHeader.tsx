
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useUserRoles } from "@/hooks/useUserRoles";

interface SalesHeaderProps {
  onCreateClick: () => void;
}

export const SalesHeader: React.FC<SalesHeaderProps> = ({ onCreateClick }) => {
  const { isManager, role } = useUserRoles();
  
  console.log("Current role in SalesHeader:", role);
  console.log("Is manager?", isManager());
  
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-semibold tracking-tight">Sales</h1>
      {isManager() && (
        <div className="flex gap-2">
          <Button 
            onClick={onCreateClick}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Sale
          </Button>
        </div>
      )}
    </div>
  );
};
