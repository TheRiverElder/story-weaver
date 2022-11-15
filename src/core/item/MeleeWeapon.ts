import { ActionParams, Action } from "../common";
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

    getActions(params: ActionParams): Action[] {
        return [{
            text: "装备",
            act: ({ actor }) => {
                actor.inventory.remove(this);
                actor.equipWeapon(this);
            },
        }];
    }
    
    onEquip(entity: LivingEntity): void {
        entity.attackPower += this.damage;
    }
    
    onUnequip(entity: LivingEntity): void {
        entity.attackPower -= this.damage;
    }

}