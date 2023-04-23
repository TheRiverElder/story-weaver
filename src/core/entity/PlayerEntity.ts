import Action from "../action/Action";
import ActionGroup from "../action/ActionGroup";
import CustomAction from "../action/impl/CustomAction";
import { InteractionTarget } from "../interaction/Interaction";
import { FightingTask, FightingActionType } from "../task/FightingTask";
import { GameOverTask } from "../task/GameOverTask";
import { InventoryTask } from "../task/InventoryTask";
import { InvestigationTask } from "../task/InvestigationTask";
import { LivingEntityData, LivingEntity } from "./LivingEntity";

// alert("FUCK from PlayerEntity");

export interface PlayerEntityData extends LivingEntityData {
}

export class PlayerEntity extends LivingEntity {

    getActionGroups(): ActionGroup[] {
        return [this];
    }

    get brief(): string {
        return `这是你`;
    }
    
    getTitle(): string {
        return this.name;
    }

    getDescription(): string {
        return this.brief;
    }

    getActions(): Action[] {
        return [
            new CustomAction({
                text: "打开背包",
                act: ({ game }) => {game.appendInteravtiveGroup(new InventoryTask(game.uidGenerator.generate()))},
                labels: ["opan"],
            }),
            new CustomAction({
                text: "调查现场",
                act: ({ game }) => {game.appendInteravtiveGroup(new InvestigationTask(game))},
                labels: ["investigate"],
            }),
        ];
    }

    getLabels(): string[] {
        return ["player-entity"];
    }

    getTarget(): InteractionTarget {
        return this.interactionBehavior;
    }



    onFightTurn(fighting: FightingTask): FightingActionType {
        return FightingActionType.WAITING;
    }

    onFightEscape(entity: LivingEntity, fighting: FightingTask): FightingActionType {
        return FightingActionType.WAITING;
    }

    onDied() {
        this.game.appendInteravtiveGroup(new GameOverTask(this.game, "你死了"));
    }
}