import { Action, ActionGroup } from "../common";
import { Entity, EntityData } from "../Entity";
import { Room } from "../Room";
import { simpleCheck } from "../task/FightingTask";
import { PROPERTY_TYPE_STRENGTH } from "./LivingEntity";

export interface DoorEntityData extends EntityData {
    targetRoom: Room;
    lock?: Lock;
}

export class Lock {
    locked: boolean = true;
}

export class DoorEntity extends Entity {
    targetRoom: Room;
    lock: Lock | null;

    constructor(data: DoorEntityData) {
        super(data);
        this.targetRoom = data.targetRoom;
        this.lock = data.lock || null;
    }

    getActionGroups(): ActionGroup[] {
        let action: Action;
        if (!this.lock || !this.lock.locked) {
            action = {
                text: '前往',
                labels: ['walk'],
                act: ({ actor }) => {
                    actor.teleport(this.targetRoom);
                    // game.appendMessage(`穿过${this.name}，进入${this.targetRoom.name}`);
                },
            };
        } else {
            action = {
                text: '撞它丫的！',
                labels: ['rush'],
                act: ({ actor }) => {
                    if (!this.lock || !this.lock.locked) return;

                    const strength = actor.profile.getProperty(PROPERTY_TYPE_STRENGTH);
                    const succeeded = simpleCheck(strength);
                    const damage = Math.max(1, Math.round(strength * 0.05));
                    const message = `以${damage}点生命为代价，` + (succeeded ? "撞开了门" : "也没把门撞开");
                    this.game.appendMessage(message);
                    actor.health -= damage;
                    if (succeeded) {
                        this.lock.locked = false;
                    }
                },
            };
        }
        return [{
            source: this,
            title: "通往" + this.targetRoom.name,
            description: this.getBrief(),
            actions: [action],
            labels: ["door-entity"],
        }];
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    getBrief() {
        return `${this.name}${this.lock?.locked ? "，已上锁" : ""}，通向${this.targetRoom.name}`;
    }

}