import Action from "../action/Action";
import ActionGroup from "../action/ActionGroup";
import { PlayerEntity } from "../entity/PlayerEntity";
import EntityComponent from "./EntityComponent";
import GameObject from "./GameObject";

export type EntityProps = {
    name?: string;
    components?: Array<EntityComponent>;
};

export default class Entity extends GameObject<EntityComponent> {
    
    public name: string;

    constructor(options: EntityProps) {
        super(options);
        this.name = options.name || '???';
    }

    public getActionGroup(player: PlayerEntity): ActionGroup {

        const title = this.components.reduce((t, c) => c.modifyTitle(t), this.name);
        const descriptions = this.components.reduce((d, c) => c.modifyDescriptions(d), [] as string[]);
        const actions = this.components.reduce((a, c) => c.modifyActions(a), [] as Array<Action>);

        return {
            title,
            descriptions,
            actions,
            labels: [],
        };
    }
}