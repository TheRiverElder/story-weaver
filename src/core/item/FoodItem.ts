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

    getActions(params: ActionParams): Action[] {
        return [{
            text: "吃",
            act: ({ actor }) => {
                actor.health += this.energy;
                actor.inventory.remove(this);
            }
        }];
    }

    getActionsAsEntity(entity: ItemEntity, params: ActionParams): Action[] {
        return [{
            text: "吃",
            act: ({ actor }) => {
                actor.health += this.energy;
                entity.remove();
            }
        }];
    }
}