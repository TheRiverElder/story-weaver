import ActionGroup from "../action/ActionGroup";
import { PlayerEntity } from "../entity/PlayerEntity";
import { Game } from "../item/Game";

export interface GameActivityProps {
    game: Game;
}

export default class GameActivity<R = void> {


    public readonly game: Game;

    constructor(props: GameActivityProps) {
        this.game = props.game;
    }


    public onAdded() { }

    public onRemoved() { }
    
    finish() {
        this.game.finishActivity(this);
    }

    public getActionGroups(player: PlayerEntity): Array<ActionGroup> {
        return [];
    }

    private _hasResult = false;
    public get hasResult(): boolean {
        return this._hasResult;
    }

    private _result?: R;
    public get result(): R | undefined {
        return this._result;
    }
    protected set result(result: R) {
        this._result = result;
        this._hasResult = true;
    }
    
    protected clearResult() {
        this._hasResult = false;
        this._result = undefined;
    }


}