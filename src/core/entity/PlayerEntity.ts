import { ActionGroup } from "../common";
import { FightingTask, FightingActionType } from "../task/FightingTask";
import { InventoryTask } from "../task/InventoryTask";
import { LivingEntity, LivingEntityData } from "./LivingEntity";

export interface PlayerEntityData extends LivingEntityData {
}

export class PlayerEntity extends LivingEntity {

    getActionGroups(): ActionGroup[] {
        return [{
            source: this,
            title: this.name,
            description: this.getBrief(),
            actions: [{
                text: "打开背包",
                act: ({ game }) => {game.appendInteravtiveGroup(new InventoryTask(game.uidGenerator.generate()))},
            }],
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
}