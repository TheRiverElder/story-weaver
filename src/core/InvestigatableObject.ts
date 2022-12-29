import { ActionParams } from "./common";
import { Entity } from "./Entity";
import { PlayerEntity } from "./entity/PlayerEntity";
import { Game } from "./Game";
import { Interaction, InteractionTarget } from "./Interaction";
import { Item } from "./Item";
import { PROPERTY_TYPE_WATCH } from "./profile/PropertyTypes";
import { PropertyType } from "./profile/PropertyType";
import { simpleCheck } from "./task/FightingTask";


export interface Clue {
    validSkills: Set<PropertyType>;
    text: string;
    discoverd: boolean;
    onDiscover?: (clue: Clue, entity: Entity, params: ActionParams) => void;
}

export interface InvestigatableObject {
    canInvestigate(actor: PlayerEntity): boolean;
    onInvestigate(actor: PlayerEntity, skill: PropertyType): void;
    getDiscoveredClues(actor: PlayerEntity): Clue[];
}

export interface GenericInvestigatableObjectData {
    clues?: Clue[];
    maxInvestigationAmount?: number;
    investigationAmount?: number;
}

export abstract class GenericInvestigatableObject implements InvestigatableObject, InteractionTarget {
    abstract game: Game;
    clues: Clue[];
    maxInvestigationAmount: number;
    investigationAmount: number;

    constructor(data: GenericInvestigatableObjectData) {
        this.clues = data.clues || [];
        this.maxInvestigationAmount = data.maxInvestigationAmount || 0;
        this.investigationAmount = data.investigationAmount || 0;
    }
    

    canInvestigate(actor: PlayerEntity) {
        return this.investigationAmount < this.maxInvestigationAmount;
    }

    onInvestigate(actor: PlayerEntity, skill: PropertyType) {
        const clues = this.clues.filter(clue => !clue.discoverd && clue.validSkills.has(skill));
        if (clues.length === 0) return;
        this.game.appendMessage("什么都没发现");

        const clue = clues[0];
        this.investigationAmount++;
        if (simpleCheck(actor.getProperty(skill))) {
            clue.discoverd = true;
            this.game.appendMessage("❗你发现：");
            this.game.appendMessage(clue.text);
            if (clue.onDiscover) {
                clue.onDiscover(clue, actor, { game: this.game, actor });
            }
        } else {
            this.game.appendMessage("一番检查后，什么都没发现");
        }
    }

    getDiscoveredClues(actor: PlayerEntity) {
        return this.clues.filter(clue => clue.discoverd);
    }

    canInteract() {
        return this.canInvestigate(this.game.adventurer) && this.clues.some(clue => !clue.discoverd);
    }

    onReceive({ actor, skill }: Interaction) { 
        this.onInvestigate(actor, skill);
    }

    
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