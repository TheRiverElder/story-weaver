import { ActionParams, Action } from "../common";
import { Entity } from "../entity/Entity";
import { DoorEntity, Lock } from "../entity/DoorEntity";
import { PlayerEntity } from "../entity/PlayerEntity";
import { ItemData } from "./Item";
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

    getItemActions(params: ActionParams): Action[] {
        return [{
            text: "使用",
            act: () => this.game.appendInteravtiveGroup(new UsingItemTask(this)),
            labels: ["eat"],
        }];
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
                const previous = door.lock.locked;
                if (door.lock === this.lock) {
                    door.lock.locked = !door.lock.locked;
                }
                this.game.appendMessage(`${previous ? "解锁" : "上锁"}${previous === door.lock.locked ? "失败" : "成功"}`);
            },
            labels: ["eat"],
        }]
    }
}