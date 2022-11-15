import { LivingEntity } from "../entity/LivingEntity";
import { GenericInventory } from "./GenericInventory"
import { InventorySlot } from "./InventorySlot";
import { InventorySlotType } from "./InventorySlotType";

export const SLOT_TYPE_WEAPON = new InventorySlotType("weapon", "武器");
export const SLOT_TYPE_ARMOR = new InventorySlotType("armor", "护甲");

export class LivingEntityInventory extends GenericInventory {

    public readonly owner: LivingEntity;
    public readonly weaponSlot = new InventorySlot(SLOT_TYPE_WEAPON);
    public readonly armorSlot = new InventorySlot(SLOT_TYPE_ARMOR);

    constructor(owner: LivingEntity) {
        super();
        this.owner = owner;
    }

    getSlots(): InventorySlot[] {
        return [this.weaponSlot, this.armorSlot];
    }

    getSlot(type: InventorySlotType): InventorySlot | null {
        switch (type) {
            case SLOT_TYPE_WEAPON: return this.weaponSlot;
            case SLOT_TYPE_ARMOR: return this.armorSlot;
            default: return null;
        }
    }

}