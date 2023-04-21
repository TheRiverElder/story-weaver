import { ActionGroup, ActionParams, InteractiveGroup, Unique } from "../common";
import { Item } from "../item/Item";
import { filterNotNull } from "../util/lang";

export class UsingItemTask implements Unique, InteractiveGroup {

    uid: number;
    item: Item;

    constructor(item: Item) {
        this.uid = item.game.uidGenerator.generate();
        this.item = item;
    }


    getActionGroups(params: ActionParams): ActionGroup[] {
        const actor = params.actor;
        const menu: ActionGroup = {
            source: this,
            title: `使用物品`,
            description: this.item.name,
            actions: [
                ...this.item.getUsageActions(actor, null),
                {
                    text: "返回",
                    act: ({ game }) => game.removeInteravtiveGroup(this),
                    labels: [],
                },
            ],
            labels: ["menu"],
        };

        const itemGroups: ActionGroup[] = filterNotNull(Array.from(params.actor.room?.entities.values() || []).map(entity => {
            const actions = this.item.getUsageActions(actor, entity);
            if (actions && actions.length > 0) return {
                source: this,
                title: entity.name,
                description: entity.brief,
                actions,
                labels: ["item"],
            };
            return null;
        }));

        return [
            menu,
            ...itemGroups,
        ]
    }

}