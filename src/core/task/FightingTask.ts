import { ActionGroup, ActionParams, InteractiveGroup, Unique } from "../common";
import { LivingEntity } from "../entity/LivingEntity";
import { Game } from "../Game";
import { InventoryTask } from "./InventoryTask";

export class FightingTask implements Unique, InteractiveGroup {

    uid: number;
    private readonly participants: LivingEntity[];

    constructor(uid: number, participants: LivingEntity[] = []) {
        this.uid = uid;
        this.participants = participants;
    }

    escape(entity: LivingEntity, game: Game) {
        this.remove(entity, game);
    }

    remove(entity: LivingEntity, game: Game) {
        const index = this.participants.indexOf(entity);
        if (index < 0) return;
        this.participants.splice(index, 1);
        
        if (this.participants.length === 0 || (this.participants.length === 1 && this.participants[0] === game.adventurer)) {
            game.removeInteravtiveGroup(this);
        }
    }

    attack(source: LivingEntity, target: LivingEntity, game: Game) {
        if (source.dexterity >= target.dexterity) {
            this.sigleAttack(source, target, game) && this.sigleAttack(target, source, game);
        } else {
            this.sigleAttack(target, source, game) && this.sigleAttack(source, target, game);
        }
        if (source.health <= 0) {
            this.remove(source, game);
        }
        if (target.health <= 0) {
            this.remove(target, game);
        }
    }

    sigleAttack(source: LivingEntity, target: LivingEntity, game: Game): boolean {
        if (Math.random() < target.dexterity / 100) {
            game.appendMessage(`${target.name}躲过了${source.name}的攻击`);
        } else {
            const damage = Math.max(0, source.attackPower - target.defensePower);
            target.mutateHealth(-damage);
            game.appendMessage(`${source.name}对${target.name}造成${source.attackPower} - ${target.defensePower} = ${damage} 伤害`);
        }
        if (target.health <= 0) {
            game.appendMessage(`💀${target.name}阵亡！`);
        }
        return target.health > 0;
    }


    getActionGroups(params: ActionParams): ActionGroup[] {
        const menu: ActionGroup = {
            source: this,
            title: "特殊动作",
            description: ``,
            actions: [
                {
                    text: "逃跑",
                    act: ({ game, actor }) => this.escape(actor, game),
                },
                {
                    text: "打开背包",
                    act: ({ game }) => game.appendInteravtiveGroup(new InventoryTask(game.uidGenerator.generate())),
                },
            ],
        };

        const itemGroups: ActionGroup[] = [];
        for (const participant of this.participants) {
            if (participant === params.actor) continue;

            itemGroups.push({
                source: this,
                title: participant.name,
                description: participant.getBrief(),
                actions: [{
                    text: "攻击",
                    act: ({ game, actor }) => {
                        this.attack(actor, participant, game);
                    },
                }],
            });
        }

        return [
            menu,
            ...itemGroups,
        ]
    }

}