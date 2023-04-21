import { PlayerEntity } from "../../../entity/PlayerEntity";
import { Interaction } from "../../Interaction";
import GenericInteractionBehaviorItem, { GenericInteractionBehaviorItemData } from "../GenericInteractionBehaviorItem";

export interface CustomInteractionBebaviorItemData extends GenericInteractionBehaviorItemData {
    onSolve?: (interaction: Interaction) => void;
    onReview?: (player: PlayerEntity) => void;
}

export default class CustomInteractionBebaviorItem extends GenericInteractionBehaviorItem {
    protected onSolveCallback?: (interaction: Interaction) => void;
    protected onReviewCallback?: (player: PlayerEntity) => void;

    constructor(args: CustomInteractionBebaviorItemData) {
        super(args);
        this.onSolveCallback = args.onSolve;
        this.onReviewCallback = args.onReview;
    }


    onSolve(interaction: Interaction): void {
        if (this.onSolveCallback) this.onSolveCallback(interaction);
    }
    
    onReview(player: PlayerEntity): void {
        if (this.onReviewCallback) this.onReviewCallback(player);
    }
    
}