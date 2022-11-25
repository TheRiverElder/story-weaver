import { Action, ActionParams, Unique } from "./common";
import { Entity } from "./Entity";
import { LivingEntity } from "./entity/LivingEntity";
import { PlayerEntity } from "./entity/PlayerEntity";
import { Game } from "./Game";
import { Profile } from "./profile/Profile";
import { ProfileEffector } from "./profile/ProfileEffector";
import { PropertyType } from "./profile/PropertyType";

export interface ItemData {
    name: string;
    game: Game;
}

export abstract class Item implements Unique, ProfileEffector {
    uid: number;
    game: Game;
    name: string;

    constructor(data: ItemData) {
        this.game = data.game;
        this.uid = this.game.uidGenerator.generate();
        this.name = data.name;
    }
    
    effect(value: number, type: PropertyType, profile: Profile): number {
        return value;
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