import { ActionParams, Action } from "../common";
import { ItemEntity } from "../entity/ItemEntity";
import { LivingEntity } from "../entity/LivingEntity";
import { Interaction } from "../Interaction";
import { Item, ItemData } from "../Item";
import { FightingTask } from "../task/FightingTask";

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

    onUse(interaction: Interaction): void {
        if (interaction.target instanceof LivingEntity) {
            this.game.appendInteravtiveGroup(new FightingTask(this.game, [interaction.actor, interaction.target]));
        }
    }

    getActionsAsEntity(entity: ItemEntity, params: ActionParams): Action[] {
        return [{
            text: "装备",
            act: ({ actor }) => {
                actor.equipWeapon(this);
                entity.remove();
            },
        }];
    }

}