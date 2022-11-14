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

    abstract getSlots(): InventorySlot[];
    abstract getSlot(type: InventorySlotType): InventorySlot | null;

}