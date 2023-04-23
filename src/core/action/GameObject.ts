import { PlayerEntity } from "../entity/PlayerEntity";
import ActionGroup from "./ActionGroup";

export default interface GameObject {
    getActionGroups(actor: PlayerEntity): Array<ActionGroup>;
}