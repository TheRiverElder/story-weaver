import { Interaction } from "../interaction/Interaction";
import CustomAction from "../action/impl/CustomAction";
import Action from "../action/Action";
import { PlayerEntity } from "../entity/PlayerEntity";
import Entity from "../structure/Entity";
import { Item, ItemData } from "./Item";

export interface MeleeWeaponData extends ItemData {
    damage: number; // 基础伤害
}

export class MeleeWeapon extends Item {
    damage: number; // 基础伤害

    constructor(data: MeleeWeaponData) {
        super(data);
        this.damage = data.damage;
    }

    getItemActions(actor: PlayerEntity): Action[] {
        return [new CustomAction({
            text: "装备",
            act: (actor) => {
                actor.inventory.remove(this);
                const oldItem = actor.hand.setHeldItem(this);
                if(oldItem != null){
                    actor.inventory.add(oldItem); // 如果有旧物品，则将其放回背包
                }
            },
            labels: ["eat"],
        })];
    }
    
    onEquip(entity: Entity, slotIndex: number): void {
        // TODO
    }
    
    onUnequip(entity: Entity, slotIndex: number): void {
        // TODO
    }

    onApplyInteraction(interaction: Interaction): void {
        // TODO
    }

    getItemEntityActions(entity: Entity, actor: PlayerEntity): Action[] {
        return [new CustomAction({
            text: "装备",
            act: (actor) => {
                entity.removeFromSite();
                actor.hand.setHeldItem(this);
            },
            labels: ["eat"],
        })];
    }

}