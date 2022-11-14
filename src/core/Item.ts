import { Unique } from "./common";
import { LivingEntity } from "./entity/LivingEntity";

export interface ItemData extends Unique {
    name: string;
}

export abstract class Item implements Unique {
    uid: number;
    name: string;

    constructor(data: ItemData) {
        this.uid = data.uid;
        this.name = data.name;
    }

    // 被装备时调用
    abstract onEquip(entity: LivingEntity): void;
    // 被取消装备时调用
    abstract onUnequip(entity: LivingEntity): void;
}