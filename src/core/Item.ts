import { Action, ActionParams, Unique } from "./common";
import { Entity } from "./Entity";
import { LivingEntity } from "./entity/LivingEntity";
import { PlayerEntity } from "./entity/PlayerEntity";
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
    onEquip(entity: LivingEntity): void { }
    // 被取消装备时调用
    onUnequip(entity: LivingEntity): void { }

    getUsageActions(actor: PlayerEntity, target: Entity | null): Action[] {
        return [];
    }
}