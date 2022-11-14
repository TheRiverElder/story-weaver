import { Action, ActionGroup, ActionParams, InteractiveGroup, Unique } from "./common";
import { Entity } from "./Entity";
import { UniqueSet } from "./UniqueSet";

export interface RoomData extends Unique {
    name: string;
    entities: Entity[];
}

export class Room implements Unique, InteractiveGroup {
    uid: number;
    name: string;
    entities: UniqueSet<Entity> = new UniqueSet();

    constructor(data: RoomData) {
        this.uid = data.uid;
        this.name = data.name;
        data.entities.forEach(this.addEntity.bind(this));
    }

    addEntity(entity: Entity) {
        this.entities.add(entity);
        entity.room = this;
    }

    getEntityByUid(uid: number) {
        this.entities.getByUid(uid);
    }

    removeEntity(entity: Entity) {
        this.removeEntityByUid(entity.uid);
    }

    removeEntityByUid(uid: number) {
        const entity = this.entities.getByUid(uid);
        if (entity) {
            entity.room = null;
        }
    }
    
    getActionGroups(params: ActionParams): ActionGroup[] {
        const entityActionGroups: ActionGroup[] = this.entities.values().flatMap(it => it.getActionGroups(params));
        return entityActionGroups;
    }

}