import { Action, ActionGroup, ActionParams } from "../common";
import { LivingEntity, LivingEntityData } from "./LivingEntity";

export interface NeutralEntityData extends LivingEntityData {
}

export class NeutralEntity extends LivingEntity {

    constructor(data: NeutralEntityData) {
        super(data);
    }

    getActionGroups(params: ActionParams): ActionGroup[] {
        if (params.actor.uid === this.uid) return [];

        const attackAction: Action = {
            text: '攻击' + this.getBrief(),
            labels: ['attack'],
            act: ({ game, actor }) => game.runAttack(actor, this),
        };
        const talkAction: Action = {
            text: '交谈',
            labels: ['talk'],
            act: ({ game, actor }) => {
                game.appendMessage("Hello, I am " + this.name);
            },
        };
        return [{
            source: this,
            title: this.name,
            description: this.getBrief(),
            actions: [talkAction, attackAction],
        }];
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    getBrief() {
        return `${this.name}（${this.health}/${this.maxHealth}）`;
    }

}