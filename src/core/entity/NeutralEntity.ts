import { Action, ActionGroup, ActionParams } from "../common";
import { ChatTask, ChatTextFragment } from "../task/ChatTask";
import { FightingActionType, FightingTask } from "../task/FightingTask";
import { LivingEntity, LivingEntityData } from "./LivingEntity";

export interface NeutralEntityData extends LivingEntityData {
    chatTextFragments?: ChatTextFragment[];
    chatStartFragmentId?: string | number;
}

export class NeutralEntity extends LivingEntity {
    chatTextFragments: ChatTextFragment[] | null;
    chatStartFragmentId: string | number;

    constructor(data: NeutralEntityData) {
        super(data);
        this.chatTextFragments = data.chatTextFragments || null;
        this.chatStartFragmentId = data.chatStartFragmentId || 0;
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
        if (this.chatTextFragments) {
            actions.push({
                text: '交谈',
                labels: ['talk'],
                act: ({ game }) => {
                    if (!this.chatTextFragments) return;
                    
                    const chat = new ChatTask(game.uidGenerator.generate(), game, this.chatTextFragments, this.chatStartFragmentId);
                    game.appendInteravtiveGroup(chat);
                },
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