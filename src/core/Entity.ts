import { Action, ActionGroup, ActionParams, InteractiveGroup, Unique } from "./common";
import { PlayerEntity } from "./entity/PlayerEntity";
import { Game } from "./Game";
import { Interaction, InteractionTarget } from "./Interaction";
import { GenericInteractionBehavior, GenericInteractionBehaviorData } from "./InteractionBehavior";
import { PropertyType } from "./profile/PropertyType";
import { Room } from "./Room";

// alert("FUCK from Entity");


export interface EntityData extends GenericInteractionBehaviorData {
    name: string;
    game: Game;
    investigatableObject?: GenericInteractionBehavior;
}

export abstract class Entity implements Unique, InteractiveGroup, InteractionTarget {
    readonly uid: number;
    readonly name: string;
    readonly game: Game;

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    abstract get brief(): string;

    room: Room | null = null;

    readonly investigatableObject: GenericInteractionBehavior | null = null;

    constructor(data: EntityData) {
        this.name = data.name;
        this.game = data.game;
        this.uid = this.game.uidGenerator.generate();
        if (data.investigatableObject) {
            this.investigatableObject = data.investigatableObject;
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

    canInteract(actor: PlayerEntity, skill: PropertyType): boolean {
        const investigatableObject = this.investigatableObject;
        if (!investigatableObject) return false;

        return investigatableObject.canInvestigate(actor);
    }

    onInteract(interaction: Interaction): void {
        const investigatableObject = this.investigatableObject;
        if (!investigatableObject) return;

        investigatableObject.onInvestigate(interaction.actor, interaction.skill);
    }

}