import { ActionGroup, ActionParams, InteractiveGroup, Unique } from "./common";
import { Room } from "./Room";


export interface EntityData extends Unique {
    name: string;
}

export abstract class Entity implements Unique, InteractiveGroup {
    uid: number;
    name: string;

    room: Room | null = null;

    constructor(data: EntityData) {
        this.uid = data.uid;
        this.name = data.name;
    }

    remove() {
        this.room?.entities.removeByUid(this.uid);
    }

    abstract getActionGroups(params: ActionParams): ActionGroup[];

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    abstract getBrief(): string;

    teleport(room: Room) {
        if (this.room != null) {
            this.room.removeEntity(this);
        }
        room.addEntity(this);
    }

}