import { Action, ActionGroup, Unique } from "../common";
import { Entity } from "../Entity";
import { Item } from "../Item";

export interface ItemEntityData extends Unique {
    item: Item;
}

export class ItemEntity extends Entity {
    item: Item;

    constructor(data: ItemEntityData) {
        super({ ...data, name: data.item.name });
        this.item = data.item;
    }

    getActionGroups(): ActionGroup[] {
        const pickUpAction: Action = {
            text: '拾取',
            labels: ['pick-up'],
            act: ({ game, actor }) => {
                if (actor.appendItem(this.item)) {
                    this.remove();
                    game.appendMessage(`捡起${this.name}`);
                } else {
                    game.appendMessage("背包空间不足");
                }
            },
        };
        return [{
            source: this,
            title: this.name,
            description: this.getBrief(),
            actions: [pickUpAction],
        }];
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    getBrief() {
        return `【物品】${this.name}`;
    }

}