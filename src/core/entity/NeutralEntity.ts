import { Action, ActionGroup, ActionParams } from "../common";
import { ChatTask, ChatTextFragment } from "../task/ChatTask";
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

        const actions: Action[] = [];
        actions.push({
            text: '攻击',
            labels: ['attack'],
            act: ({ game, actor }) => {
                const fighting = new FightingTask(game.uidGenerator.generate(), game, [actor, this]);
                game.appendInteravtiveGroup(fighting);
                fighting.continueRound();
            },
        });
        const chatTask = this.chatProvider && this.chatProvider(params);
        if (chatTask) {
            actions.push({
                text: '交谈',
                labels: ['talk'],
                act: ({ game }) => game.appendInteravtiveGroup(chatTask),
            });
        }
        return [{
            source: this,
            title: this.name,
            description: this.getBrief(),
            actions,
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