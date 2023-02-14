import type { ActionGroup } from "../common";
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
        return [{
            source: this,
            title: this.name,
            description: this.brief,
            actions: [
                {
                    text: "打开背包",
                    act: ({ game }) => {game.appendInteravtiveGroup(new InventoryTask(game.uidGenerator.generate()))},
                    labels: ["opan"],
                },
                {
                    text: "调查现场",
                    act: ({ game }) => {game.appendInteravtiveGroup(new InvestigationTask(game))},
                    labels: ["investigate"],
                },
            ],
            labels: ["player-entity"],
            target: this,
        }];
    }

    get brief(): string {
        return `这是你`;
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