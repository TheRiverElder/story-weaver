import { LivingEntity } from "../entity/LivingEntity";
import { Item, ItemData } from "../Item";

export interface MeleeWeaponData extends ItemData {
    damage: number; // 基础伤害
}

export class MeleeWeapon extends Item {
    damage: number; // 基础伤害

    constructor(data: MeleeWeaponData) {
        super(data);
        this.damage = data.damage;
    }
    
    onEquip(entity: LivingEntity): void {
        entity.attackPower += this.damage;
    }
    
    onUnequip(entity: LivingEntity): void {
        entity.attackPower -= this.damage;
    }

}