import { PlayerEntity } from "../entity/PlayerEntity";
import { Game } from "../item/Game";
import { simpleCheck } from "../task/FightingTask";
import { Interaction } from "./Interaction";
import { InteractionBehavior } from "./InteractionBehavior";
import { InteractionBehaviorItem } from "./item/InteractionBehaviorItem";

export interface GenericInteractionBehaviorData {
    game: Game;
    items?: InteractionBehaviorItem[];
    maxCounter?: number;
}

export class GenericInteractionBehavior implements InteractionBehavior {
    
    readonly game: Game;
    items: InteractionBehaviorItem[];
    protected maxCounter: number;
    protected counter: number;

    constructor(data: GenericInteractionBehaviorData) {
        this.game = data.game;
        this.items = data.items || [];
        this.maxCounter = data.maxCounter || 0;
        this.counter = 0;
    }

    getItems() {
        return this.items;
    }

    setItems(items: Array<InteractionBehaviorItem>) {
        this.items = items;
    }

    canReceiveInteraction(interaction: Interaction): boolean {
        return this.counter < this.maxCounter;
    }

    getSolvedItems(actor: PlayerEntity) {
        return this.items.filter(clue => clue.isSolved(actor));
    }

    onReceiveInteraction(interaction: Interaction) { 
        const { actor, skill } = interaction;

        const clues = this.items.filter(clue => !clue.isSolved(actor) && clue.isValidSkill(skill));
        if (clues.length === 0) return;

        const clue = clues[0];
        this.counter++;
        if (simpleCheck(actor.getProperty(skill))) {
            clue.setSolved(actor);
            clue.onSolve(interaction);
        } else {
            clue.onFail(interaction);
        }
    }

    
}