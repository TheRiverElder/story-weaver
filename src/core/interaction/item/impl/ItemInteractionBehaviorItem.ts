import { PlayerEntity } from "../../../entity/PlayerEntity";
import { Item } from "../../../item/Item";
import { Interaction } from "../../Interaction";
import GenericInteractionBehaviorItem, { GenericInteractionBehaviorItemData } from "../GenericInteractionBehaviorItem";

export interface ItemInteractionBehaviorItemData extends GenericInteractionBehaviorItemData {
    item: Item;
}

export default class ItemInteractionBehaviorItem extends GenericInteractionBehaviorItem {

    protected item: Item;

    constructor(args: ItemInteractionBehaviorItemData) {
        super(args);
        this.item = args.item;
    }

    onSolve(interaction: Interaction): void {
        this.game.appendMessageText(`⭐发现了${this.item.name}！`);
        interaction.actor.appendOrDropItem(this.item);
    }
    
    onReview(player: PlayerEntity): void {
        this.game.appendMessageText(`⭐发现过${this.item.name}！`);
    }
}