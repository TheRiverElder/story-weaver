import { ActionGroup, ActionParams, InteractiveGroup, Unique } from "../common";

export class InventoryTask implements Unique, InteractiveGroup {

    uid: number;

    constructor(uid: number) {
        this.uid = uid;
    }


    getActionGroups(params: ActionParams): ActionGroup[] {
        const actor = params.actor;
        const menu: ActionGroup = {
            source: this,
            title: "菜单",
            description: `共${params.actor.inventory.count()}项物品`,
            actions: [
                {
                    text: "返回",
                    act: ({ game }) => game.removeInteravtiveGroup(this),
                },
            ],
            labels: ["menu"],
        };

        const itemGroups: ActionGroup[] = params.actor.inventory.getItems().map(item => ({
            source: this,
            title: item.name,
            description: "",
            actions: item.getActions(params),
            labels: ["item"],
        }));

        for (const slot of actor.inventory.getSpecialSlots()) {
            const item = slot.item;
            if (!item) continue;

            itemGroups.unshift({
                source: this,
                title: item.name,
                description: "",
                actions: [{
                    text: `取下该${slot.type.name}` ,
                    labels: ['unequip'],
                    act: ({ game, actor }) => {
                        const item = slot.set(null);
                        if (item) {
                            actor.appendOrDropItem(item);
                        }
                    },
                }],
                labels: ["item"],
            });
        }

        return [
            menu,
            ...itemGroups,
        ]
    }

}