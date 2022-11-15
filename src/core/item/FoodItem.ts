import { ActionParams, Action } from "../common";
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

    getActions(params: ActionParams): Action[] {
        return [{
            text: "吃",
            act: ({ actor }) => {
                actor.health += this.energy;
                actor.inventory.remove(this);
            }
        }]
    }
}