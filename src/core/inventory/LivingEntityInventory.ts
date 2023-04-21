import { LivingEntity } from "../entity/LivingEntity";
import { Item } from "../item/Item";
import { GenericInventory } from "./GenericInventory"
import { InventorySlot } from "./InventorySlot";
import { InventorySlotType } from "./InventorySlotType";

export const SLOT_TYPE_WEAPON = new InventorySlotType("weapon", "武器");
export const SLOT_TYPE_ARMOR = new InventorySlotType("armor", "护甲");

export class LivingEntityInventory extends GenericInventory {

    public readonly owner: LivingEntity;
    public readonly weaponSlot = new InventorySlot(this, SLOT_TYPE_WEAPON);
    public readonly armorSlot = new InventorySlot(this, SLOT_TYPE_ARMOR);

    constructor(owner: LivingEntity, items: Item[] = []) {
        super(6, items);
        this.owner = owner;
    }

    getSpecialSlots(): InventorySlot[] {
        return [this.weaponSlot, this.armorSlot];
    }

    getSpecialSlot(type: InventorySlotType): InventorySlot | null {
        switch (type) {
            case SLOT_TYPE_WEAPON: return this.weaponSlot;
            case SLOT_TYPE_ARMOR: return this.armorSlot;
            default: return null;
        }
    }

}