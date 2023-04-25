import { PlayerEntity } from "../entity/PlayerEntity";
import Action from "./Action";

export default interface ActionsSupplier {
    getActions(actor: PlayerEntity): Array<Action>;
}