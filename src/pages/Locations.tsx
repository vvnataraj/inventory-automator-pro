
import { useState } from "react";
import { Building2, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLocations } from "@/hooks/useLocations";
import { AddLocationModal } from "@/components/locations/AddLocationModal";
import { EditLocationModal } from "@/components/locations/EditLocationModal";

export default function Locations() {
  const { locations, addLocation, updateLocation, deleteLocation } = useLocations();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);

  // Filter locations based on search query
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (location: any) => {
    setEditingLocation(location);
    setIsEditModalOpen(true);
  };

  const handleDelete = (locationId: string) => {
    setLocationToDelete(locationId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (locationToDelete) {
      deleteLocation(locationToDelete);
      setLocationToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Locations</h1>
        <AddLocationModal onLocationAdded={addLocation} />
      </div>

      <div className="w-full mb-6">
        <Input
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
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
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(location)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive"
                onClick={() => handleDelete(location.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">No locations found</h3>
          <p className="text-muted-foreground mt-2">
            {searchQuery ? "Try a different search term" : "Add your first location to get started"}
          </p>
        </div>
      )}

      <EditLocationModal
        location={editingLocation}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onLocationUpdated={updateLocation}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this location. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
