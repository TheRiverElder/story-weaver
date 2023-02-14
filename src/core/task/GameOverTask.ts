import { ActionGroup, ActionParams, InteractiveGroup, Unique } from "../common";
import { Game } from "../Game";

export class GameOverTask implements Unique, InteractiveGroup {

    public readonly uid: number;
    public readonly game: Game;
    public readonly reason: string;

    constructor(game: Game, reason?: string) {
        this.uid = game.uidGenerator.generate();
        this.game = game;
        this.reason = reason || "";
    }

    getActionGroups(params: ActionParams): ActionGroup[] {
        return [{
            source: this,
            title: "游戏结束",
            description: this.reason,
            actions: [{
                text: "重来",
                act: () => this.game.gameOverListeners.forEach(l => l(this.game)),
                labels: [],
            }],
            labels: ["menu"],
        }];
    }

}