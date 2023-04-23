import { Entity } from "./Entity";
import { Game } from "../item/Game";
import { Item } from "../item/Item";
import { PlayerEntity } from "./PlayerEntity";
import ActionGroup from "../action/ActionGroup";
import CustomAction from "../action/impl/CustomAction";
import Action from "../action/Action";
import { InteractionTarget } from "../interaction/Interaction";

// alert("FUCK from ItemEntity");


export interface ItemEntityData {
    item: Item;
    game?: Game;
}

export class ItemEntity extends Entity implements ActionGroup {
    item: Item;

    constructor(data: ItemEntityData) {
        super({ 
            ...data, 
            game: data.game || data.item.game, 
            name: data.item.name,
        });
        this.item = data.item;
    }

    getActionGroups(actor: PlayerEntity): ActionGroup[] {
        return [this];
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    get brief() {
        return `【物品】${this.name}`;
    }

    canInteract(): boolean {
        return true;
    }
    
    getTitle(): string {
        return this.name;
    }

    getDescription(): string {
        return this.brief;
    }

    getActions(): Action[] {
        return [new CustomAction({
            text: '拾取',
            labels: ['pick-up'],
            act: (actor) => {
                if (actor.appendItem(this.item)) {
                    this.remove();
                    this.game.appendMessage(`捡起${this.name}`);
                } else {
                    this.game.appendMessage("背包空间不足");
                }
            },
        })];
    }

    getLabels(): string[] {
        return ["item-entity"];
    }

    getTarget(): InteractionTarget {
        return this.interactionBehavior;
    }
}