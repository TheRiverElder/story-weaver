import { PlayerEntity } from "./entity/PlayerEntity";
import { InvestigatableObject } from "./InvestigatableObject";
import { PropertyType } from "./profile/PropertyType";

export interface InteractionMedia {
    onUse(interaction: Interaction): void;
}

export interface InteractionTarget extends InvestigatableObject {
    canInteract(): boolean;
    // onReceive(interaction: Interaction): void;
}

export interface Interaction {
    readonly actor: PlayerEntity;
    readonly media: InteractionMedia | null;
    readonly skill: PropertyType;
    readonly target: InteractionTarget;
}