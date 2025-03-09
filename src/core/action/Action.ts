import { PlayerEntity } from "../entity/PlayerEntity";

// export default interface Action {
//     getText(): string;
//     act(player: PlayerEntity): void;
//     getLabels(): Array<string>;
// }

export default interface Action {
    readonly text: string;
    readonly labels: Array<string>;
    readonly act: (player: PlayerEntity) => void;
}