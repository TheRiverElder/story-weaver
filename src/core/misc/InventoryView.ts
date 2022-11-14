import { ActionGroup, ActionParams, InteractiveGroup, Unique } from "../common";

export class InverntoryView implements Unique, InteractiveGroup {

    uid: number;

    constructor(uid: number) {
        this.uid = uid;
    }


    getActionGroups(params: ActionParams): ActionGroup[] {
        const actor = params.actor;
        const menu: ActionGroup = {
            source: this,
            title: "菜单",
            description: `共${params.actor.inventory.size}项物品`,
            actions: [
                {
                    text: "返回",
                    act: ({ game }) => game.removeInteravtiveGroup(this),
                },
            ],
        };

        const itemGroups: ActionGroup[] = Array.from(params.actor.inventory.values()).map(item => ({
            source: this,
            title: item.name,
            description: "",
            actions: [{
                text: '装备' + item.name,
                labels: ['use'],
                act: ({ game, actor }) => {
                    actor.inventory.removeByUid(item.uid);
                    actor.equipWeapon(item);
                },
            }],
        }));
        if (actor.armor) {
            itemGroups.unshift({
                source: this,
                title: actor.armor.name,
                description: "",
                actions: [{
                    text: '取下' + actor.armor.name,
                    labels: ['unequip'],
                    act: ({ game, actor }) => {
                        if (actor.armor) {
                            actor.unequipArmor();
                            game.appendMessage(`取下${actor.armor.name}`);
                        }
                    },
                }],
            });
        }
        if (actor.weapon) {
            itemGroups.unshift({
                source: this,
                title: actor.weapon.name,
                description: "",
                actions: [{
                    text: '取下' + actor.weapon.name,
                    labels: ['unequip'],
                    act: ({ game, actor }) => {
                        if (actor.weapon) {
                            actor.unequipWeapon();
                            game.appendMessage(`取下${actor.weapon.name}`);
                        }
                    },
                }],
            });
        }

        return [
            menu,
            ...itemGroups,
        ]
    }

}