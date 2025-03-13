
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLocations } from "@/hooks/useLocations";
import { EditLocationModal } from "@/components/locations/EditLocationModal";
import { ListControls, ViewMode } from "@/components/common/ListControls";
import { toast } from "@/components/ui/use-toast";
import { LocationCard } from "@/components/locations/LocationCard";
import { LocationsTable } from "@/components/locations/LocationsTable";
import { EmptyLocationsState } from "@/components/locations/EmptyLocationsState";
import { DeleteLocationDialog } from "@/components/locations/DeleteLocationDialog";
import { LocationsHeader } from "@/components/locations/LocationsHeader";

type SortField = "name" | "type" | "itemCount" | "totalUnits" | "stockValue" | "spaceUtilization";
type SortDirection = "asc" | "desc";

export default function Locations() {
  const { locations, addLocation, updateLocation, deleteLocation } = useLocations();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);

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

  const handleCall = (phoneNumber: string) => {
    if (!phoneNumber) {
      toast({
        title: "No phone number",
        description: "This location doesn't have a phone number set.",
        variant: "destructive",
      });
      return;
    }
    
    // Format the phone number for dialing
    const formattedNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // Create a link to initiate a call
    window.location.href = `tel:${formattedNumber}`;
    
    toast({
      title: "Initiating call",
      description: `Calling ${phoneNumber}`,
    });
  };

  const handleSort = (field: string) => {
    const locationField = field as SortField;
    if (locationField === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(locationField);
      setSortDirection('asc');
    }
  };

  const sortOptions = [
    { field: 'name', label: 'Name' },
    { field: 'type', label: 'Type' },
    { field: 'itemCount', label: 'Item Count' },
    { field: 'totalUnits', label: 'Total Units' },
    { field: 'stockValue', label: 'Stock Value' },
    { field: 'spaceUtilization', label: 'Space Utilization' },
  ];

  const getSortedLocations = () => {
    return [...filteredLocations].sort((a, b) => {
      let valueA: any = a[sortField];
      let valueB: any = b[sortField];

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  return (
    <MainLayout>
      <LocationsHeader onLocationAdded={addLocation} />

      <ListControls 
        searchPlaceholder="Search locations..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        availableViewModes={["grid", "table"]}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSort}
        onSortDirectionChange={setSortDirection}
        sortOptions={sortOptions}
      />

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getSortedLocations().map((location) => (
            <LocationCard 
              key={location.id}
              location={location}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCall={handleCall}
            />
          ))}
        </div>
      ) : (
        <LocationsTable
          locations={getSortedLocations()}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCall={handleCall}
        />
      )}

      {filteredLocations.length === 0 && (
        <EmptyLocationsState searchQuery={searchQuery} />
      )}

      <EditLocationModal
        location={editingLocation}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onLocationUpdated={updateLocation}
      />

      <DeleteLocationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
      />
    </MainLayout>
  );
}
