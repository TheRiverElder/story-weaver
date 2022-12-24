import { Uid } from "./BasicTypes";
import { ActionGroup, ActionParams, InteractiveGroup } from "./common";
import { Game } from "./Game";

export abstract class Task implements InteractiveGroup {
    readonly uid: Uid;
    readonly game: Game;

    constructor(uid: Uid, game: Game) {
        this.uid = uid;
        this.game = game;
    }

    abstract getActionGroups(params: ActionParams): ActionGroup[];
}