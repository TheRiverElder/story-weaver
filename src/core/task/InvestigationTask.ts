import { PlayerEntity } from "../entity/PlayerEntity";
import { Game } from "../item/Game";
import { InteractionBehavior } from "../interaction/InteractionBehavior";
import { PROPERTY_TYPE_WATCH, PROPERTY_TYPE_LISTEN } from "../profile/PropertyTypes";
import { PropertyType } from "../profile/PropertyType";
import { filterNotNull } from "../util/lang";
import { INTERACTION_MEDIA_EMPTY } from "../interaction/Interaction";
import Action from "../action/Action";
import ActionGroup from "../action/ActionGroup";
import { Unique } from "../BasicTypes";
import CustomActionGroup from "../action/CustomActionGroup";
import CustomAction from "../action/impl/CustomAction";
import GameObject from "../action/GameObject";

export class InvestigationTask implements Unique, GameObject {
    game: Game;
    uid: number;

    name: any;


    constructor(game: Game, ) {
        this.game = game;
        this.uid = game.uidGenerator.generate();    
    }

    getActionGroups(actor: PlayerEntity): ActionGroup[] {
        const menu: ActionGroup = new CustomActionGroup({
            title: "菜单",
            description: "",
            actions: [
                new CustomAction({
                    text: "返回",
                    act: (actor: PlayerEntity) => this.game.removeInteravtiveGroup(this),
                    labels: [],
                }),
            ],
            labels: ["menu"],
        });

        return [
            menu,
            ...this.getTargetSelectingActionGroups(actor),
        ];
    }

    getTargetSelectingActionGroups(actor: PlayerEntity): ActionGroup[] {
        const room = actor.room;
        const selfItem: ActionGroup = new CustomActionGroup({
            title: actor.name,
            description: "对自己使用",
            actions: this.getActions(actor, actor.interactionBehavior),
        });
        
        const roomItem: ActionGroup | null = room ? new CustomActionGroup({
            title: room.name,
            description: "对当前房间使用",
            actions: this.getActions(actor, actor.interactionBehavior),
        }) : null;

        const entityItems: ActionGroup[] = (room?.entities.values() || []).filter(entity => entity !== actor).map(entity => new CustomActionGroup({
            title: entity.name,
            description: entity.brief,
            actions: this.getActions(actor, actor.interactionBehavior),
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
            new CustomAction({
                text: "回顾线索",
                act: () => this.reviewClues(actor, target),
                labels: [],
            }),
            ...this.getSkills().map(skill => new CustomAction({
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
        const media = actor.inventory.weaponSlot.get() || INTERACTION_MEDIA_EMPTY;
        this.game.interact({ actor, media, skill, target });
    }

    reviewClues(actor: PlayerEntity, target: InteractionBehavior) {
        const solvedClues = target.getSolvedItems(actor);
        if (solvedClues.length === 0) {
            this.game.appendMessage(`你没有从其获得过线索。`);
        } else {
            this.game.appendMessage(`你曾发现：`);
            for (const clue of solvedClues) {
                clue.onReview(actor);
            }
        }
    }
}