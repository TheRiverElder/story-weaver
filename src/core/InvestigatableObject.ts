import { ActionParams } from "./common";
import { Entity } from "./Entity";
import { PropertyType } from "./profile/PropertyType";


export interface Clue {
    validSkills: Set<PropertyType>;
    text: string;
    discoverd: boolean;
    onDiscover?: (clue: Clue, entity: Entity, params: ActionParams) => void;
}

export interface InvestigatableObject {
    clues: Clue[];
    maxInvestigationAmount: number;
    investigationAmount: number;
}