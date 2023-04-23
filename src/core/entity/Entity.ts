import { PlayerEntity } from "./PlayerEntity";
import { Game } from "../item/Game";
import { InteractionTarget, Interaction } from "../interaction/Interaction";
import { InteractionBehavior } from "../interaction/InteractionBehavior";
import { Room } from "../room/Room";
import { GenericInteractionBehavior } from "../interaction/GenericInteractionBehavior";
import GameObject from "../action/GameObject";
import Action from "../action/Action";
import ActionGroup from "../action/ActionGroup";
import { Unique } from "../BasicTypes";

// alert("FUCK from Entity");


export interface EntityData {
    name: string;
    game: Game;
    interactionBehavior?: InteractionBehavior;
}

export abstract class Entity implements Unique, GameObject, InteractionTarget {
    readonly uid: number;
    readonly name: string;
    readonly game: Game;

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    abstract get brief(): string;

    room: Room | null = null;

    interactionBehavior: InteractionBehavior;

    constructor(data: EntityData) {
        this.name = data.name;
        this.game = data.game;
        this.uid = this.game.uidGenerator.generate();
        this.interactionBehavior = data.interactionBehavior || new GenericInteractionBehavior({
            game: this.game,
        });
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


    getActionGroups(plater: PlayerEntity): ActionGroup[] {
        return [];
    }

    canReceiveInteraction(interaction: Interaction): boolean {
        return this.interactionBehavior?.canReceiveInteraction(interaction) || false;
    }


    onReceiveInteraction(interaction: Interaction): void {
        this.interactionBehavior?.onReceiveInteraction(interaction);
    }

}