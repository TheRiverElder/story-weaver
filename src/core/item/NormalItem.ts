import { ActionParams, Action } from "../common";
import { LivingEntity } from "../entity/LivingEntity";
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

    getItemActions(params: ActionParams): Action[] {
        return [];
    }

    onEquip(entity: LivingEntity): void {}
    onUnequip(entity: LivingEntity): void {}

    
}