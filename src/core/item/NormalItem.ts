import Action from "../action/Action";
import { LivingEntity } from "../entity/LivingEntity";
import { PlayerEntity } from "../entity/PlayerEntity";
import { Item } from "./Item";

// export interface Usage {
//     text: string;
//     onUse: (actor: PlayerEntity, target: Entity | null) => void;
// }

// export interface NormalItemData extends ItemData {
//     usages?: Usage[];
// }

export class NormalItem extends Item {
    // usages: Usage[];

    // constructor(data: NormalItemData) {
    //     super(data);
    //     this.usages = data.usages || [];
    // }

    getItemActions(actor: PlayerEntity): Action[] {
        return [];
    }

    onEquip(entity: LivingEntity): void {}
    onUnequip(entity: LivingEntity): void {}

    
}