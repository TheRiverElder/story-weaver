import { LivingEntity } from "./entity/LivingEntity";
import { PlayerEntity } from "./entity/PlayerEntity";
import { PropertyType } from "./profile/PropertyType";

export interface InteractionMedia {
    onApply(interaction: Interaction): void;
}

export interface InteractionTarget {
    canInteract(): boolean;
    onReceive(interaction: Interaction): void;
}

export interface Interaction {
    readonly actor: PlayerEntity;
    readonly media: InteractionMedia | null;
    readonly skill: PropertyType;
    readonly target: InteractionTarget;
}