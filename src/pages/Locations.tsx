
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { locations } from "@/data/inventoryData";

export default function Locations() {
  const [locationList, setLocationList] = useState(locations);
  const [newLocation, setNewLocation] = useState("");
  const { toast } = useToast();

  const handleAddLocation = () => {
    if (!newLocation.trim()) {
      toast({
        title: "Location name required",
        description: "Please enter a name for the new location",
        variant: "destructive",
      });
      return;
    }

    if (locationList.includes(newLocation)) {
      toast({
        title: "Location already exists",
        description: "This location already exists in the system",
        variant: "destructive",
      });
      return;
    }

    setLocationList([...locationList, newLocation]);
    setNewLocation("");
    toast({
      title: "Location added",
      description: `Successfully added ${newLocation} to locations`,
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">Location Management</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter location name..."
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                    />
                    <Button onClick={handleAddLocation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {locationList.map((location) => (
                    <div
                      key={location}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{location}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
