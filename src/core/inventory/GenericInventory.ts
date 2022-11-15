import { Item } from "../Item";
import { Inventory } from "./Inventory";
import { InventorySlot } from "./InventorySlot";
import { InventorySlotType } from "./InventorySlotType";

export abstract class GenericInventory implements Inventory {

    protected readonly items: Item[] = [];
    protected readonly maxSize: number;

    constructor(maxSize: number = Infinity) {
        this.maxSize = maxSize;
    }

    getItems(): Item[] {
        return this.items;
    }

    count(): number {
        return this.items.length;
    }

    get(index: number): Item | null {
        return this.items[index] || null;
    }

    set(index: number, item: Item): boolean {
        if (index >= this.maxSize) return false; 
        this.items[index] = item;
        return true;
    }

    add(item: Item): boolean {
        if (this.count() >= this.maxSize) return false; 
        this.items.push(item);
        return true;
    }

    remove(item: Item): boolean {
        const index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index, 1);
            return true;
        }
        const slot = this.getSlots().find(slot => slot.item === item);
        if (slot) {
            slot.item = null;
            return true;
        }
        return false;
    }

    abstract getSlots(): InventorySlot[];
    abstract getSlot(type: InventorySlotType): InventorySlot | null;

}