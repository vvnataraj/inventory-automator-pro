
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { LocationFormData } from "./AddLocationModal";

interface EditLocationModalProps {
  location: {
    id: string;
    name: string;
    type: string;
    spaceUtilization: number;
    [key: string]: any;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationUpdated: (id: string, location: LocationFormData) => void;
}

export function EditLocationModal({ 
  location, 
  open, 
  onOpenChange, 
  onLocationUpdated 
}: EditLocationModalProps) {
  const [formData, setFormData] = useState<LocationFormData>({
    name: "",
    type: "Warehouse",
    spaceUtilization: 0,
  });

  // Update form when location changes
  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name,
        type: location.type,
        spaceUtilization: location.spaceUtilization,
      });
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location || !formData.name) {
      toast({
        title: "Error",
        description: "Location name is required",
        variant: "destructive",
      });
      return;
    }

    // Pass the data to parent component
    onLocationUpdated(location.id, formData);
    onOpenChange(false);
    
    toast({
      title: "Success",
      description: "Location updated successfully",
    });
  };

  if (!location) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>
              Update location information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                  <SelectItem value="Retail">Retail Store</SelectItem>
                  <SelectItem value="Distribution">Distribution Center</SelectItem>
                  <SelectItem value="Storage">Storage Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="spaceUtilization" className="text-right">
                Space Utilization (%)
              </Label>
              <Input
                id="spaceUtilization"
                type="number"
                min="0"
                max="100"
                value={formData.spaceUtilization}
                onChange={(e) => setFormData({ ...formData, spaceUtilization: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Update Location</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
