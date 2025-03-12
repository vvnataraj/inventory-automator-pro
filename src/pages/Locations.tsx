import { useState } from "react";
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
import { MainLayout } from "@/components/layout/MainLayout";

const locations = [
  {
    id: "location-1",
    name: "Warehouse A",
    type: "Warehouse",
    itemCount: 345,
    totalUnits: 12000,
    stockValue: 540000,
    spaceUtilization: 75,
  },
  {
    id: "location-2",
    name: "Retail Store - Downtown",
    type: "Retail",
    itemCount: 123,
    totalUnits: 3500,
    stockValue: 185000,
    spaceUtilization: 40,
  },
  {
    id: "location-3",
    name: "Distribution Center",
    type: "Distribution",
    itemCount: 567,
    totalUnits: 25000,
    stockValue: 920000,
    spaceUtilization: 85,
  },
  {
    id: "location-4",
    name: "Storage Unit - Overflow",
    type: "Storage",
    itemCount: 89,
    totalUnits: 2000,
    stockValue: 75000,
    spaceUtilization: 60,
  },
];

export default function Locations() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Locations</h1>
        <Button>Add New Location</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
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
              <Button variant="outline" size="sm" className="flex-1">
                View Items
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Manage
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}
