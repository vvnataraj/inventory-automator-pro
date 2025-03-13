
import { InventoryItem } from "@/types/inventory";
import { fastenersItems } from "./categories/fasteners";
import { toolsItems } from "./categories/tools";
import { buildingMaterialsItems } from "./categories/buildingMaterials";
import { hardwareItems } from "./categories/hardware";
import { storageItems } from "./categories/storage";
import { paintItems } from "./categories/paint";
import { electricalItems } from "./categories/electrical";
import { gardenItems } from "./categories/garden";

// Combine all inventory items from different categories
export const staticInventoryItems: InventoryItem[] = [
  ...fastenersItems,
  ...toolsItems,
  ...buildingMaterialsItems,
  ...hardwareItems,
  ...storageItems,
  ...paintItems,
  ...electricalItems,
  ...gardenItems
];

// Generate the inventory items once
export const inventoryItems = staticInventoryItems;
