import { Item } from "../Item";
import { InventorySlotType } from "./InventorySlotType";

export class InventorySlot {
    public readonly type: InventorySlotType;
    public item: Item | null;

    constructor(type: InventorySlotType, item: Item | null = null) {
        this.type = type;
        this.item = item;
    }
}