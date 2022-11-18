import { Action, ActionGroup, ActionParams, InteractiveGroup, Unique } from "./common";
import { PlayerEntity } from "./entity/PlayerEntity";
import { Game } from "./Game";
import { Clue, InvestigatableObject } from "./InvestigatableObject";
import { PropertyType } from "./profile/PropertyType";
import { Room } from "./Room";
import { simpleCheck } from "./task/FightingTask";


export interface EntityData {
    name: string;
    game: Game;
    clues?: Clue[];
    maxInvestigationAmount?: number;
}

export abstract class Entity implements Unique, InteractiveGroup, InvestigatableObject {
    uid: number;
    name: string;
    game: Game;

    room: Room | null = null;

    clues: Clue[];
    maxInvestigationAmount: number;
    investigationAmount: number = 0;

    constructor(data: EntityData) {
        this.name = data.name;
        this.game = data.game;
        this.uid = this.game.uidGenerator.generate();
        this.clues = data.clues || [];
        this.maxInvestigationAmount = data.maxInvestigationAmount || 0;
    }

    remove() {
        this.room?.entities.removeByUid(this.uid);
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    abstract getBrief(): string;

    teleport(room: Room) {
        if (this.room != null) {
            this.room.removeEntity(this);
        }
        room.addEntity(this);
    }
    


    getActionGroups(params: ActionParams): ActionGroup[] {
        return [{
            source: this,
            title: this.name,
            description: this.getBrief(),
            actions: this.getInvestionActions(),
        }];
    }

    getInvestionActions(): Action[] {
        const skills = new Set<PropertyType>();

        if (this.investigationAmount < this.maxInvestigationAmount) {
            for (const clue of this.clues) {
                if (clue.discoverd) continue;
                clue.validSkills.forEach(s => skills.add(s));
            }
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

        return actions;
    }

    onApplySkill(actor: PlayerEntity, game: Game, type: PropertyType) {
        this.investigationAmount++;
        const newClues: Clue[] = [];
        if (simpleCheck(actor.profile.getProperty(type))) {
            for (const clue of this.clues) {
                if (clue.discoverd || !clue.validSkills.has(type)) continue;
                newClues.push(clue);
                break;
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

}