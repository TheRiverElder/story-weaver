import ActionGroup from "../action/ActionGroup";
import GameObject from "../action/GameObject";
import { Uid } from "../BasicTypes";
import { PlayerEntity } from "../entity/PlayerEntity";
import { Game } from "../item/Game";

export abstract class Task implements GameObject {
    readonly uid: Uid;
    readonly game: Game;

    constructor(uid: Uid, game: Game) {
        this.uid = uid;
        this.game = game;
    }

    abstract getActionGroups(actor: PlayerEntity): ActionGroup[];
}