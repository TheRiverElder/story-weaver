import { ActionGroup } from "../common";
import { PropertyType } from "../profile/PropertyType";
import { FightingTask, FightingActionType } from "../task/FightingTask";
import { GameOverTask } from "../task/GameOverTask";
import { InventoryTask } from "../task/InventoryTask";
import { InvestigationTask } from "../task/InvestigationTask";
import { LivingEntity, LivingEntityData } from "./LivingEntity";

export const PROPERTY_TYPE_WATCH = new PropertyType("watch", "观察", 20);
export const PROPERTY_TYPE_LISTEN = new PropertyType("listen", "听", 20);
export const PROPERTY_TYPE_MEDICINE = new PropertyType("medicine", "药学", 1);

export interface PlayerEntityData extends LivingEntityData {
}

export class PlayerEntity extends LivingEntity {

    getActionGroups(): ActionGroup[] {
        return [{
            source: this,
            title: this.name,
            description: this.getBrief(),
            actions: [
                {
                    text: "打开背包",
                    act: ({ game }) => {game.appendInteravtiveGroup(new InventoryTask(game.uidGenerator.generate()))},
                },
                {
                    text: "调查现场",
                    act: ({ game }) => {game.appendInteravtiveGroup(new InvestigationTask(game))},
                },
            ],
        }];
    }

    getBrief(): string {
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