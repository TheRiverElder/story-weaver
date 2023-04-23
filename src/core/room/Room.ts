import ActionGroup from "../action/ActionGroup";
import GameObject from "../action/GameObject";
import { Unique } from "../BasicTypes";
import { Entity } from "../entity/Entity";
import { PlayerEntity } from "../entity/PlayerEntity";
import { GenericInteractionBehaviorData, GenericInteractionBehavior } from "../interaction/GenericInteractionBehavior";
import { Game } from "../item/Game";
import { UniqueSet } from "../util/UniqueSet";

export interface RoomData extends GenericInteractionBehaviorData {
    name: string;
    game: Game;
    entities: Entity[];
}

export class Room extends GenericInteractionBehavior implements Unique, GameObject {
    uid: number;
    game: Game;
    name: string;
    entities: UniqueSet<Entity> = new UniqueSet();

    constructor(data: RoomData) {
        super(data);
        this.name = data.name;
        this.game = data.game;
        this.uid = this.game.uidGenerator.generate();
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
    
    getActionGroups(actor: PlayerEntity): ActionGroup[] {
        const entityActionGroups: ActionGroup[] = [];
        for (const entity of this.entities.values()) {
            const groups = entity.getActionGroups(actor);
            if (entity === this.game.adventurer) {
                entityActionGroups.unshift(...groups);
            } else {
                entityActionGroups.push(...groups);
            };
        } 
        return entityActionGroups;
    }

}