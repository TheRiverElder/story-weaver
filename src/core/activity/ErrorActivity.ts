import ActionGroup from "../action/ActionGroup";
import { PlayerEntity } from "../entity/PlayerEntity";
import GameActivity, { GameActivityProps } from "../structure/GameActivity";

export interface ErrorActivityProps extends GameActivityProps {
    message?: string;
}

export default class ErrorActivity extends GameActivity {

    public readonly message?: string;
    
    constructor(props: ErrorActivityProps) {
        super(props);
        this.message = props.message;
    }

    public getMessageString(): string {
        return this.message ?? "An unknown error occurred";
    }

    public override getActionGroups(player: PlayerEntity): Array<ActionGroup> {
        return [
            {
                title: "Error",
                descriptions: [this.getMessageString()],
                actions: [],
                labels: [],
            },
        ];
    }
}