
import React from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface LocationsTableProps {
  locations: Array<{
    id: string;
    name: string;
    type: string;
    itemCount: number;
    totalUnits: number;
    stockValue: number;
    spaceUtilization: number;
    phoneNumber?: string;
  }>;
  onEdit: (location: any) => void;
  onDelete: (locationId: string) => void;
  onCall: (phoneNumber: string) => void;
}

export function LocationsTable({ locations, onEdit, onDelete, onCall }: LocationsTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Item Count</TableHead>
              <TableHead>Total Units</TableHead>
              <TableHead>Stock Value</TableHead>
              <TableHead>Space Utilization</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>{location.type}</TableCell>
                <TableCell>
                  {location.phoneNumber ? (
                    <div className="flex items-center gap-2">
                      <span>{location.phoneNumber}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                        onClick={() => onCall(location.phoneNumber || "")}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">None</span>
                  )}
                </TableCell>
                <TableCell>{location.itemCount}</TableCell>
                <TableCell>{location.totalUnits}</TableCell>
                <TableCell>${location.stockValue.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${location.spaceUtilization}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{location.spaceUtilization}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(location)}>
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(location.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
