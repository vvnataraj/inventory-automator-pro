
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CollapseButtonProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

export function CollapseButton({ collapsed, toggleCollapse }: CollapseButtonProps) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleCollapse} 
      className="flex-shrink-0"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
    </Button>
  );
}
