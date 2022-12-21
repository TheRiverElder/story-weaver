import { ActionGroup, ActionParams, InteractiveGroup, Unique } from "../common";
import { LivingEntity } from "../entity/LivingEntity";
import { Game } from "../Game";
import { InventoryTask } from "./InventoryTask";

export enum FightingActionType {
    WAITING,
    SKIP,
    DONE,
}

export class Participant {
    public readonly entity: LivingEntity; 
    public readonly ordinal: number; 
    public removed: boolean = false; 
    public lastActionType: FightingActionType = FightingActionType.DONE; 

    constructor(entity: LivingEntity, ordinal: number) {
        this.entity = entity;
        this.ordinal = ordinal;
    }
}

export class FightingTask implements Unique, InteractiveGroup {

    public readonly uid: number;
    public readonly game: Game;
    public readonly participants: Participant[];
    private index: number = 0;
    private finished: boolean = false;
    // 按照执行顺序轮到的参与者
    private currentParticipant: Participant | null = null;
    // 真正能执行的参与者
    private pendingParticipant: Participant | null = null;
    private skipCounter: number = 0;
    private escapingParticipant: Participant | null = null;
    private escapingIndex: number = 0;
    private escapingFinished: boolean = true;

    constructor(game: Game, entities: LivingEntity[] = []) {
        this.uid = game.uidGenerator.generate();
        this.game = game;
        this.participants = entities.map((entity, index) => new Participant(entity, index));
    }

    private sort() {
        this.participants.sort((a, b) => a.entity.dexterity - b.entity.dexterity);
    }

    private turn() {
        this.index = (this.index + 1) % this.participants.length;
        this.pendingParticipant = this.currentParticipant = this.participants[this.index];
    }

    continueRound() {
        while (!this.finished) {
            if (!this.currentParticipant) {
                if (this.participants.length === 0) return;
                this.currentParticipant = this.participants[this.index];
            }
            this.pendingParticipant = this.currentParticipant;

            if (this.checkFinished()) return;

            if (this.currentParticipant.removed) {
                this.skipCounter++;
                continue;
            }

            // console.log(this.currentParticipant.entity.name);
            const actiontype = this.currentParticipant.entity.onFightTurn(this);
            // console.log(this.currentParticipant.entity.name, actiontype);

            switch (actiontype) {
                case FightingActionType.WAITING: {
                    return;
                }
                case FightingActionType.SKIP: { 
                    this.skipCounter++;
                    break;
                }
                case FightingActionType.DONE: {
                    this.skipCounter = 0;
                    break;
                }
            }
        }

        if (this.checkFinished()) return;
    }

    checkCanAct(entity: LivingEntity): boolean {
        return !this.finished && !!this.pendingParticipant && entity === this.pendingParticipant.entity;
    }

    skip(entity: LivingEntity) {
        if (!this.checkCanAct(entity)) return;
        this.skipCounter++;
        this.turn();
    }

    escape(entity: LivingEntity) {
        const escapingParticipant = this.participants.find(p => p.entity === entity);
        if (!escapingParticipant || !this.checkCanAct(entity)) return;
        this.skipCounter = 0;
 
        if (simpleCheck(entity.dexterity)) {

            this.escapingFinished = false;
            this.escapingParticipant = escapingParticipant;

            this.escapingIndex = 0;
            
            this.continueEscape();
        } else {
            this.game.appendMessage(`${entity.name}逃跑失败！`);
            this.turn();
        }
    }

    continueEscape() {
        if (!this.escapingParticipant) return;

        while (this.escapingIndex < this.participants.length && !this.escapingFinished) {
            const participant = this.participants[this.escapingIndex];
            if (participant.removed || participant.entity === this.escapingParticipant.entity) {
                this.escapingIndex++;
                continue;
            }

            this.pendingParticipant = participant;
            const actiontype = participant.entity.onFightEscape(this.escapingParticipant.entity, this);
            switch (actiontype) {
                case FightingActionType.WAITING: {
                    this.pendingParticipant = participant;
                    return;
                }
                case FightingActionType.SKIP: {
                    this.escapingIndex++;
                    break;
                }
                case FightingActionType.DONE: {
                    this.escapingIndex++;
                    break;
                }
            }
        }

        if (this.escapingIndex >= this.participants.length && !this.escapingFinished) {
            this.remove(this.escapingParticipant.entity);

            this.game.appendMessage(`${this.escapingParticipant.entity.name}逃跑成功！`);

            this.escapingParticipant = null;
            this.escapingIndex = 0;
            this.escapingFinished = true;
        }

        this.continueEscape();
    }

    private remove(entity: LivingEntity) {
        const participant = this.participants.find(participant => participant.entity === entity);
        if (participant) {
            participant.removed = true;
        }
        this.checkFinished();
    }

    private checkFinished(): boolean {
        if (!this.finished) {
            if (this.skipCounter >= this.participants.length) {
                this.finished = true;
            } else {
                const remained = this.participants.filter(p => !p.removed);
                if (remained.length === 0 || (remained.length === 1 && remained[0].entity === this.game.adventurer)) {
                    this.finished = true;
                }
            }
        }
        // console.log(this.participants, this.finished);
        if (this.finished) {
            this.game.removeInteravtiveGroup(this);
        }

        return this.finished;
    }

    attack(source: LivingEntity, target: LivingEntity) {
        if (!this.checkCanAct(source)) return;
        this.skipCounter = 0;
        
        const sourceFirst: boolean = !simpleCheck(target.dexterity) || simpleCheck(source.dexterity);
        let prefix = sourceFirst ? `🗡${source.name} 对 ${target.name} 发起攻击：` : `🗡${source.name} 进攻 ${target.name} 失败，反被回击：`;
        
        if (sourceFirst) {
            this.sigleAttack(source, target, prefix);
        } else {
            this.sigleAttack(target, source, prefix);
        }
        if (source.health <= 0) {
            this.remove(source);
        }
        if (target.health <= 0) {
            this.remove(target);
        }

        this.turn();
    }

    private sigleAttack(source: LivingEntity, target: LivingEntity, prefix: string, isStrike: boolean = false): boolean {
        if (Math.random() < target.dexterity / 100) {
            this.game.appendMessage(prefix + `${target.name}躲过了${source.name}的攻击！`);
        } else {
            if (isStrike) {
                this.escapingFinished = true;
            }
            const damage = Math.max(0, source.attackPower - target.defensePower);
            target.mutateHealth(-damage);
            this.game.appendMessage(prefix + `${source.name}对${target.name}造成${damage}点伤害！`);
    
            if (target.health <= 0) {
                this.game.appendMessage(`💀${target.name}阵亡！`);
            }
        }
        return target.health > 0;
    }

    strike(source: LivingEntity) {
        if (!this.escapingParticipant) return;
        
        this.sigleAttack(source, this.escapingParticipant.entity, `${source.name}试图阻截${this.escapingParticipant.entity.name}：`, true);
    }

    release() {
        if (!this.escapingParticipant) return;
        this.escapingIndex++;
    }


    getActionGroups(params: ActionParams): ActionGroup[] {
        if (this.escapingParticipant) {
            return [{
                source: this,
                title: this.escapingParticipant.entity.name,
                description: this.escapingParticipant.entity.getBrief(),
                actions: [
                    {
                        text: "追击",
                        act: ({ actor }) => {
                            if (!this.escapingParticipant) return;

                            if (simpleCheck(actor.dexterity)) {
                                this.strike(actor);
                                this.continueEscape();
                            } else {
                                this.game.appendMessage(`${actor.name}追击${this.escapingParticipant.entity.name}失败！`);
                            }
                        },
                    },
                    {
                        text: "放走",
                        act: () => {
                            this.release();
                            this.continueEscape();
                        },
                    },
                ]
            }];
        }

        const menu: ActionGroup = {
            source: this,
            title: "特殊动作",
            description: ``,
            actions: [
                {
                    text: "逃跑",
                    act: ({ actor }) => {
                        this.escape(actor);
                        this.continueRound();
                    },
                },
                {
                    text: "打开背包",
                    act: ({ game }) => game.appendInteravtiveGroup(new InventoryTask(game.uidGenerator.generate())),
                },
            ],
            labels: ["menu"],
        };

        const itemGroups: ActionGroup[] = [];
        for (const participant of this.participants) {
            if (participant.entity === params.actor) continue;

            itemGroups.push({
                source: this,
                title: participant.entity.name,
                description: participant.entity.getBrief(),
                actions: [{
                    text: "攻击",
                    act: ({ actor }) => {
                        this.attack(actor, participant.entity);
                        this.continueRound();
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

export function simpleCheck(value: number): boolean {
    return Math.floor(Math.random() * 100) + 1 <= value;
}