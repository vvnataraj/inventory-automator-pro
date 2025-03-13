
import React from "react";
import { Button } from "@/components/ui/button";
import { Grid, Table } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => setViewMode("grid")}
        className={viewMode === "grid" ? "bg-muted" : ""}
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => setViewMode("table")}
        className={viewMode === "table" ? "bg-muted" : ""}
      >
        <Table className="h-4 w-4" />
      </Button>
    </div>
  );
};
