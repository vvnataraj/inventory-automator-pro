
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TransferData } from "@/types/inventory";
import { ArrowLeft, Check, Truck } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface CourierBookingFormProps {
  transferData: TransferData;
  onCancel: () => void;
  onComplete: () => void;
}

const COURIER_SERVICES = [
  { id: "express", name: "Express Delivery (1-2 days)" },
  { id: "standard", name: "Standard Delivery (3-5 days)" },
  { id: "economy", name: "Economy Delivery (5-7 days)" },
];

export const CourierBookingForm = ({ transferData, onCancel, onComplete }: CourierBookingFormProps) => {
  const [courierService, setCourierService] = useState("");
  const [pickupDate, setPickupDate] = useState(format(new Date(Date.now() + 86400000), "yyyy-MM-dd"));
  const [pickupTime, setPickupTime] = useState("09:00");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courierService) {
      toast({
        title: "Please select a courier service",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to book courier
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Courier Booked",
        description: `Your shipment has been booked for pickup on ${format(new Date(pickupDate), "MMM dd, yyyy")} at ${pickupTime}.`,
      });
      
      onComplete();
    }, 1500);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Book a Courier</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 my-4">
        <div className="space-y-2">
          <Label htmlFor="reference">Reference Number</Label>
          <Input 
            id="reference" 
            value={transferData.referenceNumber} 
            readOnly 
            className="bg-gray-50"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fromLocation">From Location</Label>
            <Input 
              id="fromLocation" 
              value={transferData.fromLocation} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toLocation">To Location</Label>
            <Input 
              id="toLocation" 
              value={transferData.toLocation} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="courier">Courier Service</Label>
          <Select 
            value={courierService} 
            onValueChange={setCourierService}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select courier service" />
            </SelectTrigger>
            <SelectContent>
              {COURIER_SERVICES.map(service => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pickupDate">Pickup Date</Label>
            <Input 
              id="pickupDate" 
              type="date" 
              value={pickupDate}
              min={format(new Date(), "yyyy-MM-dd")}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickupTime">Pickup Time</Label>
            <Input 
              id="pickupTime" 
              type="time" 
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instructions">Special Instructions (Optional)</Label>
          <Input 
            id="instructions" 
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special instructions for the courier"
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium text-sm mb-2">Shipment Details</h3>
          <p className="text-sm text-gray-600">
            Item: {transferData.item.name}<br />
            Quantity: {transferData.quantity}<br />
            Weight: {transferData.item.weight || "N/A"} {transferData.item.weightUnit || ""}
          </p>
        </div>
      </form>
      
      <DialogFooter className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="w-full sm:w-auto gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={!courierService || isSubmitting}
          className="w-full sm:w-auto gap-2"
        >
          {isSubmitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Truck className="h-4 w-4" />
          )}
          Book Courier
        </Button>
      </DialogFooter>
    </>
  );
};
