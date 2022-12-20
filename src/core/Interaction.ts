import { LivingEntity } from "./entity/LivingEntity";
import { PropertyType } from "./profile/PropertyType";

export interface InterativeMedia {
    onApply(interaction: Interaction): void;
}

export interface InterativeTarget {
    onReceive(interaction: Interaction): void;
}

export interface Interaction {
    readonly actor: LivingEntity;
    readonly media: InterativeMedia;
    readonly skill: PropertyType;
    readonly target: InterativeTarget;
}