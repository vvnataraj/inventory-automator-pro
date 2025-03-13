
import React from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LocationCardProps {
  location: {
    id: string;
    name: string;
    type: string;
    itemCount: number;
    totalUnits: number;
    stockValue: number;
    spaceUtilization: number;
  };
  onEdit: (location: any) => void;
  onDelete: (locationId: string) => void;
  onCall: (phoneNumber: string) => void;
}

export function LocationCard({ location, onEdit, onDelete, onCall }: LocationCardProps) {
  return (
    <Card key={location.id}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          {location.name}
        </CardTitle>
        <CardDescription>{location.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stock Items:</span>
            <span className="font-medium">{location.itemCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Units:</span>
            <span className="font-medium">{location.totalUnits}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stock Value:</span>
            <span className="font-medium">${location.stockValue.toLocaleString()}</span>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium mb-1">Space Utilization</div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${location.spaceUtilization}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{location.spaceUtilization}% used</span>
              <span>{100 - location.spaceUtilization}% available</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(location)}>
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-destructive hover:text-destructive"
          onClick={() => onDelete(location.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
