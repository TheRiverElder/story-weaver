import Action from "../action/Action";
import CustomAction from "../action/impl/CustomAction";
import { ItemEntity } from "../entity/ItemEntity";
import { PlayerEntity } from "../entity/PlayerEntity";
import { ItemData } from "./Item";
import { NormalItem } from "./NormalItem";

export interface FoodItemData extends ItemData {
    energy: number;
}

export class FoodItem extends NormalItem {
    energy: number;

    constructor(data: FoodItemData) {
        super(data);
        this.energy = data.energy;
    }

    getItemActions(actor: PlayerEntity): Action[] {
        return [new CustomAction({
            text: "吃",
            act: (actor: PlayerEntity) => {
                actor.health += this.energy;
                actor.inventory.remove(this);
            },
            labels: ["eat"],
        })];
    }

    getItemEntityActions(entity: ItemEntity, actor: PlayerEntity): Action[] {
        return this.getItemActions(actor);
    }
}