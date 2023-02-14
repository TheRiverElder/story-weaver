import { ActionParams, Action } from "../common";
import { ItemEntity } from "../entity/ItemEntity";
import { ItemData } from "../Item";
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

    getItemActions(params: ActionParams): Action[] {
        return [{
            text: "吃",
            act: ({ actor }) => {
                actor.health += this.energy;
                actor.inventory.remove(this);
            },
            labels: ["eat"],
        }];
    }

    getItemEntityActions(entity: ItemEntity, params: ActionParams): Action[] {
        return [{
            text: "吃",
            act: ({ actor }) => {
                actor.health += this.energy;
                entity.remove();
            },
            labels: ["eat"],
        }];
    }
}