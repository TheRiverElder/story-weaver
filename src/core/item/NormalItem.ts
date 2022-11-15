import { ActionParams, Action } from "../common";
import { LivingEntity } from "../entity/LivingEntity";
import { Item } from "../Item";

export class NormalItem extends Item {

    getActions(params: ActionParams): Action[] {
        return [];
    }

    onEquip(entity: LivingEntity): void {}
    onUnequip(entity: LivingEntity): void {}
}