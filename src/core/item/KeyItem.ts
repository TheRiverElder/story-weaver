import { ActionParams, Action } from "../common";
import { Entity } from "../Entity";
import { DoorEntity, Lock } from "../entity/DoorEntity";
import { PlayerEntity } from "../entity/PlayerEntity";
import { ItemData } from "../Item";
import { UsingItemTask } from "../task/UsingItemTask";
import { NormalItem } from "./NormalItem";

export interface KeyItemData extends ItemData {
    lock: Lock;
}

export class KeyItem extends NormalItem {
    lock: Lock;

    constructor(data: KeyItemData) {
        super(data);
        this.lock = data.lock;
    }

    getActions(params: ActionParams): Action[] {
        return [{
            text: "使用",
            act: () => this.game.appendInteravtiveGroup(new UsingItemTask(this)),
        }]
    }

    getUsageActions(actor: PlayerEntity, target: Entity | null): Action[] {
        if (target === null) return [];

        if (!(target instanceof DoorEntity)) return [];
        const door: DoorEntity = target;

        if (!door.lock) return [];

        return [{
            text: door.lock.locked ? "解锁" : "上锁",
            act: () => {
                if (!door.lock) return;
                door.lock.locked = !door.lock.locked;
            },
        }]
    }
}