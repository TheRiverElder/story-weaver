import ActionGroup from "../action/ActionGroup";
import CustomActionGroup from "../action/CustomActionGroup";
import GameObject from "../action/GameObject";
import CustomAction from "../action/impl/CustomAction";
import { Unique } from "../BasicTypes";
import { PlayerEntity } from "../entity/PlayerEntity";
import { Game } from "../item/Game";

export class GameOverTask implements Unique, GameObject {

    public readonly uid: number;
    public readonly game: Game;
    public readonly reason: string;

    constructor(game: Game, reason?: string) {
        this.uid = game.uidGenerator.generate();
        this.game = game;
        this.reason = reason || "";
    }

    getActionGroups(actor: PlayerEntity): ActionGroup[] {
        return [new CustomActionGroup({
            title: "游戏结束",
            description: this.reason,
            actions: [new CustomAction({
                text: "重来",
                act: () => this.game.gameOverListeners.forEach(l => l(this.game)),
                labels: [],
            })],
            labels: ["menu"],
        })];
    }

}