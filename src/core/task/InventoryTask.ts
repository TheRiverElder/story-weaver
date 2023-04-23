import ActionGroup from "../action/ActionGroup";
import CustomActionGroup from "../action/CustomActionGroup";
import GameObject from "../action/GameObject";
import CustomAction from "../action/impl/CustomAction";
import { Unique } from "../BasicTypes";
import { PlayerEntity } from "../entity/PlayerEntity";

export class InventoryTask implements Unique, GameObject {

    uid: number;

    constructor(uid: number) {
        this.uid = uid;
    }


    getActionGroups(actor: PlayerEntity): ActionGroup[] {
        const menu: ActionGroup = new CustomActionGroup({
            title: "菜单",
            description: `共${actor.inventory.count()}项物品`,
            actions: [
                new CustomAction({
                    text: "返回",
                    act: ({ game }) => game.removeInteravtiveGroup(this),
                    labels: [],
                }),
            ],
            labels: ["menu"],
        });

        const itemGroups: ActionGroup[] = actor.inventory.getItems().map(item => new CustomActionGroup({
            title: item.name,
            description: "",
            actions: item.getItemActions(actor),
            labels: ["item"],
        }));

        for (const slot of actor.inventory.getSpecialSlots()) {
            const item = slot.item;
            if (!item) continue;

            itemGroups.unshift(new CustomActionGroup({
                title: item.name,
                description: "",
                actions: [new CustomAction({
                    text: `取下该${slot.type.name}` ,
                    labels: ['unequip'],
                    act: (actor) => {
                        const item = slot.set(null);
                        if (item) {
                            actor.appendOrDropItem(item);
                        }
                    },
                })],
                labels: ["item"],
            }));
        }

        return [
            menu,
            ...itemGroups,
        ]
    }

}