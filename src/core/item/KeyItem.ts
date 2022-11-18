import { ActionParams, Action } from "../common";
import { Entity } from "../Entity";
import { DoorEntity } from "../entity/DoorEntity";
import { PlayerEntity } from "../entity/PlayerEntity";
import { ItemData } from "../Item";
import { UsingItemTask } from "../task/UsingItemTask";
import { NormalItem } from "./NormalItem";

export interface KeyItemData extends ItemData {
    doors: DoorEntity[];
}

export class KeyItem extends NormalItem {
    doors: DoorEntity[];

    constructor(data: KeyItemData) {
        super(data);
        this.doors = data.doors;
    }

    getActions(params: ActionParams): Action[] {
        return [{
            text: "使用",
            act: () => this.game.appendInteravtiveGroup(new UsingItemTask(this)),
        }]
    }

    getUsageActions(actor: PlayerEntity, target: Entity | null): Action[] {
        if (target === null) return [];

        for (const door of this.doors) {
            if (door === target) {
                if (!door.lock) continue;
                return [{
                    text: door.lock.locked ? "解锁" : "上锁",
                    act: () => {
                        if (!door.lock) return;
                        door.lock.locked = !door.lock.locked;
                    },
                }]
            }
        }

        return [];
    }
}