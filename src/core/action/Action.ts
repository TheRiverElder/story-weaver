import { PlayerEntity } from "../entity/PlayerEntity";

export default interface Action {
    getText(): string;
    act(player: PlayerEntity): void;
    getLabels(): Array<string>;
}