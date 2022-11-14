import { Action, ActionGroup } from "../common";
import { Entity, EntityData } from "../Entity";
import { Room } from "../Room";

export interface DoorEntityData extends EntityData {
    targetRoom: Room;
}

export class DoorEntity extends Entity {
    targetRoom: Room;

    constructor(data: DoorEntityData) {
        super(data);
        this.targetRoom = data.targetRoom;
    }

    getActionGroups(): ActionGroup[] {
        const walkThroughAction: Action = {
            text: '走过',
            labels: ['walk'],
            act: ({ game, actor }) => {
                actor.teleport(this.targetRoom);
                game.appendMessage(`穿过${this.name}，进入${this.targetRoom.name}`);
            },
        };
        return [{
            source: this,
            title: this.name,
            description: this.getBrief(),
            actions: [walkThroughAction],
        }];
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    getBrief() {
        return `【门/路】${this.name}`;
    }

}