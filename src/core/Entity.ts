import { ActionGroup, ActionParams, InteractiveGroup, Unique } from "./common";
import { Game } from "./Game";
import { Room } from "./Room";


export interface EntityData {
    name: string;
    game: Game;
}

export abstract class Entity implements Unique, InteractiveGroup {
    uid: number;
    name: string;
    game: Game;

    room: Room | null = null;

    constructor(data: EntityData) {
        this.name = data.name;
        this.game = data.game;
        this.uid = this.game.uidGenerator.generate();
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