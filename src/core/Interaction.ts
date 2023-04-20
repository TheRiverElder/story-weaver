import { PlayerEntity } from "./entity/PlayerEntity";
import { PropertyType } from "./profile/PropertyType";

export const MEDIA_EMPTY: InteractionMedia = {
    onUse(interaction: Interaction): void { }
};

export interface InteractionMedia {
    onUse(interaction: Interaction): void;
}

export interface InteractionTarget {
    canInteract(actor: PlayerEntity, skill: PropertyType): boolean;
    onInteract(interaction: Interaction): void;
}

export interface Interaction {
    readonly actor: PlayerEntity;
    readonly media: InteractionMedia;
    readonly skill: PropertyType;
    readonly target: InteractionTarget;
}