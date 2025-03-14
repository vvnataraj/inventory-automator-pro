
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Warehouse, 
  AlertTriangle, 
  ArrowRightLeft, 
  ShieldAlert, 
  Users,
  Clock
} from "lucide-react";

export const PromoVideoScript: React.FC = () => {
  const scenes = [
    {
      id: 1,
      title: "Inventory Management Across Locations",
      description: "Track your inventory seamlessly across multiple warehouses and stores",
      icon: <Warehouse className="h-5 w-5" />,
      duration: "0:00 - 0:05",
      visual: "Split screen showing multiple warehouse locations with synchronized inventory counts"
    },
    {
      id: 2,
      title: "Low Stock Alerts",
      description: "Never run out of stock with intelligent reordering alerts",
      icon: <AlertTriangle className="h-5 w-5" />,
      duration: "0:06 - 0:11",
      visual: "Animated notification appearing when stock falls below threshold, followed by reorder form"
    },
    {
      id: 3,
      title: "Effortless Inventory Transfers",
      description: "Move stock between locations with just a few clicks",
      icon: <ArrowRightLeft className="h-5 w-5" />,
      duration: "0:12 - 0:17",
      visual: "Animation showing inventory moving from one location to another with simple UI interaction"
    },
    {
      id: 4,
      title: "Theft Detection Analytics",
      description: "Identify discrepancies and prevent loss with advanced analytics",
      icon: <ShieldAlert className="h-5 w-5" />,
      duration: "0:18 - 0:23",
      visual: "Charts showing anomaly detection with highlighted inventory discrepancies"
    },
    {
      id: 5,
      title: "Customer Satisfaction",
      description: "Keep customers happy with reliable stock availability",
      icon: <Users className="h-5 w-5" />,
      duration: "0:24 - 0:30",
      visual: "Satisfied customer receiving product with overlay of high satisfaction metrics"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Inventory Management System</CardTitle>
              <CardDescription>30-Second Promotional Video Script</CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> 0:30
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Voice-over: "Transform your inventory management with our powerful system designed to boost efficiency and cut costs."
          </p>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {scenes.map((scene) => (
          <Card key={scene.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    {scene.icon}
                  </div>
                  <h3 className="font-medium">{scene.title}</h3>
                </div>
                <Badge variant="outline">{scene.duration}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{scene.description}</p>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-xs font-medium uppercase text-muted-foreground mb-1">Visual:</p>
                <p className="text-sm">{scene.visual}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mt-8">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Voice-over (closing): "Start optimizing your inventory management today. Sign up now for a free trial!"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoVideoScript;
