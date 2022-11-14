import { LivingEntity } from "../entity/LivingEntity";
import { Item } from "../Item";

export class NormalItem extends Item {

    onEquip(entity: LivingEntity): void {}
    onUnequip(entity: LivingEntity): void {}
}