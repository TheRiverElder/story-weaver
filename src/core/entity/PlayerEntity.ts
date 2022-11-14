import { Action, ActionGroup } from "../common";
import { Item } from "../Item";
import { InverntoryView } from "../misc/InventoryView";
import { UniqueSet } from "../UniqueSet";
import { LivingEntity, LivingEntityData } from "./LivingEntity";

export interface PlayerEntityData extends LivingEntityData {
    inventory: Item[];
}

export class PlayerEntity extends LivingEntity {
    inventory: UniqueSet<Item> = new UniqueSet();

    constructor(data: PlayerEntityData) {
        super(data);
        this.inventory.values().forEach(this.inventory.add.bind(this.inventory));
    }

    getActionGroups(): ActionGroup[] {
        return [{
            source: this,
            title: this.name,
            description: this.getBrief(),
            actions: [{
                text: "打开背包",
                act: ({ game }) => {game.appendInteravtiveGroup(new InverntoryView(game.uidGenerator.generate()))},
            }],
        }];
    }

    appendItem(item: Item): boolean {
        let itemCount = this.inventory.size + (this.weapon ? 1 : 0) + (this.armor ? 1 : 0);
        if (itemCount >= 6) return false;
        this.inventory.add(item);
        return true;
    }

    getBrief(): string {
        return `这是你`;
    }

}