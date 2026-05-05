import Action from "../action/Action";
import InventoryActivity from "../activity/InventoryActivity";
import Entity from "../structure/Entity";
import HandComponent from "./HandComponent";
import InventoryComponent from "./InventoryComponent";
import { LivingEntityData } from "./LivingEntity";

// alert("FUCK from PlayerEntity");

export interface PlayerEntityData extends LivingEntityData {
}

export class PlayerEntity extends Entity {

    constructor(data: PlayerEntityData) {
        super(data);

        this.components.add(new InventoryComponent());
        this.components.add(new HandComponent());
    }

    public get inventory(): InventoryComponent {
        return this.components.get(InventoryComponent)!;
    }

    public get hand(): HandComponent {
        return this.components.get(HandComponent)!;
    }

    public override get descriptions(): string[] {
        return ["这是你。"];
    }

    public override get actions(): Action[] {
        return [
            {
                text: "🎒打开背包",
                act: ({ game }) => { game.startActivity(new InventoryActivity({ game })) },
                labels: ["open"],
            },
            // {
            //     text: "🔍调查现场",
            //     act: ({ game }) => {game.appendInteravtiveGroup(new InvestigationTask(game))},
            //     labels: ["investigate"],
            // },
        ];
    }
}