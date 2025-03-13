import Action from "../action/Action";
import Entity from "../structure/Entity";
import { InventoryTask } from "../task/InventoryTask";
import { InvestigationTask } from "../task/InvestigationTask";
import { LivingEntityData } from "./LivingEntity";

// alert("FUCK from PlayerEntity");

export interface PlayerEntityData extends LivingEntityData {
}

export class PlayerEntity extends Entity {

    public override get descriptions(): string[] {
        return ["这是你。"];
    }

    public override get actions(): Action[] {
        return [
            {
                text: "🎒打开背包",
                act: ({ game }) => {game.appendInteravtiveGroup(new InventoryTask(game.uidGenerator.generate()))},
                labels: ["open"],
            },
            {
                text: "🔍调查现场",
                act: ({ game }) => {game.appendInteravtiveGroup(new InvestigationTask(game))},
                labels: ["investigate"],
            },
        ];
    }
}