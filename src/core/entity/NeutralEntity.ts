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