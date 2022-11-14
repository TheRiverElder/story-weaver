import { Action, ActionGroup, ActionParams } from "../common";
import { LivingEntity, LivingEntityData } from "./LivingEntity";

export interface EnemyEntityData extends LivingEntityData {
}

export class EnemyEntity extends LivingEntity {

    constructor(data: EnemyEntityData) {
        super(data);
    }

    getActionGroups(params: ActionParams): ActionGroup[] {
        if (params.actor.uid === this.uid) return [];

        const attackAction: Action = {
            text: '攻击' + this.getBrief(),
            labels: ['attack'],
            act: ({ game, actor }) => game.runAttack(actor, this),
        };
        return [{
            source: this,
            title: this.name,
            description: this.getBrief(),
            actions: [attackAction],
        }];
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    getBrief() {
        return `【敌人】${this.name}（${this.health}/${this.maxHealth}）`;
    }

}