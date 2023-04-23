import { Entity } from "../entity/Entity";
import { ItemEntity } from "../entity/ItemEntity";
import { LivingEntity } from "../entity/LivingEntity";
import { PlayerEntity } from "../entity/PlayerEntity";
import { Game } from "./Game";
import { Profile } from "../profile/Profile";
import { ProfileEffector } from "../profile/ProfileEffector";
import { PropertyType } from "../profile/PropertyType";
import { Interaction, InteractionMedia } from "../interaction/Interaction";
import Action from "../action/Action";
import { Unique } from "../BasicTypes";

export interface ItemData {
    name: string;
    game: Game;
}

export abstract class Item implements Unique, ProfileEffector, InteractionMedia {
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

    abstract getItemActions(actor: PlayerEntity): Action[];

    getItemEntityActions(entity: ItemEntity, actor: PlayerEntity): Action[] { 
        return []; 
    }

    // 被装备时调用
    onEquip(entity: LivingEntity): void { }
    // 被取消装备时调用
    onUnequip(entity: LivingEntity): void { }

    getUsageActions(actor: PlayerEntity, target: Entity | null): Action[] {
        return [];
    }

    onApplyInteraction(interaction: Interaction) { }
}