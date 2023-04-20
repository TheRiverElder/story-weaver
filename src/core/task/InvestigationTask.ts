import { Unique, InteractiveGroup, ActionGroup, ActionParams, Action } from "../common";
import { PlayerEntity } from "../entity/PlayerEntity";
import { Game } from "../Game";
import { InteractionBehavior } from "../InteractionBehavior";
import { PROPERTY_TYPE_WATCH, PROPERTY_TYPE_LISTEN } from "../profile/PropertyTypes";
import { PropertyType } from "../profile/PropertyType";
import { filterNotNull } from "../util/lang";

export class InvestigationTask implements Unique, InteractiveGroup {
    game: Game;
    uid: number;

    name: any;


    constructor(game: Game, ) {
        this.game = game;
        this.uid = game.uidGenerator.generate();    
    }

    getActionGroups(params: ActionParams): ActionGroup[] {
        const menu: ActionGroup = {
            source: this,
            title: "菜单",
            description: "",
            actions: [
                {
                    text: "返回",
                    act: (params: ActionParams) => this.game.removeInteravtiveGroup(this),
                    labels: [],
                },
            ],
            labels: ["menu"],
        };

        return [
            menu,
            ...this.getTargetSelectingActionGroups(params),
        ];
    }

    getTargetSelectingActionGroups(params: ActionParams): ActionGroup[] {
        const actor = params.actor;
        const room = params.actor.room;
        const selfItem: ActionGroup = {
            source: this,
            title: actor.name,
            description: "对自己使用",
            actions: this.getActions(actor, actor.investigatableObject),
        };
        
        const roomItem: ActionGroup | null = room ? {
            source: this,
            title: room.name,
            description: "对当前房间使用",
            actions: this.getActions(actor, actor.investigatableObject),
        } : null;

        const entityItems: ActionGroup[] = (room?.entities.values() || []).filter(entity => entity !== actor).map(entity => ({
            source: this,
            title: entity.name,
            description: entity.brief,
            actions: this.getActions(actor, actor.investigatableObject),
        }));

        return filterNotNull([
            selfItem,
            roomItem,
            ...entityItems,
        ]);
    }

    getActions(actor: PlayerEntity, target: InteractionBehavior | null): Action[] {
        if (!target) return [];
        return [
            {
                text: "回顾线索",
                act: () => this.reviewClues(actor, target),
                labels: [],
            },
            ...this.getSkills().map(skill => ({
                text: skill.name,
                act: () => this.investigate(actor, target, skill),
                labels: [],
            })),
        ];
    }

    getSkills(): PropertyType[] {
        return [
            PROPERTY_TYPE_WATCH,
            PROPERTY_TYPE_LISTEN,
        ];
    }

    investigate(actor: PlayerEntity, target: InteractionBehavior, skill: PropertyType) {
        target.onInvestigate(actor, skill);
    }

    reviewClues(actor: PlayerEntity, target: InteractionBehavior) {
        const discoveredClues = target.getSolvedItems(actor);
        if (discoveredClues.length === 0) {
            this.game.appendMessage(`你没有从其获得过线索。`);
        } else {
            this.game.appendMessage(`你曾发现：`);
            for (const clue of discoveredClues) {
                this.game.appendMessage(clue.text);
            }
        }
    }
}