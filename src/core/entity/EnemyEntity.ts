import { Action, ActionGroup, ActionParams } from "../common";
import { FightingActionType, FightingTask } from "../task/FightingTask";
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
                const fighting = new FightingTask(game, [actor, this]);
                game.appendInteravtiveGroup(fighting);
                fighting.continueRound();
            },
        };
        return [{
            source: this,
            title: this.name,
            description: this.brief,
            actions: [attackAction],
            labels: ["living-entity"],
            target: this,
        }];
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    get brief() {
        return `💢${this.name}（${this.health}/${this.maxHealth}♥）`;
    }

    onFightTurn(fighting: FightingTask): FightingActionType {
        const enemy = fighting.participants.find(p => p.entity.tags.has("human"));
        if (enemy) {
            fighting.attack(this, enemy.entity);
            return FightingActionType.DONE;
        } else return FightingActionType.SKIP;
    }

    onFightEscape(entity: LivingEntity, fighting: FightingTask): FightingActionType {
        if (entity.tags.has("human")) {
            fighting.strike(this);
            return FightingActionType.DONE;
        } else {
            fighting.release();
            return FightingActionType.SKIP;
        }
    }

}