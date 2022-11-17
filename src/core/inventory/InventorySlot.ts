import { Item } from "../Item";
import { GenericInventory } from "./GenericInventory";
import { InventorySlotType } from "./InventorySlotType";

export const SLOT_TYPE_INDEXED = new InventorySlotType("indexed", "索引位");

export class InventorySlot {
    public readonly inventory: GenericInventory;
    public readonly type: InventorySlotType;
    public readonly index: number;
    public item: Item | null;

    constructor(inventory: GenericInventory, typeOrIndex: InventorySlotType | number, item: Item | null = null) {
        this.inventory = inventory;
        if (typeof typeOrIndex === "number") {
            this.type = SLOT_TYPE_INDEXED;
            this.index = typeOrIndex;
        } else {
            this.type = typeOrIndex;
            this.index = -1;
        }
        this.item = item;
    }

    get(): Item | null {
        return this.item;
    }

    set(item: Item | null): Item | null {
        const old = this.item;
        this.item = item;
        this.inventory.listeners.forEach(l => l(this, old));
        return old;
    }
}