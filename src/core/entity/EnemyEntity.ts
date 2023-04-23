import Action from "../action/Action";
import ActionGroup from "../action/ActionGroup";
import CustomAction from "../action/impl/CustomAction";
import { InteractionTarget } from "../interaction/Interaction";
import { FightingActionType, FightingTask } from "../task/FightingTask";
import { LivingEntity, LivingEntityData } from "./LivingEntity";
import { PlayerEntity } from "./PlayerEntity";

export interface EnemyEntityData extends LivingEntityData {
}

export class EnemyEntity extends LivingEntity implements ActionGroup {

    getActionGroups(player: PlayerEntity): ActionGroup[] {
        if (player.uid === this.uid) return [];
        else return [this];
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
    
    getTitle(): string {
        return this.name;
    }

    getDescription(): string {
        return this.brief;
    }

    getActions(): Action[] {
        return [
            new CustomAction({
                text: '攻击',
                labels: ['attack'],
                act: (actor) => {
                    const fighting = new FightingTask(this.game, [actor, this]);
                    this.game.appendInteravtiveGroup(fighting);
                    fighting.continueRound();
                },
            }),
        ];
    }

    getLabels(): string[] {
        return ["living-entity"];
    }

    getTarget(): InteractionTarget {
        return this.interactionBehavior;
    }

}