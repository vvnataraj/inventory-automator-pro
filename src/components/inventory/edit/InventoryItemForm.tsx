
import React from "react";
import { InventoryItem } from "@/types/inventory";
import { FormField, ImageField } from "../form/FormFields";

interface InventoryItemFormProps {
  formData: InventoryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalStock?: number;
  readOnlyStock?: boolean;
}

export const InventoryItemEditForm: React.FC<InventoryItemFormProps> = ({ 
  formData, 
  onChange,
  totalStock,
  readOnlyStock = false
}) => {
  // Custom handler for image URL changes
  const handleImageChange = (url: string) => {
    console.log("Image URL changed in edit form:", url);
    const imageChangeEvent = {
      target: {
        name: 'imageUrl',
        value: url
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(imageChangeEvent);
  };
  
  return (
    <div className="grid gap-4 py-4">
      <FormField
        label="Name"
        name="name"
        value={formData.name}
        onChange={onChange}
      />
      
      <div className="grid grid-cols-4 items-center gap-4">
        <ImageField 
          imageUrl={formData.imageUrl}
          onChange={handleImageChange}
          inputId="image-edit"
        />
      </div>
      
      <FormField
        label="Cost Price"
        name="cost"
        type="number"
        value={formData.cost}
        onChange={onChange}
      />
      
      <FormField
        label="RRP"
        name="rrp"
        type="number"
        value={formData.rrp || ""}
        onChange={onChange}
      />
      
      <div className="grid grid-cols-4 items-center gap-4">
        <FormField
          label="Stock"
          name="stock"
          type="number"
          value={totalStock !== undefined ? totalStock : formData.stock}
          onChange={onChange}
          readOnly={readOnlyStock}
          disabled={readOnlyStock}
        />
        {readOnlyStock && totalStock !== undefined && (
          <div className="text-sm text-muted-foreground">
            (Total across all locations)
          </div>
        )}
      </div>
      
      <FormField
        label="Reorder Quantity"
        name="minStockCount"
        type="number"
        value={formData.minStockCount}
        onChange={onChange}
      />
      
      <FormField
        label="Location"
        name="location"
        value={formData.location}
        onChange={onChange}
        readOnly={true}
        disabled={true}
      />
    </div>
  );
};
