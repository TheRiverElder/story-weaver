import { Item } from "../Item";
import { InventorySlot } from "./InventorySlot";
import { InventorySlotType } from "./InventorySlotType";

export interface Inventory {
    getItems(): Item[];
    count(): number;
    get(index: number): Item | null;
    set(index: number, item: Item): boolean;
    add(item: Item): boolean;

    getSlots(): InventorySlot[];
    getSlot(type: InventorySlotType): InventorySlot | null;

}