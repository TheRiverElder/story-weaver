import { Profile } from "./Profile";
import { PropertyType } from "./PropertyType";

export interface ProfileEffector {
    // readonly priority: number;
    effect(value: number, type: PropertyType, profile: Profile): number;
}