import ActionGroup from "../action/ActionGroup";
import { PlayerEntity } from "../entity/PlayerEntity";
import GameActivity from "../structure/GameActivity";

export default class InventoryActivity extends GameActivity {

    public override getActionGroups(player: PlayerEntity): Array<ActionGroup> {
        return [
            ...player.inventory.items.map(item => ({
                title: item.name,
                descriptions: [],
                actions: item.getItemActions(player),
                labels: [],
            })),
            {
                title: "操作",
                descriptions: [],
                actions: [
                    {
                        text: "返回",
                        act: () => this.finish(),
                        labels: [],
                    },
                ],
                labels: [],
            }
        ];
    }
}