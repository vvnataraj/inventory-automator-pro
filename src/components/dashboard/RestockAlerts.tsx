
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, AlertTriangle, ArrowRight } from "lucide-react";
import { Sale } from "@/types/sale";
import { Badge } from "@/components/ui/badge";

interface RestockAlertsProps {
  sales: Sale[];
  className?: string;
}

export const RestockAlerts: React.FC<RestockAlertsProps> = ({ sales, className }) => {
  const navigate = useNavigate();
  
  // Static values that won't change on refresh
  const criticalCount = 1;
  const warningCount = 3;
  
  const handleViewDetails = () => {
    navigate("/analytics?tab=predictive");
  };
  
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Inventory Alerts</h3>
        </div>
        
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-medium">Critical Restock</p>
                <p className="text-sm text-muted-foreground">Items needing immediate restock</p>
              </div>
            </div>
            <Badge variant="destructive" className="text-lg h-7 px-2">
              {criticalCount}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-medium">Warning Restock</p>
                <p className="text-sm text-muted-foreground">Items running low on stock</p>
              </div>
            </div>
            <Badge variant="outline" className="text-lg h-7 px-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
              {warningCount}
            </Badge>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 justify-between"
          onClick={handleViewDetails}
        >
          View Inventory Prediction 
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
