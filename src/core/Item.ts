import { Action, ActionParams, Unique } from "./common";
import { LivingEntity } from "./entity/LivingEntity";
import { Game } from "./Game";

export interface ItemData {
    name: string;
    game: Game;
}

export abstract class Item implements Unique {
    uid: number;
    game: Game;
    name: string;

    constructor(data: ItemData) {
        this.game = data.game;
        this.uid = this.game.uidGenerator.generate();
        this.name = data.name;
    }

    abstract getActions(params: ActionParams): Action[];

    // 被装备时调用
    abstract onEquip(entity: LivingEntity): void;
    // 被取消装备时调用
    abstract onUnequip(entity: LivingEntity): void;
}