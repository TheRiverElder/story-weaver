import { ActionParams } from "./common";
import { Entity } from "./Entity";
import { PROPERTY_TYPE_WATCH } from "./entity/PlayerEntity";
import { Item } from "./Item";
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

export function createItemClue(item: Item, skill: PropertyType = PROPERTY_TYPE_WATCH): Clue {
    return {
        validSkills: new Set<PropertyType>([skill]),
        discoverd: false,
        text: `身上有${item.name}`,
        onDiscover: (clue, entity, { actor }) => {
            actor.appendOrDropItem(item);
        },
    };
}

export function createTextClue(text: string, skill: PropertyType = PROPERTY_TYPE_WATCH): Clue {
    return {
        validSkills: new Set<PropertyType>([skill]),
        discoverd: false,
        text,
    };
}