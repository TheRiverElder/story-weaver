import { PlayerEntity } from "../../entity/PlayerEntity";
import { PropertyType } from "../../profile/PropertyType";
import { Interaction } from "../Interaction";

export interface InteractionBehaviorItem {

    // 设为已经被破解
    setSolved(player: PlayerEntity): void;

    // 是否已经被破解
    isSolved(player: PlayerEntity): boolean;
    
    // 是否可以使用该技能
    isValidSkill(skill: PropertyType): boolean;
    
    // 已经破解，执行破解后的业务
    onSolve(interaction: Interaction): void;
    
    // 已经破解过，回顾线索
    onReview(player: PlayerEntity): void;
}