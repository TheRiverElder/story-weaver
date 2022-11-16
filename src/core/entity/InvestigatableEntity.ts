import { ActionParams, ActionGroup, Action } from "../common";
import { Entity, EntityData } from "../Entity";
import { Game } from "../Game";
import { PropertyType } from "../profile/PropertyType";
import { simpleCheck } from "../task/FightingTask";
import { PlayerEntity } from "./PlayerEntity";

export interface Clue {
    validSkills: Set<PropertyType>;
    text: string;
    discoverd: boolean;
    onDiscover?: (clue: Clue, entity: InvestigatableEntity, prams: ActionParams) => void;
}

export interface InvestigatableEntityData extends EntityData {
    brief: string;
    clues: Clue[];
    maxInvestigationAmount: number;
}

export class InvestigatableEntity extends Entity {
    brief: string;
    clues: Clue[];
    maxInvestigationAmount: number;

    constructor(data: InvestigatableEntityData) {
        super(data);
        this.brief = data.brief;
        this.clues = data.clues;
        this.maxInvestigationAmount = data.maxInvestigationAmount;
    }


    getActionGroups(params: ActionParams): ActionGroup[] {
        const skills = new Set<PropertyType>();

        for (const clue of this.clues) {
            if (clue.discoverd) continue;
            clue.validSkills.forEach(s => skills.add(s));
        }

        const actions: Action[] = [{
            text: "回顾线索",
            act: ({ game }) => this.reviewClues(game),
        }];

        for (const skill of Array.from(skills)) {
            actions.push({
                text: '🔍' + skill.name,
                act: ({ game, actor }) => this.onApplySkill(actor, game, skill),
            });
        }

        return [{
            source: this,
            title: this.name,
            description: this.getBrief() + (skills.size === 0 ? "\n没有什么值得调查的了" : ""),
            actions,
        }]
    }

    onApplySkill(actor: PlayerEntity, game: Game, type: PropertyType) {
        const newClues: Clue[] = [];
        if (simpleCheck(actor.profile.getProperty(type))) {
            for (const clue of this.clues) {
                if (clue.discoverd || !clue.validSkills.has(type)) continue;
                newClues.push(clue);
            }
        }

        if (newClues.length > 0) {
            game.appendMessage(`❗你发现${this.name}：`);
            for (const clue of newClues) {
                clue.discoverd = true;
                game.appendMessage(clue.text);
                if (clue.onDiscover) {
                    clue.onDiscover(clue, this, { game, actor });
                }
            }
        } else {
            game.appendMessage(`你什么也没发现。`);
        }
    }

    reviewClues(game: Game) {
        const discoveredClues = this.clues.filter(clue => clue.discoverd);
        if (discoveredClues.length === 0) {
            game.appendMessage(`你没有从${this.name}获得过线索。`);
        } else {
            game.appendMessage(`你曾发现关于${this.name}的：`);
            for (const clue of discoveredClues) {
                game.appendMessage(clue.text);
            }
        }
    }
    
    getBrief(): string {
        return this.brief;
    }

}