import { InventorySlot } from "./InventorySlot";
import { InventorySlotType } from "./InventorySlotType";

export interface Inventory {
    count(): number;

    getIndexedSlots(): InventorySlot[];
    getIndexedSlot(index: number): InventorySlot | null;

    getSpecialSlots(): InventorySlot[];
    getSpecialSlot(type: InventorySlotType): InventorySlot | null;

}