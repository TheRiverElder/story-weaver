import { PlayerEntity } from "../entity/PlayerEntity";
import { InteractionTarget } from "./Interaction";
import { InteractionBehaviorItem } from "./item/InteractionBehaviorItem";

export interface InteractionBehavior extends InteractionTarget {
    getSolvedItems(actor: PlayerEntity): InteractionBehaviorItem[];
    getItems(): InteractionBehaviorItem[];
    setItems(items: InteractionBehaviorItem[]): void;
}

