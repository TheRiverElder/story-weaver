import { Action, ActionGroup, ActionParams, InteractiveGroup, Unique } from "../common";
import { PlayerEntity } from "./PlayerEntity";
import { Game } from "../item/Game";
import { InteractionTarget, Interaction } from "../interaction/Interaction";
import { InteractionBehavior } from "../interaction/InteractionBehavior";
import { Room } from "../room/Room";

// alert("FUCK from Entity");


export interface EntityData {
    name: string;
    game: Game;
    interactionBehavior?: InteractionBehavior;
}

export abstract class Entity implements Unique, InteractiveGroup, InteractionTarget {
    readonly uid: number;
    readonly name: string;
    readonly game: Game;

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    abstract get brief(): string;

    room: Room | null = null;

    interactionBehavior: InteractionBehavior | null = null;

    constructor(data: EntityData) {
        this.name = data.name;
        this.game = data.game;
        this.uid = this.game.uidGenerator.generate();
        if (data.interactionBehavior) {
            this.interactionBehavior = data.interactionBehavior;
        }
    }
    remove() {
        this.room?.entities.removeByUid(this.uid);
    }

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

    canReceiveInteraction(interaction: Interaction): boolean {
        return this.interactionBehavior?.canReceiveInteraction(interaction) || false;
    }


    onReceiveInteraction(interaction: Interaction): void {
        this.interactionBehavior?.onReceiveInteraction(interaction);
    }

}