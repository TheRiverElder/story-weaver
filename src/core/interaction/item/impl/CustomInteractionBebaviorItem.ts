import { PlayerEntity } from "../../../entity/PlayerEntity";
import { Interaction } from "../../Interaction";
import GenericInteractionBehaviorItem, { GenericInteractionBehaviorItemData } from "../GenericInteractionBehaviorItem";

export interface CustomInteractionBebaviorItemData extends GenericInteractionBehaviorItemData {
    isVisible?: (player: PlayerEntity) => boolean;
    onSolve?: (interaction: Interaction) => void;
    onFail?: (interaction: Interaction) => void;
    onReview?: (player: PlayerEntity) => void;
}

export default class CustomInteractionBebaviorItem extends GenericInteractionBehaviorItem {
    protected onSolveCallback?: (interaction: Interaction) => void;
    protected onFailCallback?: (interaction: Interaction) => void;
    protected isVisibleCallback?: (player: PlayerEntity) => boolean;
    protected onReviewCallback?: (player: PlayerEntity) => void;

    constructor(args: CustomInteractionBebaviorItemData) {
        super(args);
        this.onSolveCallback = args.onSolve;
        this.onFailCallback = args.onFail;
        this.onReviewCallback = args.onReview;
        this.isVisibleCallback = args.isVisible;
    }

    isVisible(player: PlayerEntity) {
        if (this.isVisibleCallback) return this.isVisibleCallback(player);
        else return true;
    }

    onSolve(interaction: Interaction): void {
        if (this.onSolveCallback) this.onSolveCallback(interaction);
    }

    onFail(interaction: Interaction): void {
        if (this.onFailCallback) this.onFailCallback(interaction);
    }
    
    onReview(player: PlayerEntity): void {
        if (this.onReviewCallback) this.onReviewCallback(player);
    }
    
}