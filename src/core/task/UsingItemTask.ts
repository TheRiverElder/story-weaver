import ActionGroup from "../action/ActionGroup";
import CustomActionGroup from "../action/CustomActionGroup";
import GameObject from "../action/GameObject";
import CustomAction from "../action/impl/CustomAction";
import { Unique } from "../BasicTypes";
import { PlayerEntity } from "../entity/PlayerEntity";
import { Item } from "../item/Item";
import { filterNotNull } from "../util/lang";

export class UsingItemTask implements Unique, GameObject {

    uid: number;
    item: Item;

    constructor(item: Item) {
        this.uid = item.game.uidGenerator.generate();
        this.item = item;
    }


    getActionGroups(actor: PlayerEntity): ActionGroup[] {
        const menu: ActionGroup = new CustomActionGroup({
            title: `使用物品`,
            description: this.item.name,
            actions: [
                ...this.item.getUsageActions(actor, null),
                new CustomAction({
                    text: "返回",
                    act: ({ game }) => game.removeInteravtiveGroup(this),
                    labels: [],
                }),
            ],
            labels: ["menu"],
        });

        const itemGroups: ActionGroup[] = filterNotNull(Array.from(actor.room?.entities.values() || []).map(entity => {
            const actions = this.item.getUsageActions(actor, entity);
            if (actions && actions.length > 0) return new CustomActionGroup({
                title: entity.name,
                description: entity.brief,
                actions,
                labels: ["item"],
            });
            return null;
        }));

        return [
            menu,
            ...itemGroups,
        ]
    }

}