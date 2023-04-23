import { InteractionTarget } from "../interaction/Interaction";
import Action from "./Action";

// 这个数据结构在UI上显示为一张卡牌
export default interface ActionGroup {
    getTitle(): string;
    getDescription(): string;
    getActions(): Array<Action>;
    getLabels(): Array<string>; // 该方法原本用于标记功能，现在用于标记样式，之后应该会改用专门修改样式的方法
    getTarget(): InteractionTarget; // 该方法用于获取用于Interaction的对象
};