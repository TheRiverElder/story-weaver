import Action from "../action/Action";
import CustomAction from "../action/impl/CustomAction";
import { ItemEntity } from "../entity/ItemEntity";
import { LivingEntity } from "../entity/LivingEntity";
import { PlayerEntity } from "../entity/PlayerEntity";
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

    getItemActions(actor: PlayerEntity): Action[] {
        return [new CustomAction({
            text: "装备",
            act: (actor) => {
                actor.inventory.remove(this);
                actor.equipArmor(this);
            },
            labels: ["equip"],
        })];
    }
    
    onEquip(entity: LivingEntity): void {
        entity.defensePower += this.defense;
    }
    
    onUnequip(entity: LivingEntity): void {
        entity.attackPower -= this.defense;
    }

    getItemEntityActions(entity: ItemEntity, actor: PlayerEntity): Action[] {
        return [new CustomAction({
            text: "装备",
            act: (actor) => {
                actor.equipArmor(this);
                entity.remove();
            },
            labels: ["equip"],
        })];
    }

}