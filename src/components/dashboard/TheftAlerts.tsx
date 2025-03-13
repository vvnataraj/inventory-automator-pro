
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TheftAlertsProps {
  className?: string;
}

export const TheftAlerts: React.FC<TheftAlertsProps> = ({ className }) => {
  const navigate = useNavigate();
  
  // Static value for theft incidents
  const theftIncidents = 5;
  
  const handleViewDetails = () => {
    navigate("/analytics?tab=theft");
  };
  
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Theft Alerts</h3>
        </div>
        
        <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
              <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-medium">Theft Incidents</p>
              <p className="text-sm text-muted-foreground">Detected in the last week</p>
            </div>
          </div>
          <Badge variant="destructive" className="text-lg h-7 px-2">
            {theftIncidents}
          </Badge>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 justify-between"
          onClick={handleViewDetails}
        >
          View Theft Detection 
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
