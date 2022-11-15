import { Action, ActionGroup, ActionParams } from "../common";
import { FightingActionType, FightingTask } from "../task/FightingTask";
import { LivingEntity, LivingEntityData } from "./LivingEntity";

export interface NeutralEntityData extends LivingEntityData {
}

export class NeutralEntity extends LivingEntity {

    getActionGroups(params: ActionParams): ActionGroup[] {
        if (params.actor.uid === this.uid) return [];

        const attackAction: Action = {
            text: '攻击',
            labels: ['attack'],
            act: ({ game, actor }) => {
                const fighting = new FightingTask(game.uidGenerator.generate(), game, [actor, this]);
                game.appendInteravtiveGroup(fighting);
                fighting.continueRound();
            },
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

    onFightTurn(fighting: FightingTask): FightingActionType {
        fighting.skip(this);
        return FightingActionType.DONE;
    }

    onFightEscape(entity: LivingEntity, fighting: FightingTask): FightingActionType {
        fighting.release();
        return FightingActionType.SKIP;
    }

}