import { Action, ActionGroup, ActionParams } from "../common";
import { FightingTask } from "../task/FightingTask";
import { LivingEntity, LivingEntityData } from "./LivingEntity";

export interface EnemyEntityData extends LivingEntityData {
}

export class EnemyEntity extends LivingEntity {

    getActionGroups(params: ActionParams): ActionGroup[] {
        if (params.actor.uid === this.uid) return [];

        const attackAction: Action = {
            text: '攻击',
            labels: ['attack'],
            act: ({ game, actor }) => {
                const fighting = new FightingTask(game.uidGenerator.generate(), [actor, this]);
                game.appendInteravtiveGroup(fighting);
                fighting.attack(actor, this, game);
            },
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