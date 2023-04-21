import { Action, ActionGroup } from "../common";
import { Entity, EntityData } from "./Entity";
import { MESSAGE_TYPE_REPLACEABLE } from "../message/MessageTypes";
import { PROPERTY_TYPE_STRENGTH } from "../profile/PropertyTypes";
import { Room } from "../room/Room";
import { simpleCheck } from "../task/FightingTask";

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
                act: ({ actor, game }) => {
                    actor.teleport(this.targetRoom);
                    game.appendMessageText(`穿过${this.name}，进入${this.targetRoom.name}`, MESSAGE_TYPE_REPLACEABLE);
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
        const locked = !!(this.lock?.locked);
        return [{
            source: this,
            title: `${locked ? "🔒" : ""}${this.name}：${this.targetRoom.name}`,
            description: this.brief,
            actions: [action],
            labels: ["door-entity"],
            target: this,
        }];
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    get brief() {
        const locked = !!(this.lock?.locked);
        return `${this.name}${locked ? "，已上锁🔒" : ""}，通向${this.targetRoom.name}`;
    }
}