
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export interface LocationFormData {
  name: string;
  type: string;
  spaceUtilization: number;
}

interface AddLocationModalProps {
  onLocationAdded: (location: LocationFormData) => void;
}

export function AddLocationModal({ onLocationAdded }: AddLocationModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<LocationFormData>({
    name: "",
    type: "Warehouse",
    spaceUtilization: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Location name is required",
        variant: "destructive",
      });
      return;
    }

    // Pass the data to parent component
    onLocationAdded(formData);
    
    // Reset form and close dialog
    setFormData({
      name: "",
      type: "Warehouse",
      spaceUtilization: 0,
    });
    setOpen(false);
    
    toast({
      title: "Success",
      description: "Location added successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Location</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>
              Create a new inventory location.
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
                placeholder="e.g. Main Warehouse"
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
            <Button type="submit">Add Location</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
