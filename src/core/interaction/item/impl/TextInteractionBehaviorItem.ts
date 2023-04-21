import { PlayerEntity } from "../../../entity/PlayerEntity";
import { Interaction } from "../../Interaction";
import GenericInteractionBehaviorItem, { GenericInteractionBehaviorItemData } from "../GenericInteractionBehaviorItem";

export interface TextInteractionBehaviorItemData extends GenericInteractionBehaviorItemData {
    text: Array<string>;
}

export default class TextInteractionBehaviorItem extends GenericInteractionBehaviorItem {
    protected text: Array<string>;

    constructor(args: TextInteractionBehaviorItemData) {
        super(args);
        this.text = args.text.slice();
    }

    onSolve(interaction: Interaction): void {
        this.text.forEach(line => this.game.appendMessageText(line));
    }
    
    onReview(player: PlayerEntity): void {
        this.text.forEach(line => this.game.appendMessageText(line));
    }

}