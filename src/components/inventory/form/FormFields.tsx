
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploadField } from "./ImageUploadField";

// Available locations for the dropdown - use exact names from the data
export const availableLocations = ["Warehouse A", "Warehouse B", "Storefront", "Online"];

interface FormFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
  min?: string;
  step?: string;
  readOnly?: boolean;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder,
  type = "text",
  min,
  step,
  readOnly = false,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={name} className="text-right">
        {label} {required && "*"}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="col-span-3"
        required={required}
        placeholder={placeholder}
        min={min}
        step={step}
        readOnly={readOnly}
        disabled={disabled}
      />
    </div>
  );
};

interface LocationSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
}

export const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onValueChange,
  required = false,
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="location" className="text-right">
        Location {required && "*"}
      </Label>
      <div className="col-span-3">
        <Select value={value} onValueChange={onValueChange} required={required}>
          <SelectTrigger>
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {availableLocations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

interface ImageFieldProps {
  imageUrl?: string;
  onChange: (url: string) => void;
  inputId?: string;
}

export const ImageField: React.FC<ImageFieldProps> = ({
  imageUrl,
  onChange,
  inputId = "image",
}) => {
  console.log("ImageField rendering with imageUrl:", imageUrl);
  
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={inputId} className="text-right">
        Image
      </Label>
      <ImageUploadField 
        imageUrl={imageUrl} 
        onImageChange={onChange}
        inputId={inputId}
      />
    </div>
  );
};
