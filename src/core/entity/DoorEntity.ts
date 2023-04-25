import { Entity, EntityData } from "./Entity";
import { MESSAGE_TYPE_REPLACEABLE } from "../message/MessageTypes";
import { PROPERTY_TYPE_STRENGTH } from "../profile/PropertyTypes";
import { Room } from "../room/Room";
import { simpleCheck } from "../task/FightingTask";
import CustomInteractionBebaviorItem from "../interaction/item/impl/CustomInteractionBebaviorItem";
import { Interaction, InteractionTarget } from "../interaction/Interaction";
import { GenericInteractionBehavior } from "../interaction/GenericInteractionBehavior";
import { PlayerEntity } from "./PlayerEntity";
import Action from "../action/Action";
import ActionGroup from "../action/ActionGroup";
import CustomAction from "../action/impl/CustomAction";

export interface DoorEntityData extends EntityData {
    targetRoom: Room;
    lock?: Lock;
}

export class Lock {
    locked: boolean = true;
}

export class DoorEntity extends Entity implements ActionGroup {
    targetRoom: Room;
    lock: Lock | null;

    constructor(data: DoorEntityData) {
        super(data);
        this.targetRoom = data.targetRoom;
        this.lock = data.lock || null;

        let interactionBehavior = this.interactionBehavior;
        if (!interactionBehavior) {
            interactionBehavior = new GenericInteractionBehavior({
                game: this.game,
                maxCounter: Number.POSITIVE_INFINITY,
            });
            this.interactionBehavior = interactionBehavior;
        }
        if (this.lock && this.lock.locked && interactionBehavior) {
            interactionBehavior.setItems([
                new CustomInteractionBebaviorItem({
                    game: this.game,
                    validSkills: [PROPERTY_TYPE_STRENGTH],
                    isVisible: () => !!(this.lock && this.lock.locked),
                    onSolve: ({ actor }: Interaction) => this.onRushTheDoor(actor, true), 
                    onFail: ({ actor }: Interaction) => this.onRushTheDoor(actor, false),
                }),
            ]);
        }
    }

    onRushTheDoor(actor: PlayerEntity, succeeded: boolean) {
        if (!this.lock) return false;
        const strength = actor.profile.getProperty(PROPERTY_TYPE_STRENGTH);
        const damage = Math.max(1, Math.round(strength * 0.05));
        const message = `以${damage}点生命为代价，` + (succeeded ? "撞开了门" : "也没把门撞开");
        this.game.appendMessage(message);
        actor.health -= damage;
        if (succeeded) {
            this.lock.locked = false;
            actor.teleport(this.targetRoom);
        }
    }

    isLocked(): boolean {
        return !!(this.lock?.locked);
    }

    getActionGroups(): ActionGroup[] {
        return [this];
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    get brief() {
        return `${this.name}${this.isLocked() ? "，已上锁🔒" : ""}，通向${this.targetRoom.name}`;
    }
    
    getTitle(): string {
        return `${this.isLocked() ? "🔒" : ""}${this.name}：${this.targetRoom.name}`;
    }

    getDescription(): string {
        return this.brief;
    }

    getActions(): Action[] {
        let action: Action;
        if (!this.lock || !this.lock.locked) {
            action = new CustomAction({
                text: '前往',
                labels: ['walk'],
                act: (actor) => {
                    actor.teleport(this.targetRoom);
                    this.game.appendMessageText(`穿过${this.name}，进入${this.targetRoom.name}`, MESSAGE_TYPE_REPLACEABLE);
                },
            });
        } else {
            action = new CustomAction({
                text: '撞它丫的！',
                labels: ['rush'],
                act: (actor) => {
                    if (!this.lock || !this.lock.locked) return;
                    this.onRushTheDoor(actor, simpleCheck(actor.getProperty(PROPERTY_TYPE_STRENGTH)));
                },
            });
        }
        return [action];
    }

    getLabels(): string[] {
        return ["door-entity"];
    }

    getTarget(): InteractionTarget {
        return this.interactionBehavior;
    }
}