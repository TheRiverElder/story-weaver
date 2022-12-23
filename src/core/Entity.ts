import { Action, ActionGroup, ActionParams, InteractiveGroup, Unique } from "./common";
import { PlayerEntity } from "./entity/PlayerEntity";
import { Game } from "./Game";
import { Clue, GenericInvestigatableObject, GenericInvestigatableObjectData } from "./InvestigatableObject";
import { Room } from "./Room";

// alert("FUCK from Entity");


export interface EntityData extends GenericInvestigatableObjectData {
    name: string;
    game: Game;
    clues?: Clue[];
    maxInvestigationAmount?: number;
}

export abstract class Entity extends GenericInvestigatableObject implements Unique, InteractiveGroup {
    uid: number;
    name: string;
    game: Game;

    room: Room | null = null;

    constructor(data: EntityData) {
        super(data);
        this.name = data.name;
        this.game = data.game;
        this.uid = this.game.uidGenerator.generate();
        this.clues = data.clues || [];
        this.maxInvestigationAmount = data.maxInvestigationAmount || 0;
    }

    remove() {
        this.room?.entities.removeByUid(this.uid);
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    abstract getBrief(): string;

    teleport(room: Room) {
        if (this.room != null) {
            this.room.removeEntity(this);
        }
        room.addEntity(this);
    }

    onActed(actor: PlayerEntity, action: Action) { }


    getActionGroups(params: ActionParams): ActionGroup[] {
        return [];
    }

}