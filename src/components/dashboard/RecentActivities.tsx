
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentActivitiesProps {
  className?: string;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ className }) => {
  return (
    <Card className={`${className || ''}`}>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 text-sm p-3 rounded-lg bg-muted/50"
            >
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="font-medium">New order received</p>
                <p className="text-muted-foreground">
                  Order #{Math.floor(Math.random() * 1000000)}
                </p>
              </div>
              <time className="text-muted-foreground">2m ago</time>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
