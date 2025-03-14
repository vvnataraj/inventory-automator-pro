
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { InventoryItem } from "@/types/inventory";
import { EditInventoryItem } from "../EditInventoryItem";
import { inventoryItems } from "@/data/inventoryData";
import { ImageOff } from "lucide-react";

interface InventoryItemImageProps {
  item: InventoryItem;
  onSave?: (updatedItem: InventoryItem) => void;
}

export const InventoryItemImage: React.FC<InventoryItemImageProps> = ({ item, onSave }) => {
  const [imageError, setImageError] = useState(false);
  
  // Calculate total stock across all locations with the same SKU
  const totalStock = React.useMemo(() => {
    const sameSkuItems = inventoryItems.filter(
      (inventoryItem) => inventoryItem.sku === item.sku
    );
    return sameSkuItems.reduce((sum, curr) => sum + curr.stock, 0);
  }, [item.sku]);
  
  // Determine stock level for badge color
  const stockLevel = React.useMemo(() => {
    if (totalStock <= item.lowStockThreshold) {
      return "bg-red-600 text-white font-bold";
    } else if (totalStock <= item.lowStockThreshold * 2) {
      return "bg-yellow-500";
    } else {
      return "bg-green-500";
    }
  }, [totalStock, item.lowStockThreshold]);

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
    console.error(`Failed to load image: ${item.imageUrl}`);
  };

  return (
    <div className="relative pt-[100%] overflow-hidden bg-muted">
      <div className="absolute inset-0 flex items-center justify-center">
        {item.imageUrl && !imageError ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/20">
            {imageError ? (
              <div className="flex flex-col items-center">
                <ImageOff className="w-8 h-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">Image not found</span>
              </div>
            ) : (
              <span className="text-muted-foreground">{item.category}</span>
            )}
          </div>
        )}
      </div>
      
      {onSave && (
        <div className="absolute top-2 left-2 z-10 opacity-80 hover:opacity-100 transition-opacity">
          <EditInventoryItem item={item} onSave={onSave} showLabel={false} />
        </div>
      )}
      
      <Badge 
        className={`absolute top-2 right-2 ${stockLevel}`}
      >
        {totalStock}
      </Badge>
      {!item.isActive && (
        <Badge variant="destructive" className="absolute bottom-2 right-2">
          Discontinued
        </Badge>
      )}
    </div>
  );
};
