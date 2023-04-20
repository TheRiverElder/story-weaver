import { ActionParams } from "./common";
import { Entity } from "./Entity";
import { PlayerEntity } from "./entity/PlayerEntity";
import { Game } from "./Game";
import { Interaction, InteractionTarget } from "./Interaction";
import { Item } from "./Item";
import { PROPERTY_TYPE_WATCH } from "./profile/PropertyTypes";
import { PropertyType } from "./profile/PropertyType";
import { simpleCheck } from "./task/FightingTask";


export interface InteractionBehaviorItem {
    validSkills: Set<PropertyType>;
    text: string;
    solved: boolean;
    onDiscover?: (clue: InteractionBehaviorItem, entity: Entity, params: ActionParams) => void;
}

export interface InteractionBehavior {
    getSolvedItems(actor: PlayerEntity): InteractionBehaviorItem[];
}

export interface GenericInteractionBehaviorData {
    items?: InteractionBehaviorItem[];
    maxAmount?: number;
}

export abstract class GenericInteractionBehavior implements InteractionBehavior, InteractionTarget {
    
    abstract game: Game;
    items: InteractionBehaviorItem[];
    maxAmount: number;
    counter: number;

    constructor(data: GenericInteractionBehaviorData) {
        this.items = data.items || [];
        this.maxAmount = data.maxAmount || 0;
        this.counter = 0;
    }

    canInteract(actor: PlayerEntity, skill: PropertyType): boolean {
        return this.counter < this.maxAmount;
    }

    onInvestigate(actor: PlayerEntity, skill: PropertyType) {
        const clues = this.items.filter(clue => !clue.solved && clue.validSkills.has(skill));
        if (clues.length === 0) return;
        this.game.appendMessage("什么都没发现");

        const clue = clues[0];
        this.counter++;
        if (simpleCheck(actor.getProperty(skill))) {
            clue.solved = true;
            this.game.appendMessage("❗你发现：");
            this.game.appendMessage(clue.text);
            if (clue.onDiscover) {
                clue.onDiscover(clue, actor, { game: this.game, actor });
            }
        } else {
            this.game.appendMessage("一番检查后，什么都没发现");
        }
    }

    getSolvedItems(actor: PlayerEntity) {
        return this.items.filter(clue => clue.solved);
    }

    onInteract({ actor, skill }: Interaction) { 
        this.onInvestigate(actor, skill);
    }

    
}

export function createItemClue(item: Item, skill: PropertyType = PROPERTY_TYPE_WATCH): InteractionBehaviorItem {
    return {
        validSkills: new Set<PropertyType>([skill]),
        solved: false,
        text: `身上有${item.name}`,
        onDiscover: (clue, entity, { actor }) => {
            actor.appendOrDropItem(item);
        },
    };
}

export function createTextClue(text: string, skill: PropertyType = PROPERTY_TYPE_WATCH): InteractionBehaviorItem {
    return {
        validSkills: new Set<PropertyType>([skill]),
        solved: false,
        text,
    };
}