import { ActionParams, Action } from "../common";
import { ItemEntity } from "../entity/ItemEntity";
import { LivingEntity } from "../entity/LivingEntity";
import { Item, ItemData } from "./Item";

export interface ArmorItemData extends ItemData {
    defense: number;
}

export class ArmorItem extends Item {
    defense: number; 

    constructor(data: ArmorItemData) {
        super(data);
        this.defense = data.defense;
    }

    getItemActions(params: ActionParams): Action[] {
        return [{
            text: "装备",
            act: ({ actor }) => {
                actor.inventory.remove(this);
                actor.equipArmor(this);
            },
            labels: ["equip"],
        }];
    }
    
    onEquip(entity: LivingEntity): void {
        entity.defensePower += this.defense;
    }
    
    onUnequip(entity: LivingEntity): void {
        entity.attackPower -= this.defense;
    }

    getItemEntityActions(entity: ItemEntity, params: ActionParams): Action[] {
        return [{
            text: "装备",
            act: ({ actor }) => {
                actor.equipArmor(this);
                entity.remove();
            },
            labels: ["equip"],
        }];
    }

}