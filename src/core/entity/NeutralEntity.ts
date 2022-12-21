import { ActionGroup, ActionParams } from "../common";
import { ChatTask } from "../task/ChatTask";
import { FightingActionType, FightingTask } from "../task/FightingTask";
import { LivingEntity, LivingEntityData } from "./LivingEntity";

export interface NeutralEntityData extends LivingEntityData {
    chatProvider?: (params: ActionParams) => ChatTask | null;
}

export class NeutralEntity extends LivingEntity {
    chatProvider: ((params: ActionParams) => ChatTask | null) | null;

    constructor(data: NeutralEntityData) {
        super(data);
        this.chatProvider = data.chatProvider || null;
    }

    getActionGroups(params: ActionParams): ActionGroup[] {
        if (params.actor.uid === this.uid) return [];

        const groups = super.getActionGroups(params);
        groups[0]?.actions.push({
            text: '攻击',
            labels: ['attack'],
            act: ({ game, actor }) => {
                const fighting = new FightingTask(game, [actor, this]);
                game.appendInteravtiveGroup(fighting);
                fighting.continueRound();
            },
        });
        return groups;
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