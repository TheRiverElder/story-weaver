import { PlayerEntity } from "../../entity/PlayerEntity";
import { Game } from "../../item/Game";
import { PropertyType } from "../../profile/PropertyType";
import { Interaction } from "../Interaction";
import { InteractionBehaviorItem } from "./InteractionBehaviorItem";

export interface GenericInteractionBehaviorItemData {
    game: Game;
    solved?: boolean;
    validSkills?: Iterable<PropertyType>; // 不填则代表不限技能，注，不用技能也算一种技能
}

export default abstract class GenericInteractionBehaviorItem implements InteractionBehaviorItem {

    protected readonly game: Game;
    protected solved: boolean = false;
    protected validSkills: Set<PropertyType>;

    constructor(args: GenericInteractionBehaviorItemData) {
        this.game = args.game;
        this.solved = args.solved || false;
        this.validSkills = new Set(args.validSkills || []);
    }

    setSolved(player: PlayerEntity) {
        this.solved = true;
    }

    isSolved(player: PlayerEntity): boolean {
        return this.solved;
    }
    
    isValidSkill(skill: PropertyType): boolean { 
        return this.validSkills.has(skill);
    }

    abstract onSolve(interaction: Interaction): void;

    abstract onReview(player: PlayerEntity): void;
}