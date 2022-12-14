import { ActionGroup, Action, ActionParams } from "../common";
import { Entity } from "../Entity";
import { Game } from "../Game";
import { Item } from "../Item";

// alert("FUCK from ItemEntity");


export interface ItemEntityData {
    item: Item;
    game?: Game;
}

export class ItemEntity extends Entity {
    item: Item;

    constructor(data: ItemEntityData) {
        super({ 
            ...data, 
            game: data.game || data.item.game, 
            name: data.item.name,
        });
        this.item = data.item;
    }

    getActionGroups(params: ActionParams): ActionGroup[] {
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
            actions: [pickUpAction, ...this.item.getActionsAsEntity(this, params)],
            labels: ["item-entity"],
            target: this,
        }];
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    getBrief() {
        return `【物品】${this.name}`;
    }

    canInteract(): boolean {
        return true;
    }
}