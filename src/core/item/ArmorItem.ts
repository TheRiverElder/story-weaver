import { LivingEntity } from "../entity/LivingEntity";
import { Item, ItemData } from "../Item";

export interface ArmorItemData extends ItemData {
    defense: number;
}

export class ArmorItem extends Item {
    defense: number; 

    constructor(data: ArmorItemData) {
        super(data);
        this.defense = data.defense;
    }
    
    onEquip(entity: LivingEntity): void {
        entity.defensePower += this.defense;
    }
    
    onUnequip(entity: LivingEntity): void {
        entity.attackPower -= this.defense;
    }

}