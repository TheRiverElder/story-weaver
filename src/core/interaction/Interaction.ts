import { PlayerEntity } from "../entity/PlayerEntity";
import { PropertyType } from "../profile/PropertyType";

export interface InteractionMedia {
    onApplyInteraction(interaction: Interaction): void;
}

export interface InteractionTarget {
    canReceiveInteraction(interaction: Interaction): boolean;
    onReceiveInteraction(interaction: Interaction): void;
}

export interface Interaction {
    readonly actor: PlayerEntity; // 使用者，一般指玩家自己
    readonly media: InteractionMedia; // 一般来说是指手持的道具，可以为空（但不是null）
    readonly skill: PropertyType; // 使用的技能，可以为空（但不是null）
    readonly target: InteractionTarget; // 接受该行动的目标
}

export const INTERACTION_MEDIA_EMPTY: InteractionMedia = {
    onApplyInteraction(interaction: Interaction): void { }
};

export const INTERACTION_TARGET_EMPTY: InteractionTarget = {
    canReceiveInteraction: function (interaction: Interaction): boolean {
        return false;
    },
    onReceiveInteraction: function (interaction: Interaction): void { },
};