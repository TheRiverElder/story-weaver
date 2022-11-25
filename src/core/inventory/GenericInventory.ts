import { Item } from "../Item";
import { Inventory } from "./Inventory";
import { InventorySlot } from "./InventorySlot";
import { InventorySlotType } from "./InventorySlotType";

export type InventoryMutationListener = (slot: InventorySlot, previousItem: Item | null) => void;

export abstract class GenericInventory implements Inventory {

    protected readonly indexedSlots: InventorySlot[];
    public readonly listeners = new Set<InventoryMutationListener>();

    constructor(size: number = 1, items: Item[] = []) {
        this.indexedSlots = Array(size).fill(0).map((_, index) => new InventorySlot(this, index, items[index] || null));
    }


    count(): number {
        return this.indexedSlots.filter(slot => !!slot.get()).length;
    }

    getIndexedSlots(): InventorySlot[] {
        return this.indexedSlots.slice();
    }

    getIndexedSlot(index: number): InventorySlot | null {
        return this.indexedSlots[index] || null;
    }

    getItems(): Item[] {
        return this.indexedSlots.filter(slot => !!slot.item).map(slot => slot.item!!);
    }

    abstract getSpecialSlots(): InventorySlot[];
    abstract getSpecialSlot(type: InventorySlotType): InventorySlot | null;

    findEmptyIndexedSlot(): InventorySlot | null {
        return this.indexedSlots.find(slot => !slot.item) || null;
    }

    findIndexedSlotWithItem(item: Item): InventorySlot | null {
        return this.indexedSlots.find(slot => slot.item === item) || null;
    }

    addItem(item: Item): boolean {
        const slot = this.findEmptyIndexedSlot();
        if (slot) {
            slot.set(item);
            return true;
        }
        return false;
    }

    remove(item: Item): boolean {
        const slot = this.findIndexedSlotWithItem(item);
        if (slot) {
            slot.set(null);
            return true;
        }
        return false;
    }

}